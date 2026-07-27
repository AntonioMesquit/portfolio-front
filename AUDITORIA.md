# Auditoria Técnica — Portfólio + Blog de Antonio Mesquita

Next.js 16.1.4 (App Router) · React 19.2.3 · TypeScript 5 · Tailwind 4 · TanStack Query 5
Análise 100% estática sobre `c:\Users\anton\Downloads\portfolio-front-main\portfolio-front-main`
136 achados verificados adversarialmente, consolidados aqui em cerca de 65 defeitos distintos.

---

## Veredito

É um portfólio pessoal com blog acoplado a uma API NestJS externa, bem organizado em módulos por feature, com um sistema de fallback deliberado (`app/lib/default-post.ts`) que mantém o blog funcional com o backend fora do ar — isso é bom design e foi verificado funcionando. O CSS é consistente, a tipagem é estrita e o `generateMetadata` de artigo é server-side de verdade.

O que dói: **(1)** o `AppLoader` no layout raiz condiciona `{children}` a estado de cliente, então o HTML servido de *todas* as rotas é um spinner — o site não tem corpo indexável e o LCP tem piso artificial de 1,2 s pós-hidratação; **(2)** o painel `/tonio` cria posts e categorias sem uma única linha de autenticação em todo o repositório, e é divulgado como link clicável em `/sobre-o-site`; **(3)** o produto não converte: no desktop não existe nenhum caminho de contato (nem menu, nem CTA, nem footer), nenhum projeto tem link, e `/contato` e `/resumo` renderizam texto branco sobre fundo branco.

---

## Os 5 problemas que eu resolveria primeiro

### 1. O painel `/tonio` não tem autenticação e as mutations não enviam credencial nenhuma
`app/tonio/page.tsx:28` · `app/lib/api.ts:68` e `:84` · `middleware.ts:4-8`

`AdminTonioPage` monta direto e chama `useCreatePost`/`useCreateCategory`; `createPost`/`createCategory` fazem `fetch(POST)` com apenas `Content-Type`, sem `Authorization`, sem `credentials`, sem CSRF. O `middleware.ts` casa `/tonio` pelo matcher e só faz `response.headers.set("x-pathname", …)`. Grep case-insensitive por `auth|login|session|token|password|senha|credential|cookie` em todo o código-fonte: zero ocorrências reais. E a rota é **anunciada**: `app/sobre-o-site/page.tsx:45` renderiza `{ path: "/tonio", label: "Admin" }` como `<Link>`, `app/lib/default-post.ts:139` cita o painel no artigo em destaque, e `app/lib/metadata.ts:31-34` gera `<title>Admin | Antonio Mesquita</title>` sem `robots`, sem `app/robots.ts`.

Por que importa: se a API aceitar escrita anônima, qualquer visitante publica conteúdo assinado "Antonio Mesquita" no domínio — defacement, SEO spam, phishing. Se a API exigir auth, o painel simplesmente não funciona. Não há terceira hipótese, porque não existe fluxo de login em lugar nenhum do front.

Correção, em ordem de obrigatoriedade:

1. **Backend (obrigatório, fora deste repo):** exigir autenticação em `POST /posts` e `POST /categories`. Gatear o middleware **não fecha a brecha** — `curl -X POST $NEXT_PUBLIC_API_URL/posts` continua funcionando contra uma API pública por design.
2. **Front (higiene):** mover as escritas para Route Handlers (`app/api/admin/*`) que leem um cookie httpOnly de sessão no servidor, e gatear a rota:

```ts
// middleware.ts
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/tonio")) {
    const session = request.cookies.get("admin_session")?.value;
    if (!session || !verifySession(session)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  return NextResponse.next();
}
```

3. `robots: { index: false, follow: false }` na metadata de `/tonio`, `app/robots.ts` com `disallow: ["/tonio"]`, e remover a entrada de `app/sobre-o-site/page.tsx:45` e a menção em `default-post.ts:139`.

---

### 2. `AppLoader` esconde a árvore inteira do site atrás de um fetch de cliente com piso artificial de 1200 ms e sem timeout
`app/components/app-loader.tsx:10,15,20-23,54-89` · `app/layout.tsx:44`

`isReady` começa `false`; o `AnimatePresence mode="wait"` só monta `{children}` no ramo `isReady`. Como o AppLoader envolve `<Navbar />` + `{children}` no layout raiz, o HTML de SSR de `/`, `/sobre`, `/projetos`, `/blog`, `/blog/[slug]`, `/tonio` contém **apenas a barra de carregamento**. O `Promise.all([getPosts({limit:50}), getCategories()])` roda em toda rota, inclusive nas que não usam blog, e nenhum fetch de `app/lib/api.ts` passa `signal` ou `AbortSignal.timeout` (grep por `signal|AbortSignal|timeout` em `app/`: zero).

Por que importa: três danos empilhados. **SEO** — nenhum corpo indexável em nenhuma rota (o `<title>`/`description` chegam, o conteúdo não). **Performance** — `startTime` é capturado *dentro* do `useEffect`, então os 1200 ms contam depois da hidratação, somados ao fade de saída de 0,35 s do `mode="wait"`: piso real de ~1,6-1,8 s mesmo com cache quente e API instantânea. **Disponibilidade** — se o backend aceitar a conexão TCP e não responder, `Promise.all` nunca resolve nem rejeita, o `catch` da linha 33 nunca dispara, e o site inteiro fica preso na tela de loading indefinidamente (Chromium não aplica timeout de fetch por padrão).

Este achado precisa ser corrigido **primeiro**: enquanto ele existir, converter `/blog` e `/blog/[slug]` para Server Components não coloca uma linha a mais no HTML.

```tsx
// app/components/app-loader.tsx — renderizar sempre; loader só sobrepõe
return (
  <>
    {children}
    <AnimatePresence>
      {!isReady && (
        <motion.div role="status" aria-live="polite"
          className="fixed inset-0 z-[60] …" exit={{ opacity: 0 }}>
          …
        </motion.div>
      )}
    </AnimatePresence>
  </>
);
```

Eliminar `MIN_LOAD_TIME_MS`, mover o prefetch para o escopo de `/blog` (`prefetchQuery` em `app/blog/layout.tsx` + `HydrationBoundary`), adicionar `AbortSignal.timeout(8000)` em todos os fetches de `api.ts`, e — enquanto o gate existir em qualquer forma — um hard stop independente: `useEffect(() => { const t = setTimeout(() => setIsReady(true), 3000); return () => clearTimeout(t); }, [])`.

---

### 3. `AppLoader` semeia o cache com dados **crus** na mesma chave que os hooks esperam **mesclada**: o post em destaque some da listagem no caminho feliz
`app/components/app-loader.tsx:27-28` vs `app/hooks/use-posts.ts:39` e `app/hooks/use-categories.ts:44`

```ts
queryClient.setQueryData(queryKeys.posts({ limit: 50 }), posts);      // cru
queryClient.setQueryData(queryKeys.categories(), categories);         // cru
```

O `hashKey` do React Query v5 ordena chaves e o `JSON.stringify` descarta propriedades `undefined`. Logo `["posts",{limit:50}]` (AppLoader), `["posts",{category:undefined,search:undefined,limit:50}]` (`app/blog/page.tsx:18-22`) e `["posts",{limit:50}]` (`app/tonio/page.tsx:32`) **colidem na mesma entrada**. O `setQueryData` marca `dataUpdatedAt = agora`; com `staleTime: 1000*60*5` (`use-posts.ts:48`) a query nasce fresca e a `queryFn` — que é quem aplica `mergeWithDefaultPost` — nunca roda.

Por que importa: é o único bug funcional deste relatório que se manifesta **exatamente quando tudo está funcionando**. Com o backend online, `/blog` e `/tonio` exibem a lista crua: o post `"Como funciona o site Antonio Mesquita"` (marcado `featured`) some da listagem, e a categoria "Documentação" perde o `+1` de `mergeWithDefaultCategories` (ou some, se não existir no banco). Basta clicar numa categoria para a chave mudar, a `queryFn` rodar e o post reaparecer do nada — irreproduzível para quem for depurar.

Correção: eliminar a duplicação por construção. Extrair as opções de query dos hooks e reutilizá-las:

```ts
// app/hooks/use-posts.ts
export const postsQueryOptions = (params?: PostsParams) => ({
  queryKey: queryKeys.posts(params),
  queryFn: () => getPosts(params).then((p) => mergeWithDefaultPost(p, params)),
  staleTime: 1000 * 60 * 5,
});

// app-loader.tsx
await queryClient.prefetchQuery(postsQueryOptions({ limit: 50 }));
await queryClient.prefetchQuery(categoriesQueryOptions());
```

---

### 4. O blog inteiro é renderizado no cliente: nenhum artigo é pré-renderizado, nenhuma URL é descobrível
`app/blog/[slug]/page.tsx:1` · `app/blog/page.tsx:1` · sem `generateStaticParams`, sem `app/sitemap.ts`, sem `app/blog/layout.tsx`

Ambas as rotas são `"use client"`. O corpo do artigo (`<MarkdownContent content={post.content} />`, `[slug]/page.tsx:125`) vem de `usePost(slug)`; a listagem vem de `usePosts`/`useCategories`. Grep por `generateStaticParams|export const revalidate|export const dynamic` em código-fonte: zero — a única diretiva de cache é `{ next: { revalidate: 60 } }` dentro do `generateMetadata` de `app/blog/[slug]/layout.tsx:13`. Não existe `app/sitemap.ts`, `app/robots.ts` nem `app/blog/layout.tsx`.

Por que importa: o blog é a única parte do site com conteúdo indexável de verdade, e nenhum `<Link>` para `/blog/[slug]` existe no HTML do servidor — sem sitemap, não há caminho de descoberta. Crawlers que não executam JS (Bing, X, LinkedIn, WhatsApp, Slack, Discord, GPTBot) veem página vazia. `react-markdown` + `react-syntax-highlighter` (Prism completo) vão para o cliente em vez de renderizarem no servidor. E `/blog` nem exporta metadata: herda `<title>Antonio Mesquita</title>` do root layout.

Correção (só produz efeito depois do item 2):

```tsx
// app/blog/[slug]/page.tsx — Server Component
export async function generateStaticParams() {
  const posts = await getPosts({ limit: 200 });
  return posts.map((p) => ({ slug: p.slug }));
}
export const revalidate = 60;

export default async function Page({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  return <PostView post={post} />;   // "use client" só em ShareButtons/TOC/ReadingProgress
}
```

Mais: `app/blog/layout.tsx` exportando `generatePageMetadata("/blog")`, `app/blog/page.tsx` como Server Component buscando a lista inicial e delegando busca/filtro a um filho cliente, e `app/sitemap.ts` gerando entradas a partir de `getPosts()`.

---

### 5. O renderer de código depende da prop `inline`, removida no react-markdown 9: **todo código inline vira bloco de código**
`app/components/blog/markdown/markdown-components.tsx:68-83`

```ts
code: ({ className, children, inline, ...props }) => {
  if (inline) { return <code className="rounded bg-neutral-800 …">{children}</code>; }
  return (<div data-code-block …><barra com bolinhas /><SyntaxHighlighter …/></div>);
}
```

`react-markdown` 10.1 não passa mais props sintéticas para componentes — `inline` é sempre `undefined`, então **todo** `code` cai no caminho de bloco. Isso não é hipotético: `app/lib/default-post.ts:108` e `:115` têm headings com crase simples (`### Listagem (\`/blog\`)`), que passam a renderizar um `<div data-code-block>` inteiro, com barra de título "Text" e três bolinhas coloridas, **dentro de um `<h3>`**. Em parágrafos, o mesmo `<div>` vai parar dentro do `<p>`. Afeta o artigo em destaque do site.

```tsx
code: ({ className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || "");
  if (!match && !String(children).includes("\n")) {
    return <code className="rounded bg-neutral-800 px-1.5 py-0.5 …" {...props}>{children}</code>;
  }
  const language = match ? match[1] : detectLanguage(String(children));
  // … caminho de bloco
}
```

No mesmo arquivo, aproveitar para corrigir o componente `pre` (linhas 50-66): `isCodeBlock` e `isHighlighter` são **sempre false** — `data-code-block` está no `<div>` que `code` *retorna*, não nas props do filho, e `child.type` é a função `code`, nunca `SyntaxHighlighter`. Resultado: todo bloco recebe um `<pre className="… bg-[#1e1e1e] px-5 py-4">` extra, com fundo e padding duplicados. Fix: `pre: ({ children }) => <>{children}</>`.

---

## Corpo do relatório

### Arquitetura e renderização

| Sev | Defeito | Local | Nota |
|---|---|---|---|
| alto | `AppLoader` bloqueia `{children}` no layout raiz + piso de 1200 ms + prefetch global sem timeout | `app/components/app-loader.tsx:10,15,20-23,54-89` | Item 2 do top-5. Corrigir **antes** dos demais desta seção |
| alto | `/blog/[slug]` e `/blog` são Client Components; nenhum conteúdo no HTML | `app/blog/[slug]/page.tsx:1`, `app/blog/page.tsx:1` | Item 4 do top-5 |
| medio | Sem `generateStaticParams` nem ISR de página | `app/blog/[slug]/page.tsx` | Corolário do anterior: hoje é literalmente inaplicável, porque não há nada server-side para pré-renderizar. Não é defeito independente |
| medio | Nenhum arquivo de convenção do App Router: `loading.tsx`, `error.tsx`, `not-found.tsx`, `global-error.tsx` | `app/**` | Soft 404 real: `/blog/qualquer-coisa` responde **200 OK** com "Artigo não encontrado" (`[slug]/page.tsx:37`). Ausência de `error.tsx` custa a UX customizada e o `reset`, não estabilidade (o Next tem página de erro própria em produção) |
| medio | Zero Route Handlers: o browser fala direto com o backend, sem camada de cache do Next, sem onde aplicar rate limit | `app/lib/api.ts:1` | `find app -name route.ts` vazio. Ver também "Camada de dados" |
| baixo | `middleware.ts` roda em quase toda requisição só para setar `x-pathname`, que ninguém lê | `middleware.ts:6,19` | `headers()` lê headers de *requisição*; esse valor seria inacessível de qualquer forma. Não deletar o arquivo — reaproveitá-lo para o gate de `/tonio` e apagar só a linha 6 |
| baixo | `components/ui/timeline.tsx` é scaffold morto da Aceternity, fora de `app/` | `components/ui/timeline.tsx` | Não é "a mesma componente duplicada": é o original em inglês, sem motion, com sintaxe Tailwind v3. O vivo é `app/components/ui/timeline.tsx`. `components.json:17` aponta `ui: "@/components/ui"`, então `npx shadcn add` grava na pasta órfã |

---

### Bugs e correção

**Renderização de Markdown** — o subsistema mais defeituoso do projeto.

| Sev | Defeito | Local |
|---|---|---|
| alto | `inline` sempre `undefined` → todo código inline vira bloco (item 5 do top-5) | `markdown-components.tsx:74` |
| medio | `extractHeadings` varre markdown cru com `/^(#{1,3})\s+(.+)$/gm` sem tratar cercas ` ``` `: comentários shell/Python/YAML viram headings | `extract-headings.ts:11` |
| baixo | `pre` nunca reconhece o bloco customizado: fundo e padding duplicados | `markdown-components.tsx:53-66` |
| baixo | `registerHeading` muta `indexRef` durante o render; o reset só roda quando a identidade de `headings` muda (e ela é estável) | `heading-id-context.tsx:47` |
| baixo | `strong` renderiza `<div>` dentro de `<p>` via `PointerHighlight` | `markdown-components.tsx:143` + `pointer-highlight.tsx:46` |
| baixo | Todos os links do markdown abrem em `target="_blank"`, inclusive âncoras `#secao` do próprio artigo | `markdown-components.tsx:135` |

Os dois primeiros interagem e se agravam: cada heading fantasma capturado dentro de um bloco de código entra no array `headings` que alimenta o mapeamento **posicional** de `registerHeading`, deslocando o id de todos os headings reais seguintes — o TOC passa a apontar para `document.getElementById` que retorna `null` (`table-of-contents.tsx:92`). A correção que resolve os três de uma vez é abandonar as duas fontes de verdade: extrair headings da AST (`unified().use(remarkParse).use(remarkGfm)`, visitando só nós `heading`) ou usar `rehype-slug` e derivar o TOC dos mesmos ids.

Sobre `registerHeading` isoladamente: em produção a divergência só começa no **terceiro** render (o efeito de montagem zera o contador uma vez), e o fallback `slugify(getTextFromChildren(...))` **não** diverge em títulos com formatação inline — `slugify('**Bold** título')` e `slugify('Bold título')` produzem ambos `bold-titulo`. A divergência real é só em títulos **repetidos** (sufixos `-1`/`-2` em `extract-headings.ts:22`) ou texto vazio. Em dev, o StrictMode reproduz já no primeiro carregamento.

Sobre `strong`: não há risco de erro de hidratação (o AppLoader nunca emite essa árvore no SSR) e as classes `w-fit`/`inline-block` não conflitam (tailwind-merge trata como grupos distintos). Sobra o warning `validateDOMNesting` em dev e a não-quebra de linha em negritos longos.

**Painel admin**

| Sev | Defeito | Local | Nota |
|---|---|---|---|
| medio | O efeito de init do editor tem `value` nas deps e reescreve o documento na primeira tecla | `markdown-editor.tsx:25-42` | Com `postContent = ""` o guard `!value?.trim()` sai **antes** de marcar `initialized.current = true`. A primeira tecla dispara `replaceBlocks(editor.document, blocks)`: cursor e seleção perdidos. Acontece **hoje**, em todo post novo |
| baixo | `err.message?.join?.()` descarta a mensagem real quando é string | `api.ts:75` e `:91` | NestJS só usa array em erros de class-validator; `ConflictException("slug já existe")` é string. O painel sempre mostra "Falha ao criar post" |
| baixo | Slug é estado derivado duplicado: digitar no título apaga a edição manual do slug | `tonio/page.tsx:56-58,60-62` | URL de post é permanente. Fix: flag `slugTouched`. (A sub-alegação sobre `read_time_minutes: 0` é falsa — a validação nativa do `min={1}` dispara no submit) |
| baixo | `grid-cols-[1fr,320px]` gera CSS inválido; o painel nunca fica em duas colunas | `tonio/page.tsx:217` e `:299` | Confirmado no CSS compilado: `grid-template-columns: 1fr, 320px`. Vírgula → underscore |

**CSS, layout e efeitos**

| Sev | Defeito | Local | Nota |
|---|---|---|---|
| medio | `overflow-x: hidden` em `html`/`body` promove o body a container de rolagem e quebra `position: sticky` | `globals.css:9-12`, `layout.tsx:31` e `:41` | Regra triplicada. Mas o culpado **próximo** de cada sticky é um `overflow` local: `projects-section.tsx:42` quebra pela `<section>` da linha 25; `about-section.tsx:10` é inócuo em `lg` (a seção tem 100vh e nada rola); `timeline.tsx:76` funciona em `lg` e quebra abaixo. Fix precisa cobrir os `overflow-x-hidden` por seção |
| baixo | `card-float` (animação CSS) sobrescreve os `transform` inline do framer-motion | `globals.css:117,182-192` | Declarações de animação vencem estilos inline na cascata. Entrada escalonada (`y:18→0`) e hover (`y:-6`) **nunca** aparecem em `stats-grid.tsx:129`, `hero-visual.tsx:38` e `info-cards.tsx:63`. `about-visual.tsx` **não** é afetado (o `whileHover` está no motion.div da linha 70, a classe está num `<div>` plano na 75) |
| baixo | Timeline usa `useScroll` do documento, mas o scroll real está num container interno em `lg` | `timeline.tsx:27` + `about-visual.tsx:149` | `scrollYProgress` fica em 0; a barra de progresso nunca cresce. Os `whileInView` internos **estão corretos** (IntersectionObserver recorta pelos ancestrais) |
| baixo | Altura da timeline medida uma vez, com `[ref]` como dependência inerte | `timeline.tsx:20-25` | `ref` é objeto estável: nunca reexecuta. Erro vem do swap de fonte (Cherry Bomb One via `<link>`) e de resize. Fix: `ResizeObserver` |
| baixo | `hover:bg-gray-150` não existe na escala Tailwind e não gera regra | `nav-item.tsx:28` | Cosmético: o `whileHover={{ scale: 1.05 }}` da linha 22 ainda dá affordance; falta só a mudança de fundo |
| baixo | `isActive` usa `pathname.startsWith(href)`: "Sobre" fica ativo em `/sobre-o-site` | `navbar-desktop.tsx:15` | Fix: `pathname === href \|\| pathname.startsWith(href + "/")` |
| baixo | Cleanup do `ResizeObserver` depende de `containerRef.current`, já `null` no unmount | `pointer-highlight.tsx:38-42` | Higiene: o ciclo observer↔elemento é coletável e a spec pula elementos desanexados. Fix: capturar o nó e usar `disconnect()` |
| baixo | `CounterText` recria o objeto `config` a cada render e o usa como dep de efeito | `stats-grid.tsx:88,92-97` | Só enquanto a spring anima. Fix: `useMemo(() => getCounterConfig(value), [value])` |
| baixo | `Math.random()` no corpo de render de `FollowPointer` | `following-pointer.tsx:91` | Code smell em **código morto**: o único consumidor passa `hideTitle`, então o bloco que usa `color` nunca renderiza |
| baixo | `mergeWithDefaultCategories` faz cópia rasa e muta `post_count` dos objetos | `use-categories.ts:17-22` | Risco **latente**: hoje os objetos vêm frescos de `res.json()` e a mutação ocorre dentro da `queryFn`. Vira bug se a correção do item 3 for aplicada de forma ingênua |
| baixo | `totalPostsCount` mistura duas fontes; sob busca o rótulo "Todos os artigos [N]" mostra o resultado filtrado e satura em 50 | `blog/page.tsx:36-39` | Só a parte cosmética é válida. A divergência de ±1 entre lista e contador é **consequência** do item 3, não defeito separado |

---

### Segurança

| Sev | Defeito | Local |
|---|---|---|
| **critico** | `/tonio` sem autenticação ou autorização (item 1 do top-5) | `app/tonio/page.tsx:28` |
| alto | Mutations de escrita batem direto na API pública sem `Authorization`, `credentials` ou CSRF; nenhuma camada BFF onde aplicar rate limit ou validação de origem | `app/lib/api.ts:68,84` |
| medio | Ausência total de security headers: sem CSP, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, HSTS | `next.config.ts:3` |
| medio | Rota admin divulgada e indexável: sem `noindex`, sem `robots.txt`, listada em `/sobre-o-site` e citada no post em destaque | `app/tonio/layout.tsx:4`, `sobre-o-site/page.tsx:45`, `default-post.ts:139` |
| medio | `NEXT_PUBLIC_API_URL` com fallback `http://localhost:3001/api`, duplicado, sem `.env.example` e sem validação | `app/lib/api.ts:1`, `app/blog/[slug]/layout.tsx:4` |
| medio | URL de link relacionado renderizada em `href` sem validação de protocolo, com conteúdo de origem não autenticada | `post-links.tsx:33` |
| baixo | Campo de URL do painel nunca validado no momento do clique em "Adicionar" | `tonio/page.tsx:403-417` |
| baixo | Imagens de markdown via `<img>` cru de host arbitrário, contornando o allowlist de `next.config.ts` | `markdown-components.tsx:187` |
| baixo | `npm@11` e `install@0.13` como `dependencies` de produção | `package.json:20,24` |

Notas de calibragem, para não inflar o risco:

- **Headers:** o cenário de clickjacking é fraco — criar um post exige preencher título, slug e conteúdo (`required` nas linhas 311-331 + validação explícita na 96-99); um clique roubado dispara no máximo um submit inválido. O risco real é `Referrer-Policy` (o path completo, inclusive `/tonio`, vaza no `Referer` para todo domínio externo linkado nos posts) e a falta de defesa em profundidade contra XSS.
- **`post-links.tsx`:** este é o caminho JSX cru — não passa pelo `defaultUrlTransform` do react-markdown. `data:`, `intent:` e esquemas customizados chegam intactos ao `href`. Fix: `["http:","https:","mailto:"].includes(new URL(u).protocol)` antes de renderizar.
- **`<img>` do markdown:** duas alegações comuns são falsas aqui — `markdown-content.tsx:19` não usa `rehype-raw` nem `skipHtml`, então o nó mdast só produz `src`, `alt`, `title` (nada de `onerror`), e o `src` já passou pelo `defaultUrlTransform` (bloqueia `javascript:`, `data:`). O resíduo real é apenas o pixel de rastreamento de host https arbitrário, e exige um atacante que já consegue publicar posts. `referrerPolicy="no-referrer"` e `loading="lazy"` continuam recomendados.
- **`NEXT_PUBLIC_API_URL`:** o impacto **não** é "blog vazio" — `use-posts.ts:40-46` e `use-categories.ts:44-50` degradam graciosamente para o post padrão. E não é mixed content: `http://localhost` é *potentially trustworthy* pela spec de Secure Contexts, então o Chromium não bloqueia; a falha é `ERR_CONNECTION_REFUSED` na máquina do visitante. O defeito é config silenciosa, não brecha.
- **`npm`/`install`:** nenhum é importado nem executa em runtime; `npm` publica dependências bundled. O custo é tempo de `npm ci`, tamanho de imagem e ruído em auditoria.

---

### SEO e metadata

| Sev | Defeito | Local | Nota |
|---|---|---|---|
| alto | Corpo do artigo 100% client-side: zero conteúdo indexável (item 4 do top-5) | `app/blog/[slug]/page.tsx:1` | Título e description **chegam** ao HTML (`layout.tsx` é Server Component com `generateMetadata` real). Falta o corpo |
| medio | Sem `app/sitemap.ts` nem `app/robots.ts` | raiz de `app/` | Sem sitemap não há caminho de descoberta, já que as URLs de post só existem em links renderizados no cliente. `/robots.txt` retornando 404 é lido como "crawl liberado", não bloqueio |
| medio | `/blog` não exporta metadata e não tem layout: herda `<title>Antonio Mesquita</title>` do root | `app/blog/page.tsx:1` | A entrada `"/blog"` de `metadata.ts:19-22` só é alcançada pelos **fallbacks de erro** de `[slug]/layout.tsx:15` e `:22`. Não há canibalização por duplicidade exata com a home (que usa `generatePageMetadata("/")`), mas o índice do blog fica sem nenhum sinal de relevância |
| medio | `twitter:card = "summary_large_image"` sem nenhuma imagem social no projeto | `metadata.ts:56` | Sem `og:image`/`twitter:images`, sem `app/opengraph-image.tsx`. X degrada para card de resumo; LinkedIn/WhatsApp/Slack mostram faixa sem thumbnail. Perda de CTR, não quebra |
| medio | `/tonio` totalmente indexável, com `openGraph`/`twitter` completos | `app/tonio/layout.tsx:4` | Indexável apenas como título+description (o CRUD é client-side dentro do AppLoader). `noindex` é correto, mas **não é o controle de segurança** |
| medio | `generateMetadata` do post não emite `openGraph`/`twitter`/`alternates`; cai em fallback genérico e o `catch` não loga | `app/blog/[slug]/layout.tsx:4,15,17-20,21` | O ganho real das tags og aqui é `og:type: article` + `publishedTime`, não o preview básico (que já funciona via `<title>`/`description`) |
| medio | `/contato` e `/resumo` são indexáveis com conteúdo zero e descriptions que prometem conteúdo inexistente | `contato/page.tsx:8`, `resumo/page.tsx:8` | Thin content. Ver também Acessibilidade e UX |
| baixo | Sem `metadataBase` | `app/layout.tsx:20` | **Não quebra preview nenhum hoje**, porque não existe `og:url` nem `og:image` no HTML gerado. É pré-requisito bloqueante para canonical e imagem social — tratar junto com eles, não isolado |
| baixo | Nenhuma rota define `alternates.canonical` | `metadata.ts:47` | Sem i18n, sem variantes de barra final, sem paginação por query: o Google autocanonicaliza bem. Depende de `metadataBase` |
| baixo | `generateMetadata` não conhece o post padrão: o artigo em destaque recebe metadata genérica | `app/blog/[slug]/layout.tsx:15` | O slug `como-funciona-o-site-antonio-mesquita` só existe no cliente, então o backend sempre responde 404 e o `<title>` vira "Blog \| Antonio Mesquita". **Incondicional hoje** |
| baixo | Sem JSON-LD (`BlogPosting`, `Person`, `BreadcrumbList`) | `[slug]/page.tsx:119` | Inútil enquanto a página for client-only: o script não estaria no HTML servido. Enhancement pós-item 2 |
| baixo | Sem favicon, app icons nem manifest | `app/layout.tsx:32` | `middleware.ts:19` até exclui `favicon.ico` do matcher, para um arquivo que não existe. Branding, impacto ~nulo em ranking |
| baixo | `generatePageMetadata` gera `"Página \| Antonio Mesquita"` para rotas não mapeadas; `baseDescription` diverge da description do root layout | `metadata.ts:42`, `layout.tsx:22` | Armadilha **latente**: as 8 chamadas atuais usam caminhos que existem no mapa. A divergência de description ("Desenvolvedor Full Stack" vs "Desenvolvedor e Criador de Conteúdo") é real |

Detalhe de precisão: `metadata.ts:50-59` **já** emite `openGraph` e `twitter` para as rotas estáticas — a falta de `openGraph` é específica do artigo.

---

### Acessibilidade

| Sev | Defeito | Local | WCAG |
|---|---|---|---|
| alto | Menu mobile é diálogo modal sem `role="dialog"`, `aria-modal`, Escape, focus trap ou devolução de foco | `mobile-menu.tsx:25-35,210` | 2.4.3, 4.1.2 |
| alto | Links da navbar desktop ficam **sem nome acessível** quando não são a rota atual (o label só monta em `isActive`) | `nav-item.tsx:66-98`, `<Link>` na 17 | 2.4.4, 4.1.2 |
| alto | Botão do menu mobile: `focus:outline-none` sem substituto, rótulo `"Toggle menu"` em inglês, sem `aria-expanded` | `mobile-menu-button.tsx:15-16` | 2.4.7, 4.1.2, 3.1.1 |
| alto | Nenhum respeito a `prefers-reduced-motion`; até 9 blocos com animação infinita na home e em `/sobre` | `globals.css:117,146`; `app-loader.tsx:70`, `hero-intro.tsx:97`, `mobile-menu.tsx:113` | 2.2.2 |
| alto | Sem skip link e sem landmark `<main>` em 6 das 7 rotas | `app/layout.tsx:44` | 2.4.1 (A) |
| medio | Cursor do sistema removido no site inteiro (`cursor: none`) sem alternativa | `following-pointer.tsx:57` + `layout.tsx:45` | — |
| medio | `/contato` e `/resumo`: texto branco sobre fundo branco, contraste 1:1 | `contato/page.tsx:8`, `resumo/page.tsx:8` | 1.4.3 |
| medio | `AppLoader` oculta a aplicação por ≥1,2 s sem `role="status"`/`aria-live`/`aria-busy` e sem gestão de foco | `app-loader.tsx:56,75` | 4.1.3, 1.3.1 |
| medio | Campos sem `label` associado (`htmlFor`) no painel e na busca do blog | `tonio/page.tsx:253,266,308,321,334,346,427`; `blog-search.tsx:19` | 1.3.1, 3.3.2 |
| medio | Contraste `text-neutral-700/70` sobre cards em gradiente claro (3,59:1) e `text-neutral-400` no loader (2,49:1) | `stats-grid.tsx:138`, `hero-visual.tsx:47`, `info-cards.tsx:76`, `app-loader.tsx:75` | 1.4.3 |
| medio | Scrollbars ocultas globalmente e em regiões que realmente rolam (blocos de código, tabelas `min-w-[400px]`, TOC) | `globals.css:9-32,254-263`; `markdown-components.tsx:66,155` | 1.3.1 |
| medio | Carrossel de projetos troca o conteúdo (inclusive o único `h1` da página) sem `aria-live` e sem indicar o slide atual | `projects-section.tsx:56,62-84,92`; `project-info.tsx:36` | 4.1.3, 1.4.1 |

Calibragens que evitam correções erradas:

- **Menu mobile:** não é *armadilha de foco* (2.1.2). O problema é ordem de foco (o portal entra no fim do body, então o Tab percorre a página de fundo antes do menu), nome/estado do componente, e ausência de fechamento por teclado.
- **`nav-item`:** os ícones do lucide-react já vêm com `aria-hidden="true"` por padrão (v0.468). Adicionar `aria-hidden` no `<Icon />` é redundante — o que importa é `aria-label={item.label}` + `aria-current={isActive ? "page" : undefined}` no `<Link>`, ou renderizar sempre o `<span>` com `sr-only` quando inativo.
- **`prefers-reduced-motion`:** WCAG 2.3.3 é **AAA** e trata de animação disparada por interação; não citar como requisito AA. O enquadramento em 2.2.2 é defensável. Fix: bloco `@media (prefers-reduced-motion: reduce)` em `globals.css` + `<MotionConfig reducedMotion="user">` em `providers.tsx` + `repeat: useReducedMotion() ? 0 : Infinity`.
- **Skip link:** o custo de tabulação é baixo (logo + 4 links no desktop, 1 botão no mobile). O peso real é o landmark `main` ausente — atalho D/M de leitor de tela. Envolver `{children}` em `<main id="conteudo" tabIndex={-1}>` **dentro** do AppLoader deixa o `<main>` fora do Navbar, que é o desejado; e remover o `<main>` duplicado de `blog/page.tsx:88`.
- **`cursor: none`:** `cursor` é herdado, e qualquer declaração no próprio elemento vence — os UA stylesheets aplicam I-beam em campos de texto e o código usa `cursor-pointer` em vários controles, então esses **mantêm** o cursor próprio. O SVG substituto também tem `pointerEvents: "none"` e não some com o mouse parado (não há timer). O dano real: sem cursor nativo global, perda do cursor ampliado/alto contraste configurado no SO, e o efeito é global — inclusive em `/tonio` e `/blog`. Fix: restringir a `@media (hover: hover) and (pointer: fine)` e aplicar só nas páginas de vitrine, nunca no layout raiz.
- **Labels:** pelo *accessible name computation*, o `placeholder` serve de fallback (etapa 2E), então a maioria dos campos **é** anunciada com algum nome. Realmente anônimo é só o `<input type="number">` de tempo de leitura (`tonio/page.tsx:430`, sem placeholder). Ainda é 1.3.1/3.3.2, mas num painel privado.
- **Scrollbars:** o conteúdo **não** fica inalcançável (roda com Shift, trackpad, teclado com foco no container, arraste em toque). Perde-se a *affordance*. WCAG 2.1.1 e 1.4.13 não se aplicam.
- **Carrossel:** o `<motion.h1>` de `project-info.tsx:36` está na **coluna esquerda, linha 43**, fora do `AnimatePresence` das linhas 101-114 — um `aria-live` só naquele bloco não cobriria a troca do h1. E o nome do projeto também aparece no badge de `project-info.tsx:31-33`.

---

### Performance

| Sev | Defeito | Local | Nota |
|---|---|---|---|
| alto | `AppLoader` cria piso de LCP/FCP de ~1,6-1,8 s em toda rota | `app-loader.tsx:15,39-44,54-89` | Os 1200 ms contam **após** a hidratação (`startTime` está dentro do `useEffect`), somados ao exit de 0,35 s do `mode="wait"` |
| alto | Prefetch de 50 posts **completos** (campo `content` incluído) + categorias em toda navegação inicial, inclusive em `/`, `/projetos`, `/resumo`, `/contato`, `/sobre` | `app-loader.tsx:20-23`, `api.ts:15-16` | Não é questão de `staleTime`: é `fetch` cru fora do `useQuery`, refeito em **todo** mount. E a chave preenchida é `{limit:50}`, enquanto `/blog` consulta com `category`/`search` — boa parte nem é aproveitada |
| alto | `framer-motion@11` **e** `motion@12` instalados e usados em paralelo; ambos no bundle compartilhado de toda rota | `package.json:19,22`; `layout.tsx:6,7` | 25 arquivos usam `framer-motion`, 4 usam `motion/react`. O lockfile confirma o pior caso: `node_modules/framer-motion@11.18.2` + `node_modules/motion/node_modules/framer-motion@12.34.3` — duas majors do **mesmo motor**. Custo real: 30-45 KB gzip redundantes (não 50-60), de bundle, não de runtime duplicado |
| alto | `react-syntax-highlighter` importado pelo entrypoint raiz (build Prism completo, ~300 gramáticas), sem `next/dynamic` em lugar nenhum | `markdown-components.tsx:3-4` | Custo concentrado em `/blog/[slug]`. Fix: `dist/esm/prism-light` + `registerLanguage` explícito, e extrair o bloco `code` para chunk assíncrono |
| alto | `@xyflow/react` + CSS carregados de forma síncrona em `/projetos` | `project-flow.tsx:5-18,28` | Importado estaticamente por `project-detail.tsx:7`, `project-card.tsx:6` e `projects-timeline.tsx:8`. Ressalva: o container do flow pode ficar próximo da dobra em desktop, então "abaixo da dobra" não vale como justificativa |
| medio | Editor BlockNote (core+react+mantine + CSS + fonte Inter) importado estaticamente por `/tonio`, mesmo com a aba padrão sendo "categorias" | `tonio/page.tsx:18`; `markdown-editor.tsx:4-7` | Rota administrativa de um usuário só, fora de qualquer caminho crítico público. Retorno baixo |
| medio | Listener global de `scroll` com `capture:true`, sem `passive`, sem rAF, chamando `getBoundingClientRect()` + `setState` | `following-pointer.tsx:24-35` | **Não** re-renderiza a árvore inteira: `{children}` é prop com referência estável e o React faz bailout. O custo é um forced layout por evento de scroll capturado (incluindo o canvas do ReactFlow e tabelas) + um re-render raso. Fix: guardar o rect em `useRef` e ler no `handleMouseMove`, eliminando o listener |
| medio | Fontes duplicadas: Poppins com 5 pesos via `next/font` + `<link>` render-blocking para duas famílias Google, **uma delas nunca usada** | `layout.tsx:12,15,35-38` | A família `Asset` é baixada e não tem nenhuma regra `font-family`. O argumento dos 5 pesos é o mais fraco (nem todos são buscados); o núcleo é `Asset` + stylesheet de terceiro no caminho crítico. Fix: `Cherry_Bomb_One` via `next/font/google` e apagar o bloco `<head>` |
| medio | Animações infinitas não-compostas rodando permanentemente | `globals.css:117,146,170-180`; `hero-intro.tsx:88-99` | `card-float` anima `transform` (GPU, barato). Os problemáticos são `gradient-shift` (anima `background-position` → repaint de main thread) e o morph do atributo `d` do SVG, interpolado em JS a cada frame na home. Ganho maior aqui é de acessibilidade |
| baixo | Barrel `app/components/blog/index.ts:1` reexporta `MarkdownContent` → `/blog` importa a cadeia do Prism | `app/blog/page.tsx:7` | O Turbopack (padrão no Next 16) faz análise de barrel automaticamente, então a passagem para o bundle de produção é **risco, não fato provado** (sem `node_modules` não dá para confirmar). O custo em dev é certo. Prevenção barata: importar direto dos arquivos |
| baixo | `next.config.ts` sem `formats`/`minimumCacheTTL`; previews do Unsplash pedidas em 1400x800 fixo para containers de 220-420px | `next.config.ts:4`; `projects-data.ts:11,76,148,220` | Metade do achado original é falsa: `lucide-react` já está entre as libs otimizadas por padrão e o Turbopack otimiza barrels sem config; `@tanstack/react-query` é ESM com tree-shaking normal. Sobram: pedir tamanho próximo do exibido e declarar `formats: ["image/avif","image/webp"]`. O custo do source grande é pago no servidor por cache miss, não pelo cliente |
| baixo | `npm` e `install` em `dependencies` | `package.json:20,24` | Fora da dimensão de performance percebida: afeta `npm ci`, cache de CI e imagem de deploy |

---

### Camada de dados (React Query e API)

| Sev | Defeito | Local | Nota |
|---|---|---|---|
| alto | `fetch` sem timeout/`AbortSignal` dentro do `AppLoader` pode travar o site inteiro | `app-loader.tsx:20-23`; `api.ts:40,46,52,68,84` | Grep por `signal\|AbortSignal\|timeout` em `app/`: zero. O único caminho para `setIsReady(true)` está **depois** do `await`, sem timer independente |
| alto | Cache semeado cru colide com a chave dos hooks (item 3 do top-5) | `app-loader.tsx:27-28` | O achado de maior valor da lista |
| medio | `try/catch` dentro das `queryFn` engole o erro, anula o retry automático e deixa `isError` permanentemente `false` | `use-posts.ts:40-46,61-66`; `use-categories.ts:42-50` | A `queryFn` **resolve** em vez de rejeitar: retry nunca dispara, a falha fica cacheada 5 min, e `isError` de `[slug]/page.tsx:23` e `:37` é código morto. O `console.warn` é explicitamente suprimido em produção — backend fora do ar vira "blog com 1 artigo", sem log, sem telemetria. Fallback deliberado, mas o custo é observabilidade zero |
| medio | `usePost` curto-circuita o slug do post padrão e nunca consulta a API, divergindo do `generateMetadata` | `use-posts.ts:60`; `[slug]/layout.tsx:11-15` | O defeito **observável hoje** é só a divergência de metadata (o layout consulta a API, recebe 404 e serve o metadata genérico de `/blog` enquanto o corpo renderiza o artigo). O cenário de colisão de slug é hipotético e não deve pesar na priorização |
| medio | Busca sem `placeholderData`/`keepPreviousData`: cada termo cria chave nova e substitui a lista inteira por um spinner | `blog/page.tsx:18-22,34,89` | Flicker e salto de layout a cada refinamento, na feature principal do blog. **Não** há race condition: cada termo tem sua própria chave e entrada de cache |
| baixo | `getPost` devolve `null` para qualquer `!res.ok`, confundindo 404 com 500/502/503 | `api.ts:45-49` | Isolada, a correção não muda nada — só tem efeito se o `try/catch` de `usePost` for removido junto. E "sinaliza conteúdo inexistente para crawlers" não procede: a rota já responde 200 nos dois casos |
| baixo | Nenhuma validação de shape: `res.json()` vira `Post[]` só pela assinatura | `api.ts:42,48,54` | Gatilho inteiramente hipotético (mudança futura de contrato). A parte acionável e barata é `const safe = Array.isArray(posts) ? posts : []` em `mergeWithDefaultPost` |
| baixo | Post padrão prepende ao array já limitado: `limit:50` retorna 51; `offset` nunca é usado | `default-post.ts:307`; `blog/page.tsx:36` | Exige 50+ posts. "Chaves React duplicadas" não ocorre hoje (o merge filtra por slug e id) |
| baixo | Busca do post padrão é local e varre `DEFAULT_POST_CONTENT` inteiro | `default-post.ts:279-289` | Termos genéricos presentes no corpo da documentação trazem o post padrão como falso positivo. Fix: tirar `content` do haystack. (A "divergência com o ILIKE do backend" é suposição — o backend não está neste repo) |
| baixo | `err.message?.join?.()` descarta a mensagem do servidor quando é string | `api.ts:75,91` | Ver "Bugs / Painel admin" |
| baixo | `API_BASE` duplicado com fallback localhost | `api.ts:1`; `[slug]/layout.tsx:4` | As duas cópias leem a **mesma** env var, então trocar o host via ambiente atualiza as duas. Só divergem se alguém editar o fallback hardcoded em um lugar só |
| baixo | `staleTime` declarado em dois lugares com valores diferentes (2 min no provider, 5 min nos hooks): a config global é código morto | `providers.tsx:12`; `use-posts.ts:48,69`; `use-categories.ts:52` | Ao centralizar, atenção: `retry: 2` no provider **não terá efeito** enquanto as `queryFn` continuarem resolvendo em vez de rejeitar. As duas mudanças andam juntas |

---

### Qualidade de código

| Sev | Defeito | Local | Nota |
|---|---|---|---|
| medio | `projects-timeline.tsx` (195 linhas) e `ProjectCard` (193 linhas) são código morto | `projects-timeline.tsx:14`; `project-card.tsx:37` | Nenhum importador. Só sobrevive `export interface Project` (`project-card.tsx:8`), usada por 4 arquivos. Duas telas de projetos paralelas à implementação viva. Sem impacto em bundle (tree-shaking), o custo é legibilidade |
| medio | Erros de acentuação no `<h1>` e no corpo da `/sobre` | `about-intro.tsx:29,48-54`; `info-cards.tsx:20` | "Ciencia", "juridica", "juridico", "jurisprudencia", "ai", "entao", "porem". O **mesmo conteúdo** aparece grafado corretamente em `about-visual.tsx:25,27,58`, provando que é digitação, não estilo. Nota: "Comecei" está correto (o verbo *começar* não leva cedilha antes de *e*) |
| medio | `framer-motion` + `motion` lado a lado | `package.json:19,22` | Ver Performance. Travar a decisão com `no-restricted-imports` no ESLint |
| baixo | Modo escuro nunca ativado: 221 ocorrências `dark:` em 20 arquivos são código morto | `globals.css:3,209-241`; `layout.tsx:31,41` | `@custom-variant dark (&:is(.dark *))` exige ancestral `.dark`; grep por `classList\|documentElement\|prefers-color-scheme\|next-themes` em código-fonte: zero. Site light-only é escolha legítima — o defeito é a ilusão de suporte para quem mantém |
| baixo | Cobertura `dark:` inconsistente: `/blog` força `dark:bg-neutral-950` mas o h1 e o subtítulo não têm variante | `blog/page.tsx:42,49,52,55,97` | Totalmente hipotético hoje (`.dark` nunca é aplicado). Vira bug no dia em que o tema for ligado. `[slug]/page.tsx:99` faz certo, provando a inconsistência |
| baixo | `hexToRgba` triplicado, dois deles no corpo do componente | `project-flow.tsx:78-83`; `project-detail.tsx:14-19`; `project-info.tsx:12-17` | O "bug latente do hex de 3 dígitos" é hipotético (`projects-data.ts` só usa 7 chars) e o argumento de performance é irrelevante. O defeito é 3 cópias a manter juntas |
| baixo | Quatro barrels `index.ts` sem nenhum importador, convivendo com imports relativos de 3 níveis e com `@/` | `components/{about,blog,navbar,projects}/index.ts` | Dão falsa impressão de serem a API pública dos módulos. Alias `@/*` está em `tsconfig.json:21-23` |
| baixo | Dois `as any` anulam a checagem de tipos das arestas do ReactFlow; parâmetro `selected` desestruturado sem uso | `project-flow.tsx:214,230,86-92` | Únicos `as any` do código-fonte. Fix: `const initialEdges: Edge[]` + `MarkerType.ArrowClosed` |
| baixo | Imports mortos, JSX vazio | `projects-section.tsx:5` (`Code2`); `project-card.tsx:4` (`ExternalLink`); `timeline.tsx:3` ×2 (`useMotionValueEvent`); `about-intro.tsx:58-64` (`motion.div` com 4 props e zero filhos) | — |
| baixo | `components.json` aponta para uma estrutura que o projeto não segue | `components.json:14-22` | `ui: "@/components/ui"` → `./components/ui`, e `hooks: "@/hooks"` → pasta que **não existe**. Já produziu o `timeline.tsx` órfão (82 linhas vs 155 do vivo) |
| baixo | `class-variance-authority` e `tw-animate-css` declarados e nunca usados | `package.json:17,41` | Zero ocorrências em `app/`, `components/`, `lib/`, `globals.css` |

---

### Tooling e DX

| Sev | Defeito | Local | Nota |
|---|---|---|---|
| medio | Ausência total de testes e de CI | `package.json:5-10` | Sem script `test`, sem runner em devDeps, zero arquivos `*.test.*`/`*.spec.*`, sem `.github/`. Observação prática: o pacote **não tem `.git`**, então não há para onde apontar um workflow antes de versionar |
| medio | `npm` e `install` em `dependencies` | `package.json:20,24` | `npm ls install npm` deve retornar vazio após a remoção |
| medio | `NEXT_PUBLIC_API_URL` sem `.env.example` e sem documentação | `api.ts:1`; `.gitignore:34` | `.gitignore` ignora `.env*` sem exceção. README não cita a variável. Deploy sem a env sobe **verde** exibindo conteúdo mockado |
| baixo | README ainda é o boilerplate do `create-next-app`; sem LICENSE nem CONTRIBUTING | `README.md:1` | 37 linhas de template, sem uma palavra sobre o backend em `:3001`, a variável de ambiente ou o deploy. O README ainda oferece `npm/yarn/pnpm/bun` indistintamente, com um único lockfile npm |
| baixo | Sem gate de qualidade: `lint` sem `--max-warnings 0`, sem script `typecheck`, ESLint sem regras próprias | `package.json:9`; `eslint.config.mjs:5-16` | **Cuidado:** `eslint-config-next/typescript` é baseado em `plugin:@typescript-eslint/recommended`, onde `no-explicit-any` já é **error** — os dois `as any` de `project-flow.tsx` provavelmente já quebram o lint hoje, e `--max-warnings 0` não muda isso. O `globalIgnores` é literalmente o arquivo gerado pelo create-next-app; não removê-lo. Válido mesmo: adicionar `typecheck` e `--max-warnings 0` |
| baixo | `tsconfig` com `target: ES2017` e sem flags de rigor além de `strict` | `tsconfig.json:3` | **Não** afeta o bundle: `noEmit: true` e quem compila é o SWC, com downleveling definido por browserslist (default do Next 16: chrome/edge/firefox 111, safari 16.4). Subir para ES2022 não muda um byte. Válido: `noUncheckedIndexedAccess` e `noUnusedLocals` (há acessos por índice sem guarda em `stats-grid.tsx:68` e `table-of-contents.tsx:21-27`) |
| baixo | `.next` de 192 MB viajou dentro do pacote distribuído | raiz | O `.gitignore:17` está correto — é problema de **empacotamento** (zip da pasta de trabalho em vez de `git archive`), não do projeto. A sub-alegação sobre `tsc` varrendo `.next` é enganosa: o `include` só pega `.ts/.tsx/.mts`, e os arquivos de `.next/dev/types` estão listados **de propósito** |
| baixo | Nenhum formatador nem hook de pré-commit; `.vscode/settings.json` versionado com 2 preferências pessoais de explorer e nada útil | `package.json:32`; `.vscode/settings.json` | Sugestão de conforto num projeto de autor único |
| baixo | Nenhuma ferramenta de análise de bundle, apesar de BlockNote, xyflow, Prism e dois runtimes de animação | `next.config.ts:3` | Sem baseline não há como justificar nem verificar code-splitting |
| baixo | `package.json` sem `engines` nem `packageManager` | `package.json` | Next 16 + React 19 exigem Node ≥ 20; um runner com Node 18 descobre num erro obscuro. `packageManager` só tem efeito com Corepack — o valor prático está em `engines` |

---

### UX, estilo e conteúdo

**Alto**

1. **`/contato` e `/resumo` são placeholders com texto branco sobre fundo branco, e são os dois CTAs principais do menu mobile.** `contato/page.tsx:8-11` e `resumo/page.tsx:8-11` são idênticos: `<div className="min-h-screen w-full text-white"><h1>…</h1>` + comentário "será implementada aqui". O body aplica `bg-background` (`globals.css:247-248` → `oklch(1 0 0)`, branco puro) e o `.dark` nunca é ativado. `mobile-menu.tsx:159` ("Vamos conectar") e `:167` ("Veja um resumo") apontam para lá. O visitante clica no botão preto de destaque e cai numa tela 100% branca — parece site quebrado, não página em construção. Ou implementar, ou remover as rotas e os links (apontando "Vamos conectar" direto para `mailto:`), ou no mínimo `text-neutral-900` + um estado "em construção" legível + `robots: { index: false }`.

2. **Não existe funil de contato no desktop.** As **únicas** ocorrências de `mailto:` e `linkedin.com/in` em todo o código estão em `mobile-menu.tsx:183` e `:192`, dentro de um container `md:hidden`. `NavbarDesktop` (`hidden md:flex`) renderiza só Logo + os 4 `navItems` de `types.ts:9-14` (`/`, `/sobre`, `/projetos`, `/blog`). Não há `<footer>` em lugar nenhum do projeto (grep: zero). O card "Vamos conversar / Disponível para freelas e parcerias" (`hero-visual.tsx:33-58`) é um `motion.div` **sem href**. Não há GitHub em lugar nenhum do site. E `/sobre-o-site`, que tem metadata própria, é órfã: nenhum link aponta para ela. Um recrutador percorre o portfólio inteiro sem encontrar um meio de contato clicável.

3. **Nenhum projeto tem link para produto, repositório ou case, e o botão "Ver mais" é um `<div>` decorativo.** `project-detail.tsx:63-81`: `motion.div` com "Ver mais" + `ArrowRight`, sem `href`, sem `onClick`, sem `role`. A interface `Project` (`project-card.tsx:8-30`) não tem nenhum campo de URL — grep por `href|url|repo|demo|link` em `app/components/projects` retorna uma única linha: o import não usado de `ExternalLink`. O affordance de clique existe e não faz nada.

4. **As previews dos 4 projetos são fotos de banco de imagens rotuladas como "Preview da Aplicação / Veja como ficou o resultado final".** `projects-data.ts:11,76,148,220` são todas `https://images.unsplash.com/photo-…?w=1400&h=800&fit=crop` (globo terrestre, plateia de festival, sala de aula), renderizadas sob esse cabeçalho em `project-card.tsx:103-114`, com `alt={"Preview do " + project.name}`. `next.config.ts` libera `images.unsplash.com` exatamente para isso. Quem reconhece as imagens conclui que os projetos podem não existir. O campo é opcional (`preview?: string`) e o bloco é condicional (`project-card.tsx:93`) — remover é mais honesto que preencher com estoque.

5. **O painel admin só cria: não existe editar nem excluir posts ou categorias.** `app/lib/api.ts` exporta apenas `getPosts`, `getPost`, `getCategories`, `createPost`, `createCategory` — nenhum `PATCH`/`PUT`/`DELETE`. `app/hooks/index.ts` exporta só `useCreatePost`/`useCreateCategory`. A lista "Posts recentes" (`tonio/page.tsx:508-523`) é um `<a target="_blank">` de leitura. Um slug errado ou um post publicado por engano só se corrige direto no banco. O blog é write-only.

**Médio**

| Defeito | Local | Nota |
|---|---|---|
| Métricas sem lastro visível: "35+ projetos", "18+ parceiros", "Satisfação média 5.0" | `stats-grid.tsx:35-60`; duplicadas em `default-post.ts:47-50` e `sobre-o-site/page.tsx:123` | Nada prova que sejam inventadas (a galeria é explicitamente uma seleção de 4). O defeito real é (a) "Satisfação média 5.0" sem nenhuma página de depoimentos que a sustente, e (b) os mesmos números digitados à mão em 3 arquivos, que vão dessincronizar |
| Documentação do próprio site descreve recursos que não existem | `default-post.ts:110`, `:29`; `sobre-o-site/page.tsx:157` | **Válido:** promete "Grid de cards" mas `blog/page.tsx:102` é `<ul className="space-y-2">`; anuncia "tags" mas o modelo `Post` não tem o campo e o `PostCard` nunca exibe categoria; apresenta "**Resumo** (em construção)" como conteúdo publicado. **Inválido, não repetir:** "labels ARIA" (há 11 ocorrências de `aria-` em 6 arquivos), "ISR" (`[slug]/layout.tsx:11-14` faz `next: { revalidate: 60 }` — o que falta é pré-renderizar o *corpo*), e "health check em /api/health" (descreve o backend NestJS) |
| Falhas da API são silenciadas: o blog diz "Nenhum artigo encontrado" / "Artigo não encontrado" quando o backend está fora | `use-posts.ts:40-46,61-66`; `blog/page.tsx:93-100`; `[slug]/page.tsx:37-53` | Usuário e buscador leem como conteúdo removido, não indisponibilidade. Nota para o fix: como `getPost` já devolve `null` (não lança) para qualquer `!res.ok`, separar "falha de rede" de "404 real" exige mudar `api.ts:45-49` também, não só o hook |
| Cursor nativo desligado no site inteiro, inclusive no formulário do admin e na seleção de texto dos artigos | `following-pointer.tsx:57` + `layout.tsx:45` | Em touch é inofensivo; o dano é desktop |
| Modo escuro inativável (221 classes `dark:` mortas) | `globals.css:3` | Decidir: `@custom-variant dark (@media (prefers-color-scheme: dark))`, ou provider com toggle, ou remover |
| Blog sem RSS/Atom nem newsletter | ausência de `app/feed.xml/route.ts` | Glob `app/**/route.ts`: nenhum arquivo. Não há canal de retenção — cada artigo novo só é visto por quem voltar manualmente |
| Zero instrumentação: nenhuma analytics, Web Vitals ou rastreamento de erro | `app/layout.tsx:39` | Grep por `gtag\|analytics\|plausible\|umami\|posthog\|sentry\|speed-insights`: zero. Quando a API cai em produção, ninguém é notificado (`use-posts.ts:42` suprime o log) |
| Sem paginação nem "carregar mais": o teto é 50 posts, e o admin corta em 10 | `blog/page.tsx:21`; `tonio/page.tsx:32,509` | `offset` existe em `getPosts` e em `PostsParams`, mas nenhum componente o passa |
| Busca e filtro de categoria só em `useState`: nenhum filtro é linkável, indexável ou preservado ao voltar do artigo | `blog/page.tsx:12-13`; `blog-sidebar.tsx:26,37` | Não há URL para "todos os artigos de Arquitetura". Fix: espelhar em `searchParams` e transformar os botões da sidebar em `<Link>` |
| Nenhum projeto tem rota própria: `/projetos` é carrossel em memória, sem deep link | `projects-section.tsx:11` | Não existe `app/projetos/[slug]/`. Impossível enviar "olha o Piesse" num e-mail — o link sempre abre no primeiro |
| Fim do artigo é beco sem saída: sem próximo/anterior, sem relacionados, categoria não clicável, sem CTA | `[slug]/page.tsx:82-86,147` | Depois de `ShareButtons` o arquivo acaba. Joga fora a conversão no momento de maior interesse |
| Sem gestão de rascunhos: "Publicar agora" é decisão única e a lista não distingue rascunho de publicado | `tonio/page.tsx:449,108,509-523` | Sem `updatePost`, o estado de rascunho é **irreversível pela interface** e invisível no painel (a lista renderiza só `{p.title}`) |

**Baixo**

| Defeito | Local |
|---|---|
| Nenhuma configuração de entrega: sem `vercel.json`/`Dockerfile`/`.github/`, sem `output` no `next.config.ts`, sem `.env.example`, README boilerplate | raiz |

Nota sobre deploy: `ShareButtons` resolve a URL em runtime via `window.location.origin` (`share-buttons.tsx:14`), então os links de compartilhamento funcionam. O que falta pela ausência de domínio conhecido é `metadataBase`/canonical/OG absoluto, além de sitemap e robots.

---

## Plano de ação

Esforço relativo: **P** ≈ até 1h · **M** ≈ meio dia · **G** ≈ 1+ dia (ou fora deste repo).

### Onda 1 — quebrado, arrisca dados ou segurança

| # | Item | Local | Esforço |
|---|---|---|---|
| 1.1 | Autenticação em `POST /posts` e `POST /categories` **no backend** | fora deste repo | G |
| 1.2 | Gate de `/tonio` no middleware (reaproveitando `middleware.ts`, apagando só a linha 6) + `robots: { index:false, follow:false }` + remover o link de `sobre-o-site/page.tsx:45` e a menção em `default-post.ts:139` | `middleware.ts`, `tonio/layout.tsx`, `metadata.ts:31-34` | P |
| 1.3 | `AppLoader`: parar de condicionar `{children}`; loader vira overlay `fixed`; remover `MIN_LOAD_TIME_MS`; mover o prefetch para o escopo de `/blog` | `app-loader.tsx`, `layout.tsx:44` | M |
| 1.4 | `AbortSignal.timeout(8000)` em todos os fetches de `api.ts` + hard stop independente enquanto houver qualquer gate | `api.ts:40,46,52,68,84`; `app-loader.tsx` | P |
| 1.5 | Semear o cache já mesclado — extrair `postsQueryOptions`/`categoriesQueryOptions` e usar `prefetchQuery` com a **mesma** queryFn dos hooks | `app-loader.tsx:27-28`; `use-posts.ts`; `use-categories.ts` | P |
| 1.6 | Corrigir o renderer `code` (detectar bloco por `className`) e tornar `pre` transparente | `markdown-components.tsx:53-83` | P |
| 1.7 | Efeito de init do editor: marcar `initialized` independentemente do valor, remover `value` das deps | `markdown-editor.tsx:25-42` | P |
| 1.8 | `/contato` e `/resumo`: cor legível + conteúdo mínimo real (e-mail + LinkedIn), ou remover rotas e links | `contato/page.tsx`, `resumo/page.tsx`, `mobile-menu.tsx:159,167` | P |
| 1.9 | Allowlist de protocolo em `post-links.tsx` (+ validação no `onClick` de "Adicionar" no painel) | `post-links.tsx:33`; `tonio/page.tsx:403-417` | P |
| 1.10 | Propagar erro das `queryFn` (`retry: 2` + `placeholderData` com o post padrão) e distinguir 404 de 5xx em `getPost` — as duas mudanças **juntas**, senão nenhuma tem efeito | `use-posts.ts:40-46,61-66`; `use-categories.ts:42-50`; `api.ts:45-49` | M |
| 1.11 | Centralizar `API_BASE` em `app/lib/env.ts`, criar `.env.example` (com exceção no `.gitignore`), validar a env no **CI** (não com `throw` no bundle) | `api.ts:1`; `[slug]/layout.tsx:4` | P |
| 1.12 | Security headers em `next.config.ts` (`async headers()`), priorizando `Referrer-Policy`, `X-Content-Type-Options`, `X-Frame-Options` e CSP | `next.config.ts` | P |

### Onda 2 — SEO, performance e acessibilidade (o que muda o alcance)

| # | Item | Local | Esforço |
|---|---|---|---|
| 2.1 | `/blog/[slug]` como Server Component async + `notFound()` + `generateStaticParams` + `revalidate = 60`; interatividade isolada em filhos `"use client"` | `app/blog/[slug]/page.tsx` | G |
| 2.2 | `/blog` como Server Component com lista inicial; busca/filtro num filho cliente com `initialPosts`/`HydrationBoundary` | `app/blog/page.tsx` | M |
| 2.3 | `app/blog/layout.tsx` com `generatePageMetadata("/blog")`; `loading.tsx` em `/blog` e `/blog/[slug]`; `app/error.tsx` e `app/global-error.tsx` com `reset`; `not-found.tsx` | `app/**` | M |
| 2.4 | `app/sitemap.ts` (a partir de `getPosts()`) + `app/robots.ts` (`disallow: ["/tonio"]`) | novos | P |
| 2.5 | `metadataBase` + `alternates.canonical` em `generatePageMetadata` + `openGraph` completo no artigo (`type: "article"`, `publishedTime`) + tratar o slug do post padrão no `generateMetadata` | `layout.tsx:20`; `metadata.ts:47`; `[slug]/layout.tsx:15-20` | M |
| 2.6 | `app/opengraph-image.tsx` (1200×630 via `next/og`) + `app/blog/[slug]/opengraph-image.tsx` | novos | M |
| 2.7 | Skip link + `<main id="conteudo" tabIndex={-1}>` envolvendo `{children}` (fora do Navbar); remover o `<main>` duplicado de `blog/page.tsx:88` | `layout.tsx:44` | P |
| 2.8 | `nav-item`: `aria-label` + `aria-current="page"` no `<Link>` (ou label sempre montado com `sr-only`) | `nav-item.tsx:17,66-98` | P |
| 2.9 | Menu mobile como diálogo: `role="dialog"`, `aria-modal`, `aria-label`, Escape, foco no botão de fechar, restauração do foco, `inert` no app de fundo | `mobile-menu.tsx` | M |
| 2.10 | Botão do menu: anel de foco `focus-visible:ring-*`, `aria-expanded`, `aria-controls`, rótulo em pt-BR | `mobile-menu-button.tsx:15-16` | P |
| 2.11 | `@media (prefers-reduced-motion: reduce)` em `globals.css` + `<MotionConfig reducedMotion="user">` + `repeat: useReducedMotion() ? 0 : Infinity` | `globals.css`, `providers.tsx`, `app-loader.tsx:70`, `hero-intro.tsx:97`, `mobile-menu.tsx:113` | P |
| 2.12 | Contraste: `text-neutral-700/70` → `text-neutral-800`; loader `text-neutral-400` → `text-neutral-600` | `stats-grid.tsx:138`, `hero-visual.tsx:47`, `info-cards.tsx:76`, `app-loader.tsx:75` | P |
| 2.13 | `htmlFor`/`id` nos 7 pares do painel, `aria-label` nos inputs de link, `<label className="sr-only">` na busca do blog | `tonio/page.tsx`, `blog-search.tsx:19` | P |
| 2.14 | `role="status" aria-live="polite"` no loader; `aria-live` + `aria-current` no carrossel de projetos (cobrindo também o `h1` da coluna esquerda) | `app-loader.tsx:56`; `projects-section.tsx` | P |
| 2.15 | Scrollbars finas e visíveis nas regiões que rolam (`pre`, tabelas, TOC, about-section); `.scrollbar-hide` só onde for decorativo | `globals.css:9-32,254-263` | P |
| 2.16 | Padronizar em `motion/react`: trocar os 25 imports, `npm uninstall framer-motion`, apagar `components/ui/timeline.tsx`, travar com `no-restricted-imports` | 25 arquivos + `package.json:19` | M |
| 2.17 | `react-syntax-highlighter` → `prism-light` com `registerLanguage` explícito; extrair o bloco `code` para `next/dynamic` | `markdown-components.tsx:3-4` | M |
| 2.18 | `ProjectFlow` via `next/dynamic({ ssr: false })` (e idealmente montado por IntersectionObserver) | `project-detail.tsx:7`, `projects-timeline.tsx:8` | P |
| 2.19 | Cherry Bomb One via `next/font/google`; apagar o bloco `<head>` inteiro (inclusive a família `Asset`, nunca usada) | `layout.tsx:32-39`, `globals.css:165` | P |
| 2.20 | `following-pointer`: rect em `useRef` lido no `handleMouseMove`, eliminando o listener de scroll; `cursor: none` só sob `(hover: hover) and (pointer: fine)` e fora de `/tonio` e `/blog` | `following-pointer.tsx:24-35,57`; `layout.tsx:45` | P |
| 2.21 | `overflow-x: hidden` → `overflow-x: clip` (ou remoção) em `html`/`body` **e** nas seções (`projects-section.tsx:25`, `about-section.tsx:8`), para destravar os `sticky` | `globals.css:9-12`, `layout.tsx:31,41` | M |
| 2.22 | `placeholderData: keepPreviousData` em `usePosts` + usar `isFetching` para indicador discreto em vez de desmontar a lista | `use-posts.ts`, `blog/page.tsx:34,89` | P |
| 2.23 | Extrair headings da AST (remark/mdast ou `rehype-slug`) para eliminar fantasmas de bloco de código e o mapeamento posicional de `registerHeading` | `extract-headings.ts:11`, `heading-id-context.tsx:47` | M |
| 2.24 | `next.config.ts`: `formats: ["image/avif","image/webp"]`, `minimumCacheTTL`; pedir do Unsplash tamanho próximo do exibido | `next.config.ts`, `projects-data.ts` | P |
| 2.25 | `app/icon.png` + `app/apple-icon.png` + `app/manifest.ts`; `noindex` em `/contato` e `/resumo` enquanto forem stubs | `app/**` | P |

### Onda 3 — qualidade, tooling e conteúdo

| # | Item | Local | Esforço |
|---|---|---|---|
| 3.1 | Corrigir acentuação em `/sobre` (Ciência, jurídica, jurídico, jurisprudência, aí, então, porém) e quebrar o parágrafo de `about-intro.tsx:54` | `about-intro.tsx:29,48-54`; `info-cards.tsx:20` | P |
| 3.2 | Substituir as previews do Unsplash por screenshots reais em `public/`, ou remover o campo `preview` onde não houver | `projects-data.ts:11,76,148,220` | M |
| 3.3 | `<footer>` global com e-mail, LinkedIn, GitHub e links secundários; CTA de contato no `NavbarDesktop`; card do hero vira link real | `layout.tsx`, `navbar-desktop.tsx`, `hero-visual.tsx:33-58` | M |
| 3.4 | `updatePost`/`deletePost`/`deleteCategory` + hooks com invalidação + ações Editar/Excluir na lista do admin; badge Rascunho/Publicado + data | `api.ts`, `use-posts.ts`, `tonio/page.tsx:508-523` | G |
| 3.5 | Campos `liveUrl`/`repoUrl`/`caseUrl` em `Project`; selo "Ver mais" vira `<a>`; rótulo honesto ("Projeto privado") onde não houver link | `project-card.tsx:8-30`, `project-detail.tsx:63-81`, `projects-data.ts` | M |
| 3.6 | `app/projetos/[slug]/page.tsx` com `generateStaticParams` e metadata por projeto; indicadores do carrossel viram `<Link>` | novo | G |
| 3.7 | Espelhar busca/categoria em `searchParams`; sidebar com `<Link>` | `blog/page.tsx:12-13`, `blog-sidebar.tsx` | P |
| 3.8 | Fim do artigo: relacionados por categoria, anterior/próximo, categoria clicável, bloco de contato | `[slug]/page.tsx:82-86,147` | M |
| 3.9 | `useInfiniteQuery` com `offset` + "Carregar mais"; total real vindo da API para a sidebar; injetar o post padrão só na primeira página | `blog/page.tsx`, `api.ts`, `default-post.ts:307` | M |
| 3.10 | `app/feed.xml/route.ts` (RSS 2.0) + `alternates.types` no metadata raiz + link visível em `/blog` | novo | P |
| 3.11 | Analytics leve sem cookies + `useReportWebVitals` + reportar os erros das `queryFn` a um coletor em vez de descartá-los em produção | `layout.tsx`, `use-posts.ts:42` | P |
| 3.12 | Passagem de veracidade na documentação: "grid de cards", "tags", "/resumo em construção"; métricas do `stats-grid` com fonte declarada ou removidas; centralizar os números num só módulo | `default-post.ts:29,110`; `sobre-o-site/page.tsx:157`; `stats-grid.tsx:35-60` | P |
| 3.13 | Deletar código morto: `projects-timeline.tsx`, `project-card.tsx` (movendo `interface Project` para `types.ts`), os 4 barrels não importados, `components/ui/timeline.tsx`, o `motion.div` vazio de `about-intro.tsx:58-64`, os imports `Code2`/`ExternalLink`/`useMotionValueEvent` | vários | P |
| 3.14 | Decidir o dark mode: ativar com provider + script anti-flash, ou remover `@custom-variant`, o bloco `.dark` e as 221 classes | `globals.css:3,209-241` | M |
| 3.15 | `npm rm npm install class-variance-authority` + `npm rm -D tw-animate-css`; regenerar lockfile; adicionar `engines: { node: ">=20.9.0" }` | `package.json` | P |
| 3.16 | Alinhar `components.json` a `@/app/components` e `@/app/components/ui` | `components.json:14-22` | P |
| 3.17 | Vitest + Testing Library, começando por `api.ts`, `slugify.ts`, `format.ts`, `default-post.ts` e os hooks; workflow de CI (`lint`, `typecheck`, `test`, `build`) — depois de versionar o projeto em git | `package.json`, `.github/` | G |
| 3.18 | Scripts `typecheck: "tsc --noEmit"` e `lint: "eslint . --max-warnings 0"`; `noUncheckedIndexedAccess` e `noUnusedLocals` no tsconfig (não mexer no `globalIgnores` nem no `target`) | `package.json:9`, `tsconfig.json` | P |
| 3.19 | Reescrever o README (arquitetura, variáveis, comandos, deploy, só npm); adicionar LICENSE; versionar o alvo de deploy (`vercel.json` ou Dockerfile com `output: "standalone"`) | raiz | P |
| 3.20 | Prettier + `eslint-config-prettier` + `lint-staged`/husky; `.vscode/settings.json` com `formatOnSave`; `@next/bundle-analyzer` + script `analyze` | raiz | P |
| 3.21 | Correções pontuais: `grid-cols-[1fr_320px]`, `hover:bg-gray-100`, `isActive` por segmento, `hexToRgba` em `app/lib/color.ts`, remover os dois `as any`, `useMemo` no `CounterText`, flag `slugTouched`, `target="_blank"` condicional, `ResizeObserver` na Timeline, `useScroll({ container })`, `disconnect()` em `pointer-highlight`, remover o bloco morto de `FollowPointer`, normalizar `err.message` na API, `mergeWithDefaultCategories` imutável, centralizar `staleTime` no provider, tirar `content` do haystack de busca, guarda `Array.isArray` em `mergeWithDefaultPost` | vários | P cada |
| 3.22 | Excluir `.next` (192 MB) antes de empacotar; gerar o pacote a partir de `git archive` | raiz | P |

---

## Apendice — achados levantados e REFUTADOS na verificacao

Registrados aqui para que ninguem gaste tempo reinvestigando-os.

- Fetch duplicado por artigo: o layout busca o post so para metadata e a page refaz a mesma requisicao no cliente — A metade do titulo que sustenta o achado — 'a page refaz a mesma requisicao no cliente' — nao se sustenta no caminho normal. app/components/app-loader.tsx:20-32 busca `getPosts({limit:50})` e executa `queryClient.setQueryData(queryKeys.post(post.slug), post)` para cada post ANTES de liberar `children` (setIsReady so ocorre nas linhas 42-44, depois do setQueryData). queryKeys.post produz exatamente a mesma chave `['posts','detail',slug]` usada por usePost (query-keys.ts:12 vs use-posts.ts:58) e usePost tem `staleTime: 1000*60*5` (use-posts.ts:69), acima do default de 2min do Providers. Logo, no mount a query ja tem dado fresco e o React Query NAO refaz `GET /posts/{slug}`. Alem disso, se o slug for o padrao, use-posts.ts:60 retorna sem tocar na rede. Portanto nao ha 'duas chamadas ao mesmo endpoint por visualizacao': ha um `GET /posts/{slug}` no servidor (metadata) e um `GET /posts?limit=50` no cliente (lista) — endpoints diferentes. O corolario 'dobrando carga no backend' tambem cai. O que resta e verdadeiro mas menor: o layout existe so para generateMetadata e o `fetch` dele e descartado.

- blocksToMarkdownLossy é assíncrono: o editor entrega uma Promise no onChange e o estado postContent deixa de ser string — Refutado na versão exata instalada. package-lock.json linha 306-308 pina @blocknote/core em 0.46.2, e o arquivo de tipos publicado dessa versão (cdn.jsdelivr.net/npm/@blocknote/core@0.46.2/types/src/editor/BlockNoteEditor.d.ts) declara `blocksToMarkdownLossy(blocks?: PartialBlock[]): string` e `tryParseMarkdownToBlocks(markdown: string): Block[]` — AMBOS SÍNCRONOS. A referência de API oficial (blocknotejs.org/docs/features/export/markdown, também na tag v0.47.1 do repo) confirma: `blocksToMarkdownLossy(blocks?: Block[]): string; // const markdownFromBlocks = editor.blocksToMarkdownLossy(blocks);` sem await. A única 'evidência' do achado é um exemplo do guia supported-formats que usa `await` — mas `await` sobre um valor não-thenable simplesmente devolve o valor, portanto não prova nada sobre a assinatura. Consequências: postContent recebe string normal, `postContent.trim()` em app/tonio/page.tsx:96 funciona, e não há erro de tipo Promise<string> vs string no `next build`.

- E-mail pessoal em texto claro e hardcoded no bundle do cliente, sem ofuscacao — O fato citado existe (app/components/navbar/components/mobile-menu.tsx:183 = `href="mailto:antonio109mesquita@gmail.com"` num componente client, e grep confirma que e a UNICA ocorrencia no repo), mas isso nao e um defeito: e um botao de contato deliberado, com aria-label="Email", ao lado dos links de LinkedIn e do CTA 'Veja um resumo', num portfolio pessoal cujo proposito e ser contactavel. Publicar o proprio e-mail nao e vulnerabilidade. A correcao proposta piora as coisas: montar o href em runtime com [user, domain].join("@") e ofuscacao inutil contra harvesters modernos que executam JS, quebra progressive enhancement e prejudica acessibilidade/leitores de tela; e mover para NEXT_PUBLIC_CONTACT_EMAIL deixa o e-mail igualmente em texto claro no bundle, nao resolvendo nada do que o achado alega. A observacao de que app/contato/page.tsx e um stub vazio esta correta, mas e escopo de feature, nao de seguranca.

- A pagina /sobre-o-site reescreve a mao a lista de projetos e de rotas, e os dados ja divergem da fonte real — A duplicacao existe (sobre-o-site/page.tsx:33-38 e 40-46 sao arrays hardcoded), mas a afirmacao central — 'os dados JA divergem da fonte real' — nao se sustenta. Comparei item a item com projects-data.ts: Piesse 'Next.js, NestJS, PostgreSQL, OpenAI' e subconjunto fiel de [Next.js, TypeScript, React, NestJS, PostgreSQL, Prisma, OpenAI API, Tailwind, Docker, AWS] (l.12-23); Frevo 'React, Node.js, MongoDB, Stripe' e subconjunto de (l.78-88); Egle 'Vue.js, FastAPI, PostgreSQL' e subconjunto de (l.150-160); 1001Tem 'Next.js, React Native, GraphQL' e subconjunto de (l.222+). Nenhuma tecnologia falsa, nenhuma contradicao — sao resumos truncados, exatamente o que a propria correcao proposta sugere fazer (`technologies.slice(0,4)`). O mesmo vale para a descricao do 1001Tem: 'Marketplace de servicos com matching inteligente' e a versao curta de 'Marketplace de servicos com sistema de matching inteligente e avaliacoes em tempo real', nao um dado divergente.

- O cache de detalhe de post é semeado com objetos da listagem, e o staleTime de 5 min impede qualquer correção — O mecanismo descrito existe literalmente (app/blog/page.tsx:27-32 e app/components/app-loader.tsx:30-32 gravam queryKeys.post(slug) com o objeto da listagem; usePost tem staleTime 5min em app/hooks/use-posts.ts:69, logo não refetcha). Mas a premissa central — 'a listagem devolve payload resumido, sem content/links' — nao e comprovavel nem sugerida por nada na raiz: app/lib/api.ts declara a MESMA interface Post (com content: string obrigatorio) para getPosts e getPost, o backend nao esta no repositorio, nao ha fixture, mock, .env, README ou tipo separado PostSummary. Grep na raiz nao encontra nenhuma evidencia de shape divergente. Sem isso o achado descreve um risco condicional, nao um defeito demonstravel — e a regra e confirmed=false na duvida.


---

*Auditoria gerada por 25 agentes (12 auditores por dimensao, 12 refutadores adversariais, 1 sintese). 136 achados confirmados, 5 refutados. Severidades: alto: 27, medio: 54, baixo: 54, critico: 1.*
