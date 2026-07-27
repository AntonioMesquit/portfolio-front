"use client";

import Link from "next/link";
import type { Post } from "../../lib/api";

interface PostCardProps {
  post: Post;
  index?: number;
}

/** Data curta em caixa alta: "26 JUL 2026". Cabe na coluna do sumário. */
function shortDate(iso: string | null): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "America/Fortaleza",
  })
    .format(new Date(iso))
    .replace(/\./g, "")
    .toUpperCase();
}

/**
 * Uma entrada do sumário — não um card.
 *
 * Antes era um bloco com canto arredondado, borda âmbar no hover e fundo
 * pintado. Agora é uma linha de índice: número, data, tempo de leitura e
 * título, separados por fio de 1px. É a mesma gramática da tabela de
 * trajetória da home.
 */
export function PostCard({ post, index = 0 }: PostCardProps) {
  return (
    <li className="cd-entry" data-featured={post.featured ? "true" : undefined}>
      <Link className="cd-entry__link" href={`/blog/${post.slug}`}>
        <span className="cd-entry__meta">
          {String(index + 1).padStart(2, "0")}
          {post.featured ? " ●" : ""}
        </span>
        <span className="cd-entry__meta">{shortDate(post.published_at)}</span>
        <span className="cd-entry__meta">{post.read_time_minutes} min</span>
        <span>
          <span className="cd-entry__title">{post.title}</span>
          {post.snippet && <span className="cd-entry__snippet">{post.snippet}</span>}
        </span>
      </Link>
    </li>
  );
}
