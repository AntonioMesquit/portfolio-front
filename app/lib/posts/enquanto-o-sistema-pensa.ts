import type { Post } from "../api";

/**
 * O segundo artigo existe por dois motivos.
 *
 * 1. Editorial: a carta faz uma pergunta que ela mesma não responde — "o que o
 *    sistema faz quando a resposta não chega, e o que acontece com quem estava
 *    no meio de uma ação". Este texto responde. Elaborar uma pergunta aberta não
 *    é repetir fato.
 * 2. Estrutural: um sumário com um item só não é sumário. Busca, filtro por
 *    categoria e lista não têm o que fazer com um artigo.
 *
 * Vale aqui a mesma proibição do outro: nada de período, cargo, stack, nome de
 * cliente ou métrica que o site não sustente.
 */
const CONTENT = `> Tudo que eu sabia sobre estado de carregamento estava calibrado para trezentos milissegundos. Depois vieram respostas de trinta segundos.

## Três segundos é outro produto

Existe uma escala publicada por Jakob Nielsen, dos anos 90, que continua valendo: até 0,1 s a pessoa sente que a interface reagiu; até 1 s ela percebe a demora mas não perde o fio; passando de 10 s, ela desiste de esperar e vai fazer outra coisa.

Praticamente toda convenção de front-end que eu tinha aprendido mora na primeira ou na segunda faixa. Botão desabilitado, esqueleto cinza, três bolinhas pulando: tudo isso foi desenhado para uma espera curta, em que a única informação necessária é "recebi o clique".

Resposta de modelo de linguagem mora na terceira faixa. E na terceira faixa, um spinner passa a ser uma mentira — ele afirma que algo está acontecendo sem dizer o quê, quanto falta, nem se ainda vale esperar. Depois de vinte segundos olhando um círculo girar, a pessoa não está esperando: está decidindo se o produto quebrou.

## Streaming não é só parecer mais rápido

Mostrar o texto conforme ele sai resolve o problema óbvio — a primeira palavra chega em menos de um segundo, e a espera vira leitura.

Mas o ganho que eu não tinha previsto é outro: **quem lê enquanto o sistema escreve consegue interromper**. Nas primeiras linhas já dá para ver que a resposta entendeu a pergunta errado. Sem streaming, esse diagnóstico só é possível no fim, depois de pagar a espera inteira e o custo inteiro. Com streaming, é um botão de parar aos dois segundos.

Isso muda o desenho da tela: o botão de parar deixa de ser detalhe de acessibilidade e vira a ação principal durante a resposta. É o único momento em que o usuário tem informação que o sistema não tem.

## O estado que ninguém desenha

Streaming resolve a espera e cria um estado novo, que quase nenhuma interface trata: **a resposta pela metade**.

A conexão cai no meio. A aba fica em segundo plano e o navegador congela o \`fetch\`. A pessoa clica em outro processo antes de terminar. Em todos esses casos existe um texto parcial na tela, e ele é perigoso pelo mesmo motivo do artigo anterior: parece completo. Um parágrafo interrompido no ponto certo é indistinguível de um parágrafo que acabou.

O que resolveu foi parar de tratar o texto como o estado e passar a tratar o estado como o estado:

\`\`\`ts
type Resposta =
  | { fase: "pensando" }
  | { fase: "escrevendo"; texto: string }
  | { fase: "pronta"; texto: string; origens: Origem[] }
  | { fase: "interrompida"; texto: string; motivo: "usuario" | "conexao" };
\`\`\`

Quatro fases explícitas, e o texto nunca aparece sozinho. \`interrompida\` desenha uma marca de corte no fim do parágrafo e a razão do corte — o mesmo texto, com a moldura certa, para de mentir. E \`pronta\` é a única fase que carrega as origens, o que torna impossível exibir uma resposta parcial como se fosse conferível.

Antes disso eu tinha um \`texto\` e um \`carregando\`, e todo estado que não fosse esses dois era representado por uma combinação acidental dos dois. É a diferença entre um estado que você desenhou e um que você deixou acontecer.

## O clique repetido

Falta o caso mais banal e o mais caro: a pessoa acha que travou e clica de novo.

Ela está certa em clicar. A interface não deu sinal suficiente, então a culpa é da interface. O que não pode é o segundo clique virar uma segunda execução — duas respostas concorrentes escrevendo na mesma tela, duas cobranças, e a possibilidade de a resposta antiga chegar depois da nova e sobrescrevê-la.

Chave de idempotência gerada no cliente resolve o servidor: o mesmo pedido volta o mesmo resultado em vez de rodar de novo. Mas o problema de tela sobra, e para esse a regra é mais simples do que parece: **a resposta que chega para um pedido que não é mais o atual é descartada, não exibida.** Toda resposta carrega o id do pedido, e a tela só aceita o do pedido que ela está esperando agora.

## O que eu faria diferente

Eu tratei tudo isso como problema de front-end, e não é. É modelagem de estado que por acaso aparece na tela.

Passei tempo demais escolhendo como desenhar a espera — animação, texto, marca de progresso — antes de ter escrito quais eram os estados possíveis. A pergunta "o que exatamente é verdade agora" resolveu mais do que qualquer decisão visual, e teria custado uma tarde se eu tivesse feito primeiro.
`;

export const enquantoOSistemaPensa: Post = {
  id: "post-enquanto-o-sistema-pensa",
  title: "Enquanto o sistema pensa",
  slug: "enquanto-o-sistema-pensa",
  content: CONTENT,
  snippet:
    "Streaming, resposta pela metade e o clique repetido. O que muda no produto quando a espera deixa de ser de trezentos milissegundos e passa a ser de trinta segundos.",
  read_time_minutes: 6,
  cover: null,
  published_at: "2026-07-20T12:00:00.000Z",
  featured: false,
  links: [],
  created_at: "2026-07-20T12:00:00.000Z",
  updated_at: "2026-07-20T12:00:00.000Z",
  categories: [{ id: "cat-produto", name: "Produto", slug: "produto" }],
};
