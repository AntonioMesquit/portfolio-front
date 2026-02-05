import { Project } from "./project-card";

export const projectsData: Project[] = [
  {
    id: "piesse",
    name: "Piesse",
    description:
      "Plataforma completa de gestão jurídica com assistente inteligente e automação de processos.",
    longDescription:
      "Piesse é uma plataforma jurídica completa que revoluciona a gestão de processos legais. A plataforma oferece desde a criação automatizada de contratos até jurisprudência inteligente e chatbots especializados. O sistema foi desenvolvido para escalar e atender desde pequenas empresas até grandes corporações, oferecendo uma experiência completa de assistente jurídico.",
    preview: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1400&h=800&fit=crop",
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
    workflow: {
      nodes: [
        {
          id: "1",
          type: "custom",
          position: { x: 100, y: 100 },
          data: { label: "Frontend", tech: "Next.js + React" },
        },
        {
          id: "2",
          type: "custom",
          position: { x: 400, y: 100 },
          data: { label: "API Gateway", tech: "NestJS" },
        },
        {
          id: "3",
          type: "custom",
          position: { x: 700, y: 100 },
          data: { label: "Database", tech: "PostgreSQL" },
        },
        {
          id: "4",
          type: "custom",
          position: { x: 150, y: 300 },
          data: { label: "AI Service", tech: "OpenAI" },
        },
        {
          id: "5",
          type: "custom",
          position: { x: 550, y: 300 },
          data: { label: "Chatbot", tech: "Custom AI" },
        },
      ],
      edges: [
        { id: "e1-2", source: "1", target: "2" },
        { id: "e2-3", source: "2", target: "3" },
        { id: "e2-4", source: "2", target: "4" },
        { id: "e4-5", source: "4", target: "5" },
        { id: "e2-5", source: "2", target: "5" },
      ],
    },
    color: "#6366f1",
    gradient:
      "linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))",
  },
  {
    id: "frevo",
    name: "Frevo",
    description:
      "Sistema de gestão de eventos e festivais com integração de pagamentos e controle de acesso.",
    longDescription:
      "Frevo é uma plataforma completa para gestão de eventos e festivais culturais. O sistema permite desde a criação e venda de ingressos até o controle de acesso em tempo real. Com integração de pagamentos, gestão de lote e relatórios detalhados, Frevo facilita a organização de eventos de qualquer porte.",
    preview: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1400&h=800&fit=crop",
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
    workflow: {
      nodes: [
        {
          id: "1",
          type: "custom",
          position: { x: 100, y: 100 },
          data: { label: "Web App", tech: "React + TypeScript" },
        },
        {
          id: "2",
          type: "custom",
          position: { x: 400, y: 100 },
          data: { label: "Backend API", tech: "Node.js + Express" },
        },
        {
          id: "3",
          type: "custom",
          position: { x: 700, y: 100 },
          data: { label: "Database", tech: "MongoDB" },
        },
        {
          id: "4",
          type: "custom",
          position: { x: 250, y: 300 },
          data: { label: "Payment", tech: "Stripe" },
        },
        {
          id: "5",
          type: "custom",
          position: { x: 550, y: 300 },
          data: { label: "Real-time", tech: "Socket.io" },
        },
        {
          id: "6",
          type: "custom",
          position: { x: 400, y: 500 },
          data: { label: "Cache", tech: "Redis" },
        },
      ],
      edges: [
        { id: "e1-2", source: "1", target: "2" },
        { id: "e2-3", source: "2", target: "3" },
        { id: "e2-4", source: "2", target: "4" },
        { id: "e2-5", source: "2", target: "5" },
        { id: "e2-6", source: "2", target: "6" },
        { id: "e3-6", source: "3", target: "6" },
      ],
    },
    color: "#ec4899",
    gradient:
      "linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(219, 39, 119, 0.1))",
  },
  {
    id: "egle",
    name: "Egle",
    description:
      "Plataforma de e-learning com gamificação, certificados e sistema de avaliação avançado.",
    longDescription:
      "Egle é uma plataforma moderna de educação online que combina aprendizado interativo com gamificação. O sistema oferece cursos estruturados, avaliações automatizadas, certificados digitais e um sistema de conquistas que motiva os alunos. Com dashboard analítico completo, os instrutores podem acompanhar o progresso dos alunos em tempo real.",
    preview: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1400&h=800&fit=crop",
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
    workflow: {
      nodes: [
        {
          id: "1",
          type: "custom",
          position: { x: 100, y: 100 },
          data: { label: "Frontend", tech: "Vue.js" },
        },
        {
          id: "2",
          type: "custom",
          position: { x: 400, y: 100 },
          data: { label: "API", tech: "FastAPI" },
        },
        {
          id: "3",
          type: "custom",
          position: { x: 700, y: 100 },
          data: { label: "Database", tech: "PostgreSQL" },
        },
        {
          id: "4",
          type: "custom",
          position: { x: 250, y: 300 },
          data: { label: "CMS", tech: "Django" },
        },
        {
          id: "5",
          type: "custom",
          position: { x: 550, y: 300 },
          data: { label: "Storage", tech: "AWS S3" },
        },
        {
          id: "6",
          type: "custom",
          position: { x: 400, y: 500 },
          data: { label: "Video", tech: "WebRTC" },
        },
      ],
      edges: [
        { id: "e1-2", source: "1", target: "2" },
        { id: "e2-3", source: "2", target: "3" },
        { id: "e2-4", source: "2", target: "4" },
        { id: "e2-5", source: "2", target: "5" },
        { id: "e2-6", source: "2", target: "6" },
        { id: "e4-5", source: "4", target: "5" },
      ],
    },
    color: "#10b981",
    gradient:
      "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))",
  },
  {
    id: "1001tem",
    name: "1001Tem",
    description:
      "Marketplace de serviços com sistema de matching inteligente e avaliações em tempo real.",
    longDescription:
      "1001Tem é um marketplace inovador que conecta prestadores de serviços com clientes de forma inteligente. O sistema utiliza algoritmos de matching para sugerir os melhores profissionais baseado em localização, avaliações e histórico. Com sistema de pagamento integrado, chat em tempo real e sistema de avaliações, 1001Tem facilita a contratação de serviços de qualquer tipo.",
    preview: "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=1400&h=800&fit=crop",
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
    workflow: {
      nodes: [
        {
          id: "1",
          type: "custom",
          position: { x: 100, y: 100 },
          data: { label: "Web App", tech: "Next.js" },
        },
        {
          id: "2",
          type: "custom",
          position: { x: 100, y: 300 },
          data: { label: "Mobile", tech: "React Native" },
        },
        {
          id: "3",
          type: "custom",
          position: { x: 400, y: 200 },
          data: { label: "GraphQL API", tech: "Apollo Server" },
        },
        {
          id: "4",
          type: "custom",
          position: { x: 700, y: 200 },
          data: { label: "Database", tech: "PostgreSQL" },
        },
        {
          id: "5",
          type: "custom",
          position: { x: 400, y: 400 },
          data: { label: "Auth", tech: "Firebase" },
        },
        {
          id: "6",
          type: "custom",
          position: { x: 700, y: 400 },
          data: { label: "Payment", tech: "Stripe" },
        },
        {
          id: "7",
          type: "custom",
          position: { x: 550, y: 100 },
          data: { label: "Maps", tech: "Google Maps" },
        },
      ],
      edges: [
        { id: "e1-3", source: "1", target: "3" },
        { id: "e2-3", source: "2", target: "3" },
        { id: "e3-4", source: "3", target: "4" },
        { id: "e3-5", source: "3", target: "5" },
        { id: "e3-6", source: "3", target: "6" },
        { id: "e3-7", source: "3", target: "7" },
      ],
    },
    color: "#f59e0b",
    gradient:
      "linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.1))",
  },
];
