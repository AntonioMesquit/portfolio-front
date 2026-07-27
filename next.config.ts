import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  /*
    O artigo que documenta o site foi reescrito e trocou de slug: o antigo
    descrevia uma versão que não existe mais. Redirect permanente para não
    quebrar link já compartilhado.
  */
  async redirects() {
    return [
      {
        source: "/blog/como-funciona-o-site-antonio-mesquita",
        destination: "/blog/por-que-este-site-parece-impresso",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
