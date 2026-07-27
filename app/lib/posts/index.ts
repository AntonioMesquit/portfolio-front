import type { Post } from "../api";
import type { PostsParams } from "../../hooks/use-posts";
import { umChatbotPorProcesso } from "./um-chatbot-por-processo";
import { enquantoOSistemaPensa } from "./enquanto-o-sistema-pensa";

/**
 * Artigos que moram no repositório, não na API.
 *
 * Antes isto era UM post ("defaultPost") tratado como caso especial em três
 * lugares. Virou lista porque o caderno precisa de mais de um texto para que
 * busca, filtro e sumário tenham o que fazer — e porque um caso especial que
 * ocorre duas vezes deixa de ser especial.
 *
 * Ordem: a mais recente primeiro. É esta ordem que a página respeita, então
 * ela é a única fonte de verdade sobre a sequência.
 */
export const localPosts: Post[] = [umChatbotPorProcesso, enquantoOSistemaPensa];

const localSlugs = new Set(localPosts.map((p) => p.slug));
const localIds = new Set(localPosts.map((p) => p.id));

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

/**
 * A busca olha título e resumo, não o corpo.
 *
 * Varrer o texto inteiro fazia termo genérico ("site", "página") casar sempre,
 * e todo artigo local aparecia como falso positivo em quase toda busca.
 */
function matchesParams(post: Post, params?: PostsParams): boolean {
  if (!params) return true;

  if (params.featured && !post.featured) return false;

  if (params.category) {
    if (!post.categories.some((c) => c.slug === params.category)) return false;
  }

  if (params.search) {
    const term = normalize(params.search.trim());
    if (term) {
      const haystack = normalize([post.title, post.snippet ?? ""].join(" "));
      if (!haystack.includes(term)) return false;
    }
  }

  return true;
}

/** Mescla os artigos locais aos da API, sem duplicar por slug nem por id. */
export function mergeWithLocalPosts(posts: Post[], params?: PostsParams): Post[] {
  const fromApi = Array.isArray(posts) ? posts : [];
  const locais = localPosts.filter((p) => matchesParams(p, params));

  const resto = fromApi.filter(
    (p) => !localSlugs.has(p.slug) && !localIds.has(p.id)
  );
  return [...locais, ...resto];
}

export function findLocalPost(slug: string): Post | undefined {
  return localPosts.find((p) => p.slug === slug);
}

/**
 * Vizinhos na ordem do caderno, para a navegação no rodapé do artigo.
 * `anterior` é o publicado antes; `proximo`, o publicado depois.
 */
export function localNeighbors(slug: string): {
  anterior: Post | null;
  proximo: Post | null;
} {
  const i = localPosts.findIndex((p) => p.slug === slug);
  if (i === -1) return { anterior: null, proximo: null };
  return {
    proximo: i > 0 ? localPosts[i - 1] : null,
    anterior: i < localPosts.length - 1 ? localPosts[i + 1] : null,
  };
}
