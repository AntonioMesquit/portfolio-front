import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, absoluteUrl } from "./site";

const baseTitle = SITE_NAME;
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
  "/tonio": {
    title: "Admin",
    description: `Painel administrativo - ${baseTitle}`,
  },
  "/sobre-o-site": {
    title: "Sobre o Site",
    description: `Documentação e estrutura do portfólio de ${baseTitle}`,
  },
};

/**
 * Rotas que existem mas não podem ser indexadas.
 *
 * `/tonio` é o painel de administração. `/contato` e `/resumo` ainda são stubs
 * de `text-white` sobre fundo branco: indexados, entregam ao visitante uma
 * página em branco assinada com o meu nome — e uma página vazia no índice pesa
 * contra o site inteiro, não só contra ela.
 *
 * Ao terminar qualquer uma das duas, basta tirá-la desta lista e de
 * `app/robots.ts`.
 */
const NOINDEX = new Set(["/tonio", "/contato", "/resumo"]);

export function generatePageMetadata(pathname: string): Metadata {
  const pageConfig = metadataConfig[pathname] || {
    title: "Página",
    description: baseDescription,
  };

  const title = `${pageConfig.title} | ${baseTitle}`;
  const noindex = NOINDEX.has(pathname);

  return {
    metadataBase: SITE_URL,
    title,
    description: pageConfig.description,
    /*
      Relativo de propósito: o Next resolve contra `metadataBase`, então o
      canonical acompanha o domínio sem precisar repeti-lo em cada rota.
    */
    alternates: { canonical: pathname },
    robots: noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      title,
      description: pageConfig.description,
      type: "website",
      url: absoluteUrl(pathname),
      siteName: baseTitle,
      locale: "pt_BR",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: pageConfig.description,
    },
  };
}
