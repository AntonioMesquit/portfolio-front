import type { Project } from "./types";

/**
 * Posições são o CENTRO do nó, em porcentagem da área de desenho (0-100).
 *
 * Cada projeto tem uma silhueta própria de propósito — espinha vertical, leque,
 * pipeline horizontal, gravata-borboleta — para que os três nós compartilhados
 * (client, api, db) percorram uma distância visível a cada troca. Sem isso o Flip
 * anima, mas ninguém percebe.
 *
 * Cores são tons -600: um traço de 1px em tom -500 desaparece sobre papel claro.
 * `colorText` é a variante -800, porque o -600 reprova contraste AA como texto.
 *
 * INVARIANTE de posição, para qualquer par de nós do mesmo projeto:
 *   Δx >= 34  ou  Δy >= 17
 * e, se o par tiver aresta, Δx >= 43 ou Δy >= 22 — abaixo disso não sobra vão
 * para o traço (2*GAP + MIN_SPAN = 16px) e a linha não é desenhada.
 */
export const projectsData: Project[] = [
  {
    id: "piesse",
    name: "Piesse",
    tagline: "Gestão jurídica com assistente inteligente",
    description:
      "Plataforma que cobre o processo jurídico de ponta a ponta: geração de contratos, consulta de jurisprudência e chatbots especializados por processo. Começou como SaaS e cresceu até virar um assistente jurídico completo, dimensionado para atender do escritório pequeno à corporação.",
    year: "2025",
    technologies: [
      "Next.js",
      "TypeScript",
      "React",
      "NestJS",
      "PostgreSQL",
      "Prisma",
      "OpenAI API",
      "Tailwind CSS",
      "Docker",
      "AWS",
    ],
    color: "#4f46e5",
    colorText: "#4338ca",
    blueprint: {
      // Espinha vertical à esquerda, com a inteligência ramificando à direita.
      nodes: [
        { role: "client", label: "Frontend", tech: "Next.js", x: 26, y: 12 },
        { role: "api", label: "API Gateway", tech: "NestJS", x: 26, y: 44 },
        { role: "db", label: "Database", tech: "PostgreSQL", x: 26, y: 80 },
        { role: "ai", label: "AI Service", tech: "OpenAI", x: 70, y: 26 },
        { role: "chatbot", label: "Chatbot", tech: "Custom AI", x: 70, y: 64 },
      ],
      edges: [
        { from: "client", to: "api" },
        { from: "api", to: "db" },
        { from: "api", to: "ai" },
        { from: "ai", to: "chatbot" },
        { from: "api", to: "chatbot" },
      ],
    },
  },
  {
    id: "frevo",
    name: "Frevo",
    tagline: "Gestão de eventos e festivais",
    description:
      "Da criação e venda de ingressos ao controle de acesso em tempo real. Integra pagamento, gestão de lotes e relatórios detalhados, para eventos de qualquer porte.",
    year: "2024",
    technologies: [
      "React",
      "TypeScript",
      "Node.js",
      "Express",
      "MongoDB",
      "Stripe API",
      "Socket.io",
      "Material-UI",
      "Redis",
      "Vercel",
    ],
    color: "#db2777",
    colorText: "#9d174d",
    blueprint: {
      // Leque: um hub central com os serviços abertos na linha de baixo.
      nodes: [
        { role: "client", label: "Web App", tech: "React", x: 50, y: 8 },
        { role: "api", label: "Backend API", tech: "Express", x: 50, y: 42 },
        { role: "db", label: "Database", tech: "MongoDB", x: 94, y: 42 },
        { role: "payment", label: "Payment", tech: "Stripe", x: 6, y: 80 },
        { role: "realtime", label: "Real-time", tech: "Socket.io", x: 50, y: 80 },
        { role: "cache", label: "Cache", tech: "Redis", x: 94, y: 80 },
      ],
      edges: [
        { from: "client", to: "api" },
        { from: "api", to: "db" },
        { from: "api", to: "payment" },
        { from: "api", to: "realtime" },
        { from: "api", to: "cache" },
        { from: "db", to: "cache" },
      ],
    },
  },
  {
    id: "egle",
    name: "Egle",
    tagline: "E-learning com gamificação",
    description:
      "Cursos estruturados, avaliação automatizada, certificados digitais e um sistema de conquistas. O dashboard analítico deixa o instrutor acompanhar o progresso de cada aluno em tempo real.",
    year: "2024",
    technologies: [
      "Vue.js",
      "TypeScript",
      "Python",
      "FastAPI",
      "PostgreSQL",
      "Django",
      "AWS S3",
      "WebRTC",
      "Chart.js",
      "Tailwind CSS",
    ],
    color: "#059669",
    colorText: "#065f46",
    blueprint: {
      // Pipeline da esquerda para a direita, com mídia acima e conteúdo abaixo.
      nodes: [
        { role: "video", label: "Video", tech: "WebRTC", x: 6, y: 14 },
        { role: "client", label: "Frontend", tech: "Vue.js", x: 6, y: 52 },
        { role: "api", label: "API", tech: "FastAPI", x: 50, y: 66 },
        { role: "db", label: "Database", tech: "PostgreSQL", x: 94, y: 20 },
        { role: "storage", label: "Storage", tech: "AWS S3", x: 94, y: 92 },
        { role: "cms", label: "CMS", tech: "Django", x: 50, y: 96 },
      ],
      edges: [
        { from: "client", to: "api" },
        { from: "api", to: "db" },
        { from: "api", to: "video" },
        { from: "api", to: "cms" },
        { from: "api", to: "storage" },
        { from: "cms", to: "storage" },
      ],
    },
  },
  {
    id: "1001tem",
    name: "1001Tem",
    tagline: "Marketplace de serviços com matching",
    description:
      "Conecta prestadores e clientes por um algoritmo que pondera localização, avaliação e histórico. Pagamento integrado, chat em tempo real e reputação pública, na web e no mobile.",
    year: "2025",
    technologies: [
      "Next.js",
      "TypeScript",
      "React Native",
      "GraphQL",
      "Apollo",
      "PostgreSQL",
      "Prisma",
      "Firebase",
      "Maps API",
      "Stripe",
    ],
    color: "#d97706",
    colorText: "#92400e",
    blueprint: {
      // Gravata-borboleta: dois clientes convergem no GraphQL e ele abre em quatro serviços.
      nodes: [
        { role: "client", label: "Web App", tech: "Next.js", x: 6, y: 18 },
        { role: "mobile", label: "Mobile", tech: "React Native", x: 6, y: 72 },
        { role: "api", label: "GraphQL API", tech: "Apollo", x: 50, y: 45 },
        { role: "db", label: "Database", tech: "PostgreSQL", x: 94, y: 6 },
        { role: "auth", label: "Auth", tech: "Firebase", x: 94, y: 32 },
        { role: "payment", label: "Payment", tech: "Stripe", x: 94, y: 58 },
        { role: "maps", label: "Maps", tech: "Google Maps", x: 94, y: 94 },
      ],
      edges: [
        { from: "client", to: "api" },
        { from: "mobile", to: "api" },
        { from: "api", to: "db" },
        { from: "api", to: "auth" },
        { from: "api", to: "payment" },
        { from: "api", to: "maps" },
      ],
    },
  },
];
