/**
 * A CARTA — o texto de /sobre.
 *
 * ===========================================================================
 * FRONTEIRA COM A HOME. Nenhum fato aparece duas vezes no site.
 *
 * A home já imprime a trajetória em TABELA (app/components/edition/
 * edition-data.ts) e a linha fina da capa (edition/lede.tsx). Esta carta é a
 * outra metade: o que uma tabela é estruturalmente incapaz de dizer.
 *
 * PROIBIDO AQUI, nominalmente — se você for editar este arquivo, respeite:
 *   · qualquer período, empregador, cargo ou stack (estão na tabela);
 *   · "escrevi o guia", "começou como SaaS e virou plataforma",
 *     "contratos, jurisprudência e um chatbot por processo";
 *   · de lede.tsx: "calouro", "sem rumo", "aprendi o ofício trabalhando",
 *     "ofício", "cuido da parte técnica", "freela e parceria",
 *     "Desenvolvedor no Ceará", "CTO", "17";
 *   · duração calculada de qualquer espécie ("quatro anos", "dez meses").
 *     A única cifra permitida é a idade, e ela mora numa constante abaixo;
 *   · métrica inventada: porcentagem, tamanho de time, número de usuários;
 *   · aforismo de LinkedIn. Teste: se a frase entra num carrossel sem trocar
 *     uma vírgula, ela sai.
 * ===========================================================================
 */

/** Uma carta é datada quando se escreve, não quando se lê. Constante fixa. */
export const WRITTEN_ON = "26 de julho de 2026";

/** Fato do material, não duração calculada. Revisar quando fizer aniversário. */
export const AGE = 21;

export interface Movement {
  id: string;
  /** Canhoto: vive fora da coluna de leitura. É heading de verdade. */
  stub: string;
  gloss: string;
  paragraphs: string[];
  /** Qual desenho fecha o movimento, se algum. */
  ink?: "01" | "02" | "03";
}

export const OPENING = {
  vocative: "Para quem veio da tabela,",
  paragraph:
    "Se você chegou pela home, já viu a tabela: quatro linhas, quatro períodos e uma coluna chamada “o que fiz”. Está tudo certo lá, e é curto de propósito. O que vem agora é a outra metade — o que eu não sabia, o que mudou e o que eu ainda faço mal. Nenhuma linha se repete aqui; se repetisse, uma das duas páginas estaria sobrando.",
} as const;

export const MOVEMENTS: Movement[] = [
  {
    id: "retorno",
    stub: "O retorno imediato",
    gloss: "por que a web fixou",
    paragraphs: [
      "A web tem uma propriedade que eu não encontrei em mais nada que tinha estudado: você escreve, salva, e está na tela. O retorno é imediato e não negocia. Ou aparece, ou não aparece — e quando não aparece, o problema é seu e de mais ninguém. Foi isso que me prendeu, antes de eu ter qualquer ideia de que aquilo fosse uma profissão.",
      "Comecei fazendo coisa feia que funcionava. Continuo achando que é a ordem certa: primeiro funcionar, depois ficar legível, depois ficar defensável. Quem inverte entrega bonito e quebra na segunda semana, e aí não tem nem o bonito nem o que funciona.",
      "A faculdade não me ensinou a programar, e eu não acho que essa seja a função dela. Ela me deu base e me deu tempo: um período em que ficar tentando era o meu trabalho e ninguém cobrava resultado. Só entendi quanto isso vale depois que passou a ter prazo.",
    ],
    ink: "01",
  },
  {
    id: "leitor",
    stub: "O segundo leitor",
    gloss: "quando o código deixa de ser seu",
    paragraphs: [
      "O primeiro emprego muda uma coisa só, e essa uma muda todo o resto: o código para de ser seu.",
      "Enquanto você estuda, o único leitor é você amanhã de manhã. Num time, o leitor é alguém que não estava lá quando você decidiu, não tem o seu contexto e vai precisar mexer nisso com pressa. Escrever para essa pessoa é uma habilidade separada de programar, e não é ensinada em lugar nenhum.",
      "Foi aí que eu entendi para que serve teste automatizado. Não é para provar que o código funciona — para isso basta rodar e olhar. É para você poder mexer numa coisa que já funciona sem sentir medo. Teste é permissão para mudar de ideia depois.",
      "E foi aí que eu aprendi a coisa mais ingrata que eu sei fazer: transformar em texto uma decisão que antes era só minha. Todo texto desses precisa de um motivo escrito do lado. Sem o motivo, vira burocracia em duas semanas, e burocracia é pior do que nada, porque a pessoa cumpre sem entender e o erro passa igual. Você também tem que aceitar que uma parte do que escreveu está errada, e que a assinatura embaixo é a sua.",
    ],
    ink: "02",
  },
  {
    id: "ferramenta",
    stub: "A ferramenta",
    gloss: "e o pouco que sobra dela",
    paragraphs: [
      "Houve um período em que a ferramenta mudava mais rápido do que eu conseguia me apegar a ela. Isso ensina uma coisa que ficar parado numa só não ensina: quase nada do que a gente chama de conhecimento é sobre a ferramenta.",
      "Framework é sintaxe, e sintaxe se lê. O que se repete em todo projeto é sempre o mesmo punhado de perguntas: onde mora o estado, quem é dono do dado, o que o sistema faz quando a resposta não chega, e o que acontece com quem estava no meio de uma ação quando isso aconteceu.",
      "Aprendi a ler documentação como quem procura uma coisa específica, e não como quem estuda para prova. E aprendi que “dá para fazer” e “dá para manter” são perguntas diferentes — a segunda é a única que importa quando a mudança pequena chega depois, e ela sempre chega depois.",
      "Também aprendi o preço. Quando você entrega rápido por muito tempo seguido, começa a confundir velocidade com competência. Velocidade é uma dívida que alguém paga depois — às vezes você mesmo, sem lembrar por que fez daquele jeito.",
    ],
  },
  {
    id: "decisao",
    stub: "A decisão",
    gloss: "e o preço de dizer não",
    paragraphs: [
      "O que eu faço hoje soa maior do que é. Não tem departamento, não tem organograma, não tem ninguém entre mim e o problema. Na prática significa uma coisa só: quando uma decisão técnica está errada, a culpa tem endereço, e o endereço é o meu.",
      "A parte difícil não foi técnica. Foi descobrir que o que mais travou o que eu toco não era decisão de engenharia — era decisão de produto que ninguém quis tomar. Pergunta do tipo “o que o sistema faz quando o caso não se encaixa em nenhuma regra” não se resolve escolhendo banco de dados. Ela fica parada até alguém assumir, e quem assume normalmente é quem estava do lado.",
      "E tem a parte de dizer não. Eu sempre fui muito melhor em dizer “dá para fazer” do que em dizer “dá, custa isto, e por isso eu acho que não deveríamos”. A primeira frase é fácil e agrada na hora. A segunda exige número, exige estar disposto a errar na frente de todo mundo, e exige aguentar o silêncio de dois segundos depois. Ainda estou aprendendo a segunda. É o que mais mudou o meu trabalho no último ano, e não tem uma linha de código dentro.",
    ],
  },
  {
    id: "falta",
    stub: "O que falta",
    gloss: "a lista que ninguém escreve",
    paragraphs: [
      `Escrevo isto aos ${AGE}, o que é pouco tempo para ter certeza de qualquer coisa. Trato as minhas opiniões como provisórias e reviso esta carta quando alguma delas cai.`,
      "O que eu sei fazer hoje, com alguma confiança: levar um produto do banco de dados até a tela sem depender de ninguém para as partes do meio; decidir sozinho quando precisa ser rápido; reconhecer quando a decisão é grande demais para ser só minha; e escrever o que eu decidi de um jeito que a próxima pessoa entenda sem precisar me achar.",
      "O que eu ainda faço mal: estimar. Continuo achando que as coisas levam menos tempo do que levam, e já entendi que isso não se conserta com experiência — conserta escrevendo o que deu errado da última vez, e eu ainda não faço isso com disciplina. Coordenar gente é o outro: tenho pouco treino, e prefiro dizer isso agora do que você descobrir comigo depois.",
      "Desconfio de mim toda vez que a palavra “escala” sai da minha boca. É barato projetar para um número de usuários que ainda não existe, e caro descobrir que você projetou para o número errado.",
      "A lista do que a pessoa não sabe é a parte mais útil de um currículo. É também a única que ninguém escreve.",
    ],
    ink: "03",
  },
];

export const CLOSING = {
  paragraph:
    "É isso. Se você leu até aqui, já sabe mais sobre como eu trabalho do que costuma caber numa conversa de uma hora.",
  farewell: "Um abraço,",
  signature: "Antonio Mesquita · Ceará, Brasil",
} as const;

export const CAPTIONS: Record<"01" | "02" | "03", string> = {
  "01": "Desenho 1 — Antes de alguém depender do que eu escrevia.",
  "02": "Desenho 2 — A mesma mesa, com uma cadeira a mais.",
  "03": "Desenho 3 — Hoje. É o desenho com menos traço dos três.",
};

export const ALT_TEXTS: Record<"01" | "02" | "03", string> = {
  "01": "Desenho a nanquim: um rapaz de suéter de tranca, visto de costas, debruçado sobre um notebook aberto numa mesa vazia.",
  "02": "Desenho a nanquim: o mesmo rapaz do outro lado de uma mesa, de frente, com uma folha na mão; em primeiro plano, o encosto de uma cadeira vazia.",
  "03": "Desenho a nanquim: o mesmo rapaz diante de um notebook, sentado ereto, numa mesa sem mais nada.",
};
