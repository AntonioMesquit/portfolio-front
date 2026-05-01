import type { Post } from "./api";
import type { PostsParams } from "../hooks/use-posts";

export const DEFAULT_POST_SLUG = "como-funciona-o-site-antonio-mesquita";

const DEFAULT_POST_CONTENT = `# Como funciona o site Antonio Mesquita

> Um guia completo pelas funcionalidades, arquitetura e recursos deste portfólio. Descubra como cada parte do site foi pensada para entregar uma experiência fluida e informativa.

---

## O que é este site?

Este portfólio é ao mesmo tempo uma **vitrine profissional** e um **blog técnico**. Ele conecta quem eu sou (desenvolvedor focado em experiências digitais) com o que faço (projetos reais, artigos e aprendizados). Tudo foi construído para ser rápido, acessível e agradável de navegar — em qualquer dispositivo.

---

## Navegação principal

O site possui **quatro rotas principais** no menu:

| Rota | Função |
|------|--------|
| **Início** | Apresentação pessoal e métricas em destaque |
| **Sobre** | Linha do tempo da trajetória profissional |
| **Projetos** | Galeria interativa de projetos com diagramas de arquitetura |
| **Blog** | Artigos em Markdown com busca e filtros por categoria |

Além disso, existem rotas secundárias: **Contato**, **Resumo** (em construção), **Admin** (painel para criar posts) e **Sobre o Site** (documentação).

---

## Início: sua primeira impressão

Na página inicial, o foco é **quem eu sou** e **o que ofereço**.

### Hero section

- Frase de posicionamento com animações suaves (Framer Motion)
- Sublinhados decorativos em SVG que aparecem ao carregar
- Cards animados com gradientes e efeito de brilho

### Métricas em destaque

Um grid de **stats** exibe de forma visual:

- **Anos de experiência** (4+)
- **Projetos entregues** (35+)
- **Parceiros atendidos** (18+)
- **Satisfação média** (5.0)

### Card de contato

Um card com gradiente animado convida para conversar sobre freelas e parcerias em projetos web.

---

## Sobre: a trajetória em timeline

A página **Sobre** conta a história em uma **timeline vertical interativa**.

### Como funciona

1. **Cada nó** representa um período (ano, empresa ou marco)
2. **Ícones** diferenciam o tipo de evento (graduação, código, trabalho, foguete)
3. **Cards** com gradientes suaves exibem título, empresa, período e descrição
4. **Tecnologias** aparecem em badges quando aplicável (ex.: Next.js, React Native, NestJS)
5. **Localização** no rodapé: Ceará, Brasil

### Layout responsivo

- Em **desktop**: coluna esquerda fixa (sticky) com introdução, direita com a timeline rolável
- Em **mobile**: tudo em uma única coluna, rolagem natural

---

## Projetos: galeria com arquitetura visual

A seção de projetos é uma das mais ricas: cada projeto mostra **descrição**, **preview visual** e um **diagrama de arquitetura** interativo.

### Fluxo de uso

1. **Seleção de projeto** — use as setas ou os indicadores coloridos para trocar entre Piesse, Frevo, Egle e 1001Tem
2. **Informações à esquerda** — nome, descrição curta, descrição longa e tecnologias em tags
3. **Preview da aplicação** — imagem representativa com hover e botão "Ver mais"
4. **Diagrama de arquitetura** — componentes (Frontend, API, DB, etc.) conectados em um grafo visual

### Diagrama (React Flow)

Cada projeto tem um **workflow** mostrando:

- **Nós** com ícones (Globe, Server, Database, Cloud, etc.)
- **Conexões** entre frontend, backend, banco, serviços externos
- **Cores** diferentes por projeto (indigo, rosa, verde, âmbar)
- **Zoom e pan** para explorar o diagrama
- **Fit view** automático ao trocar de projeto

### Tecnologias

As tags de tecnologias usam a cor do projeto, com bordas e efeito de hover suave.

---

## Blog: artigos com busca e categorias

O blog é alimentado por uma **API NestJS** e armazena posts em **Markdown** no Supabase.

### Listagem (\`/blog\`)

- **Grid de cards** com título, resumo, data, tempo de leitura e tag "Destaque"
- **Sidebar** com categorias e contagem de artigos
- **Busca em tempo real** — filtra posts enquanto você digita
- **React Query** para cache e invalidação automática

### Post individual (\`/blog/[slug]\`)

- **Link "Voltar para o blog"**
- Tag de categoria, data e tempo de leitura
- Título, autor e conteúdo em Markdown
- **Tabela de conteúdos** (TOC) lateral com links para os headings
- **Barra de progresso** de leitura no topo
- **Botões de compartilhar** (Twitter, LinkedIn, etc.)
- Suporte a **links externos** no rodapé

### Formatação Markdown

O conteúdo suporta:

- Títulos, listas, negrito, itálico
- Blocos de código com syntax highlighting
- Tabelas
- Links e imagens
- Blockquotes

---

## Admin: criação de conteúdo

O painel **\`/tonio\`** permite gerenciar o blog sem mexer no código.

### Categorias

- Campo **nome** — ex.: "Desenvolvimento"
- **Slug** gerado automaticamente a partir do nome (ex.: \`desenvolvimento\`)
- Categorias usadas para filtrar posts na sidebar do blog

### Posts

- **Título** e **slug** (editável)
- **Resumo** para o card na listagem
- **Conteúdo** em Markdown via editor BlockNote
- **Tempo de leitura** (minutos)
- **Destaque** — checkbox para marcar como artigo em evidência
- **Categorias** — múltipla seleção
- **Publicar** ou salvar como rascunho (published_at)

### Fluxo

1. Criar categoria (se necessário)
2. Criar post com título, slug, resumo, conteúdo
3. Associar categorias
4. Publicar — o post aparece no blog e na busca

---

## Tecnologias por camada

### Frontend

| Tecnologia | Uso |
|------------|-----|
| **Next.js 16** | App Router, SSR/ISR, rotas dinâmicas |
| **React 19** | Componentes e hooks |
| **TypeScript** | Tipagem em todo o projeto |
| **Tailwind CSS 4** | Estilização e design tokens |
| **Framer Motion** | Animações e transições |
| **React Query** | Cache e fetching de dados |
| **Lucide React** | Ícones |
| **@xyflow/react** | Diagramas de arquitetura |
| **react-markdown** | Renderização de artigos |
| **BlockNote** | Editor Markdown no admin |

### Backend

| Tecnologia | Uso |
|------------|-----|
| **NestJS** | API REST |
| **Supabase** | PostgreSQL + cliente JS |
| **class-validator** | Validação de DTOs |

### Tipografia

- **Poppins** — texto geral
- **Geist Mono** — código
- **Cherry Bomb One** — títulos em destaque
- **Asset** — acentos visuais

---

## Design e experiência

### Princípios

- **Minimalista** — foco em conteúdo, sem poluição visual
- **Responsivo** — mobile-first, breakpoints em sm, md, lg, xl
- **Acessível** — labels ARIA, contraste e estrutura semântica
- **Performático** — imagens otimizadas, cache com React Query e ISR

### Efeitos visuais

- **Cards animados** — gradientes, brilho e leve flutuação
- **Transições suaves** — ao trocar de projeto, ao rolar, ao abrir posts
- **Cores por projeto** — identidade visual consistente na seção de projetos
- **Textura sutil** — grain leve em algumas páginas

---

## Resumo: como tudo se encaixa

\`\`\`
[Navegador] → [Next.js Frontend] → [API NestJS] → [Supabase/PostgreSQL]
                    ↓
            Páginas estáticas (Início, Sobre, Projetos)
            + Páginas dinâmicas (Blog, Post, Admin)
\`\`\`

O frontend consome a API para blog e admin. As demais páginas (Início, Sobre, Projetos) usam dados estáticos ou locais. O resultado é um portfólio que combina **vitrine profissional**, **blog técnico** e **painel administrativo** em uma única aplicação moderna e responsiva.

---

*Este artigo faz parte da documentação do site. Se tiver dúvidas ou quiser conversar sobre desenvolvimento web, acesse a página de contato.*
`;

const DEFAULT_POST_CATEGORY = {
  id: "default-category-documentacao",
  name: "Documentação",
  slug: "documentacao",
};

export const defaultPost: Post = {
  id: "default-post-como-funciona-o-site",
  title: "Como funciona o site Antonio Mesquita",
  slug: DEFAULT_POST_SLUG,
  content: DEFAULT_POST_CONTENT,
  snippet:
    "Um guia completo pelas funcionalidades, arquitetura e recursos deste portfólio. Descubra como cada parte do site foi pensada para entregar uma experiência fluida e informativa.",
  read_time_minutes: 8,
  published_at: "2026-05-01T12:00:00.000Z",
  featured: true,
  links: [],
  created_at: "2026-05-01T12:00:00.000Z",
  updated_at: "2026-05-01T12:00:00.000Z",
  categories: [DEFAULT_POST_CATEGORY],
};

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Verifica se o post padrão deve aparecer dado o conjunto de filtros aplicado.
 * O post sempre faz parte do blog, mas pode ser excluído por categoria/busca/featured.
 */
export function defaultPostMatchesParams(params?: PostsParams): boolean {
  if (!params) return true;

  if (params.featured && !defaultPost.featured) return false;

  if (params.category) {
    const matches = defaultPost.categories.some(
      (c) => c.slug === params.category
    );
    if (!matches) return false;
  }

  if (params.search) {
    const term = normalize(params.search.trim());
    if (term) {
      const haystack = normalize(
        [defaultPost.title, defaultPost.snippet ?? "", defaultPost.content].join(
          " "
        )
      );
      if (!haystack.includes(term)) return false;
    }
  }

  return true;
}

/**
 * Mescla o post padrão à lista vinda da API, evitando duplicatas pelo slug.
 * O post padrão sempre aparece no topo (é destaque + documentação do site).
 */
export function mergeWithDefaultPost(
  posts: Post[],
  params?: PostsParams
): Post[] {
  if (!defaultPostMatchesParams(params)) return posts;

  const filtered = posts.filter(
    (p) => p.slug !== defaultPost.slug && p.id !== defaultPost.id
  );
  return [defaultPost, ...filtered];
}

export function isDefaultPostSlug(slug: string): boolean {
  return slug === defaultPost.slug;
}
