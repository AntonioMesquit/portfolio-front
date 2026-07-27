"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { getCategories, createCategory, type Category } from "../lib/api";
import { queryKeys } from "../lib/query-keys";
import { localPosts } from "../lib/posts";

/**
 * Mescla as categorias dos artigos locais com as vindas da API, incrementando
 * a contagem quando a categoria já existe dos dois lados.
 */
function mergeWithLocalCategories(categories: Category[]): Category[] {
  // Imutável de propósito: `[...categories]` é cópia rasa, então incrementar
  // `existing.post_count` mutava o objeto que vive no cache do React Query.
  const result = categories.map((category) => ({ ...category }));

  for (const post of localPosts) {
    for (const pc of post.categories) {
      const existing = result.find((c) => c.slug === pc.slug);
      if (existing) {
        existing.post_count += 1;
      } else {
        result.push({
          id: pc.id,
          name: pc.name,
          slug: pc.slug,
          created_at: post.created_at,
          post_count: 1,
        });
      }
    }
  }
  return result;
}

/** Fonte única das opções, para que prefetch e hook nunca divirjam. */
export function categoriesQueryOptions() {
  return {
    queryKey: queryKeys.categories(),
    queryFn: async () => {
      try {
        const categories = await getCategories();
        return mergeWithLocalCategories(categories);
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[useCategories] falha ao carregar categorias:", err);
        }
        return mergeWithLocalCategories([]);
      }
    },
    /* Mesmo motivo do use-posts: a tira de categorias já sabe o que os artigos
       locais têm, e não precisa esperar a rede para desenhar isso. */
    placeholderData: () => mergeWithLocalCategories([]),
    staleTime: 1000 * 60 * 5,
  };
}

export function useCategories(
  options?: Omit<UseQueryOptions<Category[]>, "queryKey" | "queryFn">
) {
  return useQuery({
    ...categoriesQueryOptions(),
    ...options,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories() });
      queryClient.invalidateQueries({ queryKey: queryKeys.allPosts() });
    },
  });
}
