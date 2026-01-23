import type { Metadata } from "next";

const baseTitle = "Antonio Mesquita";
const baseDescription = "Portfolio de Antonio Mesquita - Desenvolvedor e Criador de Conteúdo";

export const metadataConfig: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Home",
    description: baseDescription,
  },
  "/sobre": {
    title: "Sobre",
    description: `Sobre ${baseTitle} - Conheça mais sobre minha trajetória e experiência`,
  },
  "/projetos": {
    title: "Projetos",
    description: `Projetos de ${baseTitle} - Veja meus trabalhos e criações`,
  },
  "/blog": {
    title: "Blog",
    description: `Blog de ${baseTitle} - Artigos, tutoriais e conteúdo sobre desenvolvimento`,
  },
  "/contato": {
    title: "Contato",
    description: `Entre em contato com ${baseTitle} - Vamos conectar e trabalhar juntos`,
  },
  "/resumo": {
    title: "Resumo",
    description: `Resumo da carreira de ${baseTitle} - Uma jornada pela minha trajetória profissional`,
  },
};

export function generatePageMetadata(pathname: string): Metadata {
  const pageConfig = metadataConfig[pathname] || {
    title: "Página",
    description: baseDescription,
  };

  return {
    title: `${pageConfig.title} | ${baseTitle}`,
    description: pageConfig.description,
    openGraph: {
      title: `${pageConfig.title} | ${baseTitle}`,
      description: pageConfig.description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${pageConfig.title} | ${baseTitle}`,
      description: pageConfig.description,
    },
  };
}
