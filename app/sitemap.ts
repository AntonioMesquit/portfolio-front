import type { MetadataRoute } from "next";
import { absoluteUrl } from "./lib/site";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

/**
 * Não é a lista de rotas — é a lista do que vale ser encontrado.
 *
 * `/contato` e `/resumo` ficam de fora enquanto forem stubs, e `/tonio` fica de
 * fora por ser o painel. Sitemap é recomendação, não inventário: listar página
 * vazia é pedir para o Google indexar página vazia.
 */
const PUBLIC_ROUTES: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/sobre", changeFrequency: "monthly", priority: 0.8 },
  { path: "/projetos", changeFrequency: "monthly", priority: 0.8 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.9 },
  { path: "/sobre-o-site", changeFrequency: "monthly", priority: 0.5 },
];

type PostStub = { slug: string; updated_at?: string; published_at?: string | null };

/**
 * Uma hora. Artigo novo entra no sitemap sem exigir deploy, e o build não
 * carrega o custo de uma chamada de API que pode estar fora do ar na hora
 * errada.
 */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = PUBLIC_ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  /*
    API fora do ar não pode derrubar o sitemap inteiro: sem o try, um 500 do
    backend apaga também as cinco páginas estáticas, que não dependem dele para
    nada.
  */
  try {
    const res = await fetch(`${API_BASE}/posts`, { next: { revalidate } });
    if (res.ok) {
      const posts: PostStub[] = await res.json();
      for (const post of posts) {
        if (!post.slug) continue;
        entries.push({
          url: absoluteUrl(`/blog/${post.slug}`),
          lastModified: new Date(post.updated_at ?? post.published_at ?? Date.now()),
          changeFrequency: "monthly",
          priority: 0.7,
        });
      }
    }
  } catch {
    // Sitemap sem os artigos ainda é um sitemap válido.
  }

  return entries;
}
