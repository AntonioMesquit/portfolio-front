import type { Metadata } from "next";
import { generatePageMetadata } from "../../lib/metadata";

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
    return {
      title: `${post.title} | Antonio Mesquita`,
      description: post.snippet ?? `Leia ${post.title} no blog de Antonio Mesquita`,
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
