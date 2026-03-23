/**
 * Chaves centralizadas para cache do React Query.
 * Permite invalidar queries de forma consistente e evita duplicação de strings.
 */

export const queryKeys = {
  /** Lista de posts com filtros opcionais */
  posts: (params?: { category?: string; search?: string; limit?: number; offset?: number; featured?: boolean }) =>
    ["posts", params] as const,

  /** Post individual por slug ou id */
  post: (idOrSlug: string) => ["posts", "detail", idOrSlug] as const,

  /** Lista de categorias */
  categories: () => ["categories"] as const,

  /** Todas as queries relacionadas a posts (para invalidação em massa) */
  allPosts: () => ["posts"] as const,
} as const;
