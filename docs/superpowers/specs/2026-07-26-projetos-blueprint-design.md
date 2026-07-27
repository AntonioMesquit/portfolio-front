# Redesign da página /projetos — Prancha Técnica Viva

Data: 2026-07-26
Status: implementado e revisado

> **Nota de revisão.** Uma revisão adversarial por agentes independentes (32 achados
> confirmados, 5 refutados) alterou cinco decisões deste documento. As seções abaixo já
> refletem o que está no código; a lista das mudanças está em "Divergências corrigidas
> na revisão", no fim.

## Problema

A página `/projetos` está visualmente poluída e sem hierarquia. Por projeto ela empilha:

- um badge com o nome do projeto,
- um `h1` com o mesmo nome de novo,
- `description` e `longDescription` como dois blocos de texto corridos,
- até 10 pills de tecnologia,
- um card com borda + header (ícone, título, subtítulo) contendo uma foto do Unsplash rotulada "Preview da Aplicação",
- outro card com borda + header contendo um canvas ReactFlow com controles e fundo pontilhado.

Tudo isso dentro de containers com `backdrop-blur-xl`, `shadow-xl`, `rounded-3xl` e bordas semitransparentes. O conteúdo compete consigo mesmo e nenhum elemento é claramente o protagonista. As fotos, além disso, são banco de imagens genérico apresentado como "Veja como ficou o resultado final", o que compromete a credibilidade.

## Objetivo

Transformar a página numa peça de portfólio memorável, cujo protagonista é o **diagrama de arquitetura**, tratado como uma prancha de desenho técnico. A troca entre projetos deve ser uma animação de remontagem, não um slideshow.

## Decisões tomadas

1. **As fotos do Unsplash saem.** O campo `preview` é removido do modelo.
2. **O ReactFlow sai.** O diagrama passa a ser desenhado à mão com nós em HTML e conexões em SVG, o que remove `@xyflow/react` do bundle da rota e dá controle total da animação.
3. **A animação é "arquitetura viva" com GSAP Flip.** Ao trocar de projeto, os nós compartilhados não desaparecem: eles se movem fisicamente para a nova posição e trocam de rótulo.
4. **Estética blueprint técnico, em fundo claro.** Papel milimetrado, traço fino, rótulos em monoespaçada, cotas e marcas de registro. Mantém a página coerente com o resto do site (que é branco) e evita o clichê de "tech escuro com brilho".
5. **GSAP é a única biblioteca de animação nesta página.** Nenhum import de `framer-motion` no subtree de projetos.

## O insight central: taxonomia de papéis

O Flip só tem o que animar se os projetos compartilharem nós. Hoje os ids em `projects-data.ts` são `"1"`..`"7"`, sem significado entre projetos. Mapeando por **papel**:

| Papel | Piesse | Frevo | Egle | 1001Tem |
|---|---|---|---|---|
| `client` | Frontend · Next.js | Web App · React | Frontend · Vue.js | Web App · Next.js |
| `api` | API Gateway · NestJS | Backend API · Express | API · FastAPI | GraphQL API · Apollo |
| `db` | Database · PostgreSQL | Database · MongoDB | Database · PostgreSQL | Database · PostgreSQL |
| `ai` | AI Service · OpenAI | — | — | — |
| `chatbot` | Chatbot · Custom AI | — | — | — |
| `payment` | — | Payment · Stripe | — | Payment · Stripe |
| `realtime` | — | Real-time · Socket.io | — | — |
| `cache` | — | Cache · Redis | — | — |
| `cms` | — | — | CMS · Django | — |
| `storage` | — | — | Storage · AWS S3 | — |
| `video` | — | — | Video · WebRTC | — |
| `mobile` | — | — | — | Mobile · React Native |
| `auth` | — | — | — | Auth · Firebase |
| `maps` | — | — | — | Maps · Google Maps |

**Exatamente três papéis (`client`, `api`, `db`) existem nos quatro projetos.** Em toda transição esses três viajam pela tela trocando de rótulo, enquanto de 2 a 4 satélites nascem e morrem. Poucos viajantes tornam o movimento rastreável pelo olho, e a leitura resultante — *o mesmo problema resolvido com stacks diferentes* — é exatamente a mensagem que um portfólio quer passar.

Contagem por transição (ordem: Piesse → Frevo → Egle → 1001Tem → volta):

| Transição | Viajam | Entram | Saem |
|---|---|---|---|
| Piesse → Frevo | 3 | payment, realtime, cache | ai, chatbot |
| Frevo → Egle | 3 | cms, storage, video | payment, realtime, cache |
| Egle → 1001Tem | 3 | mobile, auth, payment, maps | cms, storage, video |
| 1001Tem → Piesse | 3 | ai, chatbot | mobile, auth, payment, maps |

## Arquitetura da solução

### Modelo de dados

`app/components/projects/types.ts` (novo) passa a ser a fonte dos tipos, tirando essa responsabilidade de `project-card.tsx` (que será deletado).

```ts
export type NodeRole =
  | "client" | "api" | "db" | "ai" | "chatbot" | "payment"
  | "realtime" | "cache" | "cms" | "storage" | "video"
  | "mobile" | "auth" | "maps";

export interface BlueprintNode {
  role: NodeRole;      // estável entre projetos — vira o data-flip-id
  label: string;       // rótulo exibido neste projeto
  tech: string;        // stack exibida neste projeto
  x: number;           // 0-100, coordenada normalizada
  y: number;           // 0-100, coordenada normalizada
}

export interface BlueprintEdge {
  from: NodeRole;
  to: NodeRole;
}

export interface Project {
  id: string;
  name: string;
  tagline: string;       // uma linha, substitui description
  description: string;   // parágrafo único, substitui longDescription
  year: string;
  technologies: string[];
  color: string;
  blueprint: { nodes: BlueprintNode[]; edges: BlueprintEdge[] };
}
```

Coordenadas normalizadas (0-100) em vez de pixels: o container escala e as posições acompanham sem tabela por breakpoint. As posições de cada projeto são compostas à mão — com no máximo 7 nós, um layout autoral fica melhor que qualquer auto-layout.

`description` e `longDescription` viram `tagline` (uma linha) e `description` (um parágrafo). Hoje os dois textos dizem quase a mesma coisa em tamanhos diferentes; essa duplicação é metade da sensação de poluição.

### Componentes

```
app/components/projects/
  types.ts                      tipos e taxonomia de papéis
  projects-data.ts              os 4 projetos com blueprint remodelado
  projects-section.tsx          shell: estado do projeto atual, teclado, layout
  blueprint/
    blueprint-diagram.tsx       orquestra Flip + nós + arestas
    blueprint-node.tsx          um nó (div absoluta, traço fino, cantos com tick)
    blueprint-edges.tsx         <svg> das conexões ortogonais
    use-flip-transition.ts      hook: captura estado, aplica, anima, sincroniza arestas
    geometry.ts                 cálculo de caminho ortogonal entre dois nós
  project-meta.tsx              nome, tagline, descrição, stack
  title-block.tsx               cartucho de desenho técnico (canto inferior direito)
```

Cada arquivo tem um propósito único e testável isoladamente. `geometry.ts` é função pura — dado dois retângulos, devolve o `d` de um caminho ortogonal com cotovelo. `use-flip-transition.ts` não sabe nada de blueprint: recebe um container e um callback de sincronização.

### Como a animação funciona

O ciclo, disparado quando `currentProject` muda:

1. `Flip.getState("[data-flip-id]", { props: "opacity" })` captura posições antes do re-render.
2. React re-renderiza com os nós do novo projeto. Nós cujo `role` existe nos dois estados mantêm o mesmo `data-flip-id` e são correlacionados pelo Flip; os demais entram ou saem.
3. `Flip.from(state, { duration, ease, absolute: true, fade: true, onEnter, onLeave, onUpdate })`.
   - `onEnter`: satélites novos surgem com `scale: 0.8 → 1`, `opacity: 0 → 1`, escalonados.
   - `onLeave`: satélites que saem encolhem e desaparecem primeiro, liberando o palco.
   - `onUpdate`: recalcula os `path` do SVG lendo a posição real dos nós no DOM a cada frame, de modo que as linhas grudem nos nós enquanto eles voam.
4. Os rótulos dos três viajantes fazem crossfade durante o voo (`NestJS` → `Express`), não troca seca.
5. As arestas do novo projeto que não existiam desenham-se por `strokeDashoffset` depois que os nós assentam.

`useGSAP` do `@gsap/react` com `{ scope: containerRef, dependencies: [index] }` cuida do cleanup na desmontagem. **Sem `revertOnUpdate`**: reverter o contexto a cada mudança de dependência desfaria as transformações que o Flip acabou de aplicar, destruindo a animação. A retenção de objetos até a desmontagem é o comportamento documentado e pretendido da API.

`FLIP_DURATION` não é a duração real do voo: `stagger` incide sobre os 14 alvos e estica a timeline. Os cues secundários (resolução do texto, entrada das arestas) ancoram em `timeline.duration()`, lido logo após `Flip.from` e antes de anexar filhos.

### Estética blueprint

- **Papel**: branco levemente quente. Duas camadas de grade — malha fina de 8px a ~3% de tinta, malha maior de 80px a ~6% — via `background-image` com `repeating-linear-gradient`.
- **Tinta**: neutro escuro quase preto para traço e texto.
- **Cor do projeto**: usada com parcimônia. `color` entra **só** em `stroke`, `border`, `outline` e `box-shadow`; para texto existe `colorText`, a variante -800, porque o tom -600 reprova contraste AA nos tamanhos usados aqui (rosa 4,36:1, verde 3,58:1, âmbar 3,02:1).
- **Dimensões do nó em container query**: `--bp-node-w: clamp(64px, 22cqi, 150px)`, medido na folha (`container-type: inline-size`) e não no viewport. Em 1024px o grid corta a folha ao meio, e um nó de largura fixa passaria a ocupar 41% da área de plotagem. O tipo encolhe junto, senão o rótulo quebra em três linhas e a caixa cresce em altura.
- **Tipografia**: `Geist Mono` (já carregada no layout raiz e hoje sem nenhum uso) para todos os rótulos, stacks, cotas e o cartucho, em caixa alta com `letter-spacing`. `Poppins` para o nome do projeto e a tagline. `Cherry Bomb One` fica de fora — é lúdica demais para uma prancha.
- **Nó**: sem card. Retângulo de 1px, cantos vivos (blueprint não tem canto arredondado), rótulo em mono caixa alta, stack abaixo em mono menor a 60%. Quatro ticks em L nos cantos, detalhe de desenho técnico.
- **Conexões**: traço de 1px na cor do projeto, ortogonais com cotovelo em ângulo reto e ponta de seta — nunca bezier, porque bezier não é linguagem de prancha.
- **Ornamentos que vendem a metáfora**: cotas (linha fina com ticks nas pontas e medida em mono), marcas de registro em cruz nos cantos da área de desenho, e um **cartucho** no canto inferior direito com nome do projeto, `PRANCHA 0N/04`, ano e contagem de tecnologias.

### Navegação

Setas (mantidas, redesenhadas), abas numeradas no lugar dos pontinhos, e **teclado**: `←`/`→` trocam de projeto, `Home`/`End` vão aos extremos, com `focus-visible` real. Hoje não há suporte a teclado nenhum.

`↑`/`↓` ficam **de fora** de propósito: a faixa é horizontal, e capturá-las com `preventDefault` roubaria a rolagem por teclado da página.

A navegação é um `role="group"` de botões com `aria-current`, **não** um `tablist`. O padrão tabs exigiria que o painel contivesse o que a navegação troca — mas nome, tagline, parágrafo e especificação vivem em `ProjectMeta`, fora da folha. Declarar `tabpanel` na folha anunciaria uma relação que não existe.

### Acessibilidade

- `prefers-reduced-motion: reduce` desliga o Flip: a troca vira corte seco com crossfade curto de opacidade. Lido com `window.matchMedia` a cada transição, dentro do efeito — reavaliado toda vez, então funciona se o usuário mudar a preferência no meio da sessão.
- O desenho todo é `aria-hidden`. A alternativa é um parágrafo `sr-only` com `aria-live="polite"` que descreve **os nós e as conexões** — um inventário de peças sem as ligações omitiria justamente a informação que um diagrama de arquitetura existe para transmitir.
- O ano do projeto é exposto em texto na coluna de meta. O cartucho é decorativo (`aria-hidden`), e o ano era o único dado dele sem duplicata acessível.
- Contraste medido nos quatro fundos reais da página (papel, folha, nó, cartucho): `--bp-ink-soft` 6,98 a 7,10:1; `--bp-ink-mute` 4,95 a 5,01:1. Os valores originais do spec (0,62 e 0,45 de alfa) davam 2,92:1 e reprovavam.
- O único `h1` da rota é o nome do projeto; a seção é rotulada por `aria-label`, não por um `h2` que vinha antes do `h1`.

## Fora de escopo

- Rotas por projeto (`/projetos/[slug]`) e links reais para produto ou repositório. A interface `Project` não tem campos de URL e não existem URLs para preencher. O botão "Ver mais" — que hoje é uma `div` decorativa sem `href` — é **removido** em vez de mantido mentindo.
- Screenshots reais dos projetos. Ficam pendentes de material.
- Os demais achados da auditoria fora desta página.

## Riscos

- **Sincronizar as arestas ao movimento dos nós** é a única parte não trivial. Mitigação: `geometry.ts` é função pura e testável, e o `onUpdate` lê `getBoundingClientRect` dos nós já posicionados pelo Flip.
- **Terceira biblioteca de animação no projeto.** GSAP entra enquanto `framer-motion` e `motion` continuam instaladas. Mitigação parcial: esta página não importa nenhuma das duas. A consolidação geral está na Onda 2 da auditoria e não é resolvida aqui.
- **`overflow-x: hidden` global** em `html`/`body` (`globals.css:9-12`) quebra `position: sticky`. O novo layout não depende de sticky, então contorna o problema em vez de esbarrar nele.

## Divergências corrigidas na revisão

| Decisão original | O que ficou no código | Por quê |
|---|---|---|
| `useGSAP` com `revertOnUpdate: true` | sem `revertOnUpdate` | reverter o contexto desfaria as transformações do Flip e mataria a animação |
| `tablist` / `tabpanel` | `role="group"` + `aria-current` | o painel não contém o que a navegação troca; a relação anunciada seria falsa |
| `role="img"` + `<ul>` oculta | `<p class="sr-only">` com nós **e** conexões | a informação que faltava eram as arestas, não a marcação da lista |
| `gsap.matchMedia()` | `window.matchMedia` dentro do efeito | o ramo manual já é reavaliado a cada transição; trocar a API era refatoração |
| nó em px por media query de viewport | `clamp(..cqi..)` em container query | a folha é 60% de uma coluna: em 1024px o nó virava 41% da área de plotagem |

Também acrescentado na revisão: `colorText` por projeto, a invariante de separação em `projects-data.ts`, o desvio ortogonal no fallback de `orthogonalPath` (a reta centro-a-centro ficava enterrada sob as caixas opacas), e dono único para a opacidade das arestas via `--bp-edge-opacity`.

## Verificação

Estado atual: `npx tsc --noEmit` limpo, `npm run build` passa, `npx eslint` nos arquivos do redesign sem nenhum erro ou aviso (o lint global segue nos 7 erros e 10 avisos pré-existentes, todos fora desta entrega).

Falta apenas a passada manual em navegador, que não foi possível nesta sessão: trocar de projeto pelas quatro abas em 320, 375, 1024, 1280 e 1366px, mais zoom de 400% em 1280px, verificando que nenhuma caixa encavala e que toda aresta aparece com seta. E o teste de regressão de A4: ligar "reduzir movimento" **no meio** da sessão e alternar rápido entre abas, conferindo que nenhuma conexão fica faltando ou semitransparente.

Nota: o HTML servido de `/projetos` — como de toda rota — é apenas o spinner do `AppLoader`, que bloqueia `{children}` no layout raiz. Defeito pré-existente, fora do escopo deste redesign, registrado na Onda 1 de `AUDITORIA.md`. A verificação de marcação acima foi feita desviando o loader temporariamente.
