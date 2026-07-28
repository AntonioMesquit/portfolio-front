import type { Metadata } from "next";
import { generatePageMetadata } from "../../lib/metadata";
import { SITE_NAME, absoluteUrl } from "../../lib/site";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await fetch(
      `${API_BASE}/posts/${encodeURIComponent(slug)}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return generatePageMetadata("/blog");
    const post = await res.json();
    const title = `${post.title} | Antonio Mesquita`;
    const description =
      post.snippet ?? `Leia ${post.title} no blog de Antonio Mesquita`;

    return {
      title,
      description,
      /*
        Sem canonical próprio o artigo herda o do layout de /blog e todos os
        posts declaram a mesma URL canônica — o Google trata a série inteira
        como cópias de uma página só e indexa uma.
      */
      alternates: { canonical: `/blog/${slug}` },
      openGraph: {
        title,
        description,
        type: "article",
        url: absoluteUrl(`/blog/${slug}`),
        siteName: SITE_NAME,
        locale: "pt_BR",
        publishedTime: post.published_at ?? undefined,
        modifiedTime: post.updated_at ?? undefined,
      },
      twitter: { card: "summary_large_image", title, description },
    };
  } catch {
    return generatePageMetadata("/blog");
  }
}

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
