import type { Post } from "../api";

/**
 * ===========================================================================
 * FRONTEIRA COM A HOME E COM A CARTA. Nenhum fato aparece duas vezes no site.
 *
 * A tabela da home já NOMEIA o produto ("contratos, jurisprudência e um chatbot
 * por processo"). A carta já disse o que mudou nele. Este artigo é a terceira
 * camada e a única que as outras duas não conseguem ser: o problema de
 * engenharia, aberto.
 *
 * PROIBIDO AQUI:
 *   · período, empregador, cargo, stack ou idade — estão na tabela e na carta;
 *   · "começou como SaaS e virou plataforma";
 *   · métrica que o site não sustenta: nada de "reduziu X%", "N usuários",
 *     "N documentos". Se não dá para conferir, não entra;
 *   · nome de cliente, de escritório ou de processo real.
 * ===========================================================================
 */
const CONTENT = `> A pergunta que decidiu a arquitetura não foi qual modelo usar. Foi o que acontece quando alguém pergunta sobre um processo e a resposta vem de outro.

## O erro que sussurra

Um assistente jurídico começa parecendo um problema de busca, e é assim que quase todo mundo começa: você joga o acervo inteiro num índice — peças, decisões, contratos, jurisprudência —, deixa a busca por similaridade achar os trechos parecidos com a pergunta, e entrega esses trechos ao modelo junto com a pergunta.

Isso funciona na demonstração. Funciona no teste. Funciona nas primeiras semanas.

E um dia alguém pergunta sobre o caso de um cliente e recebe, no meio de uma resposta correta, um parágrafo que veio do caso de outro.

O detalhe importante é que **o modelo não alucinou**. O trecho existe, está no acervo, e é genuinamente parecido: duas rescisões contratuais se parecem muito, e é exatamente para isso que busca semântica serve. O sistema fez o que foi pedido. O pedido é que estava errado.

É o pior formato de erro que eu conheço. Ele é raro, é plausível, e o usuário não tem como perceber — o texto se encaixa, o tom é o mesmo, a tese fecha. Erro que grita você conserta na primeira semana. Erro que sussurra fica.

## Por que não se resolve com prompt

A primeira reação de todo mundo, inclusive a minha, é escrever no prompt: *use apenas os documentos deste processo*.

Isso não é uma correção, é um pedido. Instrução em linguagem natural é uma preferência forte, não uma garantia — e o modelo não tem como cumpri-la, porque quando ele lê o prompt o trecho errado já está lá dentro. Você entregou o material contaminado e pediu boa vontade.

A regra que eu tirei disso, e que vale muito além de IA:

**Se o dado errado consegue chegar até a camada que decide, o problema é da camada de baixo.** Instrução é para desempate, não para isolamento.

## Um índice por processo

A correção é chata e não tem nada de inteligente: o escopo deixa de ser um filtro que se pode esquecer de aplicar e passa a ser um argumento que não se pode omitir.

\`\`\`ts
// A busca nunca recebe a pergunta sozinha. O escopo entra pelo tipo:
// esquecer de passar não compila, e "esquecer" era o modo de falha real.
async function buscarTrechos(pergunta: string, escopo: EscopoProcesso) {
  const trechos = await indice.buscar({
    consulta: pergunta,
    processoId: escopo.processoId,
    limite: 12,
  });

  // Cinto e suspensório. Se algum dia um trecho escapar do filtro — índice
  // remontado errado, migração pela metade, bug meu — ele morre aqui, alto,
  // e não silenciosamente dentro de uma resposta bem escrita.
  const invasores = trechos.filter((t) => t.processoId !== escopo.processoId);
  if (invasores.length > 0) {
    throw new VazamentoDeEscopo(escopo.processoId, invasores);
  }

  return trechos;
}
\`\`\`

O \`throw\` no fim parece redundante — o filtro acima já deveria bastar. Ele existe porque a alternativa a falhar alto é falhar baixo, e falhar baixo aqui significa entregar o conteúdo de um cliente para outro. Prefiro uma tela de erro a uma resposta bonita e indefensável.

Nem tudo, porém, é do processo. A separação real é entre o que é **do caso** e o que é **do mundo**:

| O que | Onde vive | Por quê |
|---|---|---|
| Peças, decisões e prazos do caso | Índice do processo | Vazar isso é vazar cliente |
| Anotação interna sobre a estratégia | Índice do processo | É o material mais sensível que existe |
| Jurisprudência publicada | Índice comum | É público; separar por caso só empobrece a resposta |
| Cláusula-modelo, checklist, glossário | Índice comum | Existe justamente para ser reaproveitado |

Essa tabela é a decisão de produto inteira. O resto é execução.

## Ensinar o sistema a dizer "não sei"

O segundo problema aparece quando o primeiro está resolvido. Com o escopo apertado, muita pergunta legítima passa a não ter resposta dentro do material — e um modelo de linguagem, deixado por conta própria, **preenche**. É o que ele faz de melhor.

Num produto jurídico, preencher é o comportamento mais caro possível. Uma citação inventada não é um erro de software: é o nome de um advogado embaixo de uma decisão que não existe.

Três coisas ajudaram, nenhuma delas glamourosa:

**Não ter resposta é um resultado, não uma falha.** Se a busca voltar fraca, o caminho não é chamar o modelo assim mesmo — é responder que o material do processo não cobre aquilo, e dizer o que teria que ser anexado para cobrir. Um "não sei" específico é útil; um genérico é só uma desculpa.

**Toda afirmação sai com origem.** Cada frase da resposta aponta para o documento e o trecho de onde veio. Isso serve menos para o usuário confiar e mais para ele **desconfiar rápido** — abrir a origem e ver que não sustenta é questão de segundos, e é o que transforma o texto de conselho em rascunho conferível.

**Sem origem, o trecho não entra.** Se uma frase não consegue apontar de onde saiu, ela é cortada antes de chegar na tela. Resposta menor e verificável ganha de resposta completa e suspeita, sempre.

## O que ainda me incomoda

Uma coisa que resolvi mal e uma que não resolvi.

A que resolvi mal: **a pergunta que atravessa dois casos**. "Já usamos esse argumento em outro processo?" é uma pergunta boa, útil, e o meu sistema responde mal de propósito, porque responder bem exigiria atravessar exatamente a parede que eu levantei. A saída atual é um caminho separado e explícito, que busca só no que é do escritório e nunca no que é do cliente. Funciona, mas é uma pergunta respondida pela metade, e eu sei disso.

A que não resolvi: **saber que a resposta está errada quando ninguém reclama**. Vazamento eu detecto, porque tem exceção. Resposta ruim não levanta exceção nenhuma — ela é lida, é considerada razoável, e vai embora. Hoje eu dependo de alguém avisar. Isso não é medição, é sorte com passos extras.

Se você trabalha com isso e resolveu a segunda de um jeito que não seja "contratar gente para revisar amostra", eu quero muito saber.
`;

export const umChatbotPorProcesso: Post = {
  id: "post-um-chatbot-por-processo",
  title: "Um chatbot por processo",
  slug: "um-chatbot-por-processo",
  content: CONTENT,
  snippet:
    "Por que o assistente não tem um índice só. O erro que passa em todo teste, o motivo de instrução no prompt não ser isolamento, e as duas coisas que eu ainda não resolvi.",
  read_time_minutes: 8,
  cover: "autos",
  published_at: "2026-07-26T12:00:00.000Z",
  featured: true,
  links: [],
  created_at: "2026-07-26T12:00:00.000Z",
  updated_at: "2026-07-26T12:00:00.000Z",
  categories: [{ id: "cat-ia-aplicada", name: "IA aplicada", slug: "ia-aplicada" }],
};
