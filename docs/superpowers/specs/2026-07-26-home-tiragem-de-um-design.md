# Home — "Tiragem de Um"

Data: 2026-07-26
Status: implementado, em revisão

## Problema

A home anterior (`app/components/hero/`) era o retrato do portfólio gerado por IA:

1. Cards de gradiente pastel com canto muito arredondado, sombra difusa, blur, flutuação infinita e um brilho varrendo a superfície — o bento glassmorphism de qualquer template.
2. Métricas de vaidade sem lastro nenhum no site: "35+ projetos", "18+ parceiros", "5.0 satisfação".
3. Copy que não diz nada: "experiências imersivas", "aplicações amigáveis ao usuário", "transformo ideias em experiências digitais envolventes".
4. Rabiscos SVG animados sublinhando palavras.
5. Simetria centrada, sem hierarquia real.

E desperdiçava o único ativo genuinamente pessoal da página: `iconAntonioHome.png`, um desenho **à mão, nanquim sobre papel**, que ficava flutuando ao lado dos gradientes e perdia a comparação.

## Como a direção foi escolhida

Quatro conceitos independentes foram gerados sob mandatos distintos (editorial, temporal, índice, oficina) e julgados por três lentes independentes cada: distinção anti-template, verdade e voz, e execução. Resultado:

| Conceito | Média |
|---|---|
| **Tiragem de Um** (editorial) | **7,7** |
| COTA — a linha de medida (temporal) | 7,0 |
| Índice Geral (catálogo) | 7,0 |
| Bancada (oficina) | 7,0 |

Venceu porque a ideia central não é um estilo: *esta página é um exemplar único, composto no instante em que você a abriu* é uma afirmação sobre o objeto, verificada pelo próprio comportamento da página. Os três empatados tropeçavam no mesmo lugar — COTA e Bancada reinstalavam o numerão que sobe de zero, que é a `stats-grid` de volta só que tipografada.

## O conceito

A home é um jornal de tiragem 1, impresso no momento do acesso. **O jornal aparece por estrutura — fio, calha, coluna, folio, expediente — e nunca por textura.** Nada de papel envelhecido, ruído, sépia, serifa "de jornal" ou "VOL. XXIV Nº 3".

Regras editoriais que governam o conteúdo:

- **Prova, não alegação.** Toda afirmação tem que ser conferível olhando para a própria página. A legenda diz que a única cor da página saiu do vapor da caneca do desenho — o leitor confere.
- **Nenhum intervalo de tempo que não seja lido de duas datas impressas na mesma página.** Some "4 anos", some qualquer duração calculada, some contador de dias. A idade só aparece ancorada num ano passado ("entrei aos 17"), que nunca apodrece.
- **Nenhum fato aparece duas vezes.** A linha fina carrega o que a tabela não consegue (voz, postura, disponibilidade); a tabela carrega o que a prosa não consegue (data, empresa, stack, artefato).
- **Dados derivados do código, nunca redigitados.** Os quatro produtos são lidos de `projectsData`, e o número da folha vem do mesmo `padStart(2, "0")` que o cartucho da prancha imprime.

## Condições bloqueantes (fora da home)

Cinco mudanças sem as quais a página não funciona. As duas primeiras eram itens da Onda 1 de `AUDITORIA.md`.

| Arquivo | Mudança | Por quê |
|---|---|---|
| `app/layout.tsx` | Removido `FollowingPointerWrapper` | Aplicava `cursor: none` no site inteiro e desenhava um ponteiro colorido perseguindo o mouse — um dos tells mais reconhecíveis de portfólio gerado. Também rodava `getBoundingClientRect()` a cada evento de scroll com `capture: true`. |
| `app/components/app-loader.tsx` | Deixou de bloquear `children`; agora só faz prefetch | Eram 1,2 s de loader + 0,35 s de fade de saída antes de qualquer filho montar, e o HTML de **toda** rota era só um spinner. Uma página que se chama "impressa às 14:32:07" não pode levar quase dois segundos para existir. |
| `app/components/navbar/components/navbar.tsx` | `backdrop-blur` e `bg-white/80` → `var(--paper)` e fio de 1px | Era a última peça de vidro flutuando sobre páginas que agora são tinta sobre papel. |
| `app/page.tsx` | `export const dynamic = "force-dynamic"` | Sem isso o Next prerenderiza no build e a data congela na data do deploy — a página passaria a mentir sobre a única coisa que a define. |
| `app/globals.css` | Nada a mexer, mas a respeitar: `html, body { overflow-x: hidden }` mata `position: sticky` | Por isso não há nada fixo na home. Em compensação a sangria com `100vw` é segura, porque a scrollbar já está escondida. |

Aproveitando que o `AppLoader` foi reescrito, dois defeitos vizinhos da auditoria foram corrigidos junto: o cache passou a ser semeado com `prefetchQuery` usando as **mesmas** opções dos hooks (semear com dados crus fazia o post em destaque sumir da listagem justamente quando a API estava no ar), e `mergeWithDefaultCategories` deixou de mutar objetos vindos do cache.

## A página

```
app/components/edition/
  edition-section.tsx   raiz client, escopo do GSAP, noscript de segurança
  folio.tsx             tira de identificação sangrada
  lede.tsx              capa: manchete + linha fina + placa
  portrait-plate.tsx    a ilustração com legenda
  trajectory.tsx        <ol> com subgrid
  products-strip.tsx    quatro produtos, lidos de projectsData
  classifieds.tsx       oferece-se + correspondência
  colophon.tsx          o rodapé que o site nunca teve
  use-print-run.ts      o movimento
  edition-data.ts       trajetória e contato
```

**A — Folio.** Sangra de borda a borda, entre dois fios pesados de 2px. Nome, local, data, hora da impressão e e-mail. Não existe cabeçalho com o nome em corpo gigante: numa página em que o editor e o assunto são a mesma pessoa, ampliar o próprio nome é o pedaço de tinta mais genérico possível. A maior coisa da página é a manchete.

**B — Capa.** Manchete em três linhas — *"Em 2022 eu era calouro. Em 2025, CTO."* — mais a linha fina, e a placa do retrato nas colunas 8–12, separada por um fio de calha. Sem byline: o folio já assinou. Sem corpo em prosa: contaria os mesmos fatos da tabela.

**C — Trajetória.** `<ol>` com `subgrid`, não `<table>`. O subgrid alinha as quatro colunas entre as linhas, e abaixo de 768px cada item empilha sem que nenhum papel de acessibilidade se perca — trocar `display` num `<table>` remove os papéis de tabela no Chrome e no Safari. Nenhuma duração calculada: "Jun/2024 – Jan/2025" está impresso; quem quiser oito meses conta.

**D — Quatro produtos.** Faixa horizontal, para não virar a terceira lista raiada idêntica. Um único link, no cabeçalho — as células são texto porque `projects-section.tsx` guarda o projeto atual em `useState` sem `searchParams`, então quatro links levariam todos ao primeiro.

**E — Classificados.** Duas células, não três: "procura-se" saiu por ser a única promessa sem lastro. O handle do LinkedIn é impresso inteiro.

**F — Expediente.** Nasce com uma prop só, de propósito: quando `/sobre` e `/blog` receberem o mesmo tratamento, sobe para `app/layout.tsx` e serve o site inteiro.

## Movimento

**Um verbo só: revelar por corte horizontal.** Uma barra de 1px desce em velocidade constante (`ease: "none"` — máquina não acelera para ficar bonita) e cada bloco imprime no instante em que ela o cruza, com a posição calculada a partir da geometria, não coreografada à mão. `clip-path: inset(0 0 100% 0)` → `inset(0 0 0% 0)` no conteúdo; `scaleX` nos fios.

Zero `translateY`, zero fade-up escalonado, zero parallax, zero `repeat: -1`, zero contador. Depois de ~1,3 s a página está impressa e parada para sempre.

Três detalhes que não são opcionais:

1. **O estado armado mora no CSS**, não dentro do `.then()` de `document.fonts.ready`. Se esperasse as fontes, a página inteira apareceria por até 600 ms, sumiria e voltaria.
2. **O hook re-aplica o estado inline com `gsap.set` antes de pôr a classe `is-printed`.** Sem essa ordem, o `clearProps` no fim de cada tween devolveria o elemento à regra armada do CSS e ele sumiria de novo.
3. **Só a medição espera as fontes**, com `Promise.race` contra 600 ms e um bail de 2 s. Sem isso o layout muda debaixo da timeline e a barra revela blocos na altura errada.

Blocos abaixo da primeira tela não entram na timeline — seriam agendados em t≈3,5 s, brigando com um scroll que já aconteceu. Vão para `ScrollTrigger`.

`prefers-reduced-motion` sai na primeira linha do hook: o CSS já entrega o estado final, o JS só carimba a hora e retorna. A barra é escondida por CSS.

E um `<noscript>` desarma o `clip-path`, senão a página inteira ficaria invisível sem JS.

## Sistema visual

**Um papel só, para o site inteiro** — `--paper: #f4f1e8`. Aqui houve **desvio deliberado da direção**, que pedia velino (`#faf9f5`) na prancha e jornal na home: a navbar é `fixed` e mora fora das duas páginas, então não herda o papel de quem está embaixo, e sobraria uma faixa de tom diferente no topo. A diferenciação entre as páginas é carregada por grade milimetrada contra ausência de grade, fio inset contra fio sangrado, e densidade de tinta.

Tokens promovidos para `:root` (`--ink`, `--ink-soft`, `--ink-mute`, `--rule`, `--rule-heavy`, `--paper`, `--mono`); `.bp-page` passou a consumi-los por alias, sem quebrar nada.

**A cor.** O verde-água é amostrado do vapor da caneca do desenho (`#6fc5b8`) e aparece em exatamente três lugares: o fio na lateral da linha "Desde 2025", o anel de foco, e as setas dos links de navegação (nesses, na variante escura `#0f6b62`, legível). Nunca como preenchimento, nunca em texto corrido. A página deriva a paleta do desenho, e a legenda declara isso em voz alta.

**Tipografia.** Poppins 600 na manchete em `clamp(2.4rem, 5.6vw, 5.25rem)` com o mesmo `letter-spacing: -.035em` do `.bp-meta__name` — mesma afinação de display, mesma mão. Geist Mono em toda a mobília. Cherry Bomb One fica de fora.

## Conversa com /projetos

**Compartilhado:** a tinta e o fio; a escala e o tracking da mobília em mono; a medida de 1480px; o `padding-top: 7rem`; a receita da placa (`border: 1px solid var(--rule)` + `color-mix`, que é o `.bp-sheet`); a disciplina de um acento só; o `padStart(2, "0")`; o padrão de `:focus-visible`; e o padrão de código (`useGSAP` com escopo, ramo de reduced-motion na entrada do hook, `clearProps` depois dos tweens, hook nomeado pelo gesto).

**Diferente, de propósito:** grade milimetrada contra ausência de grade; densidade (a prancha é ~8% de cobertura e muito branco, a home é uma parede de tipo); fio inset contra fio sangrado; acento que muda por projeto lá, acento fixo derivado do desenho aqui. E o verbo: lá as peças **voam**, aqui as coisas **imprimem**.

O vínculo explícito de conteúdo é a coluna `FL. 01/04`, que é o mesmo número que a prancha imprime no próprio cartucho.

## Contato

O site não tinha **nenhum** caminho de contato no desktop — o `mailto:` e o LinkedIn só existiam dentro de `mobile-menu.tsx`, num container `md:hidden`, e não havia rodapé em lugar nenhum. A home resolve em três alturas: o e-mail na última célula do folio (primeira tela), os classificados com e-mail e LinkedIn por extenso, e o expediente.

Nenhum aponta para `/contato`: a rota é um stub com `text-white` sobre fundo branco, e mandar alguém para lá é pior que não ter caminho. Os links são diretos.

## Verificação

`tsc --noEmit` limpo, `npm run build` passa, `/` renderizada sob demanda. O HTML servido saiu de 12,9 KB (só spinner) para 25 KB com a página inteira. `eslint` sem nenhum erro ou aviso nos arquivos novos; o total do projeto caiu de 7 para 6 erros, porque deletar o ponteiro customizado eliminou um `Math.random` em corpo de render.

Falta a passada visual em navegador, que não foi possível nesta sessão.
