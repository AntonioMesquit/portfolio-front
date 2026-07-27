/**
 * Só a trajetória mora aqui. Os quatro produtos são lidos de `projectsData`, e
 * o número da folha vem do mesmo `padStart(2, "0")` que o cartucho da prancha
 * usa — nenhuma string redigitada, nenhum risco de as duas páginas divergirem.
 *
 * REGRA EDITORIAL: nenhum intervalo de tempo aparece aqui que não seja lido de
 * duas datas impressas na própria página. Por isso não existe "4 anos", não
 * existe duração calculada, e o período do curso é só "2022" — o material não
 * registra mês, e a página não finge que registra.
 */
export interface TrajectoryRow {
  period: string;
  where: string;
  role: string;
  what: string;
  /** Marca a linha atual; recebe o único fio de acento da seção. */
  current?: boolean;
}

export const trajectory: TrajectoryRow[] = [
  {
    period: "2022",
    where: "FB Uni Central",
    role: "Ciência da Computação",
    what: "Entrei aos 17. Descobri programação web no começo do curso e não larguei mais.",
  },
  {
    period: "Jun/2024 – Jan/2025",
    where: "Grupo Açailândia",
    role: "Back-end júnior",
    what: "API em ElysiaJS e NestJS, com teste automatizado. Escrevi o guia de boas práticas que o time passou a seguir.",
  },
  {
    period: "Jan/2025 – Out/2025",
    where: "Empresa Infinity",
    role: "Full stack júnior",
    what: "SaaS para web e mobile: Next.js, TypeScript, React Native, Vue.js, NestJS e Cloudflare.",
  },
  {
    period: "Desde 2025",
    where: "Startup jurídica",
    role: "CTO",
    what: "Contratos, jurisprudência e um chatbot por processo. Começou como SaaS e virou plataforma.",
    current: true,
  },
];

export const CONTACT = {
  email: "antonio109mesquita@gmail.com",
  linkedinHandle: "linkedin.com/in/antonio-mesquita-467752287",
  linkedinUrl: "https://www.linkedin.com/in/antonio-mesquita-467752287/",
  place: "Ceará, Brasil",
} as const;
