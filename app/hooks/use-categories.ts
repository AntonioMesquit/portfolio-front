"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { getCategories, createCategory, type Category } from "../lib/api";
import { queryKeys } from "../lib/query-keys";
import { defaultPost } from "../lib/default-post";

/**
 * Mescla as categorias do post padrão com as vindas da API,
 * incrementando a contagem se a categoria já existir.
 */
function mergeWithDefaultCategories(categories: Category[]): Category[] {
  const result = [...categories];
  for (const dc of defaultPost.categories) {
    const existing = result.find((c) => c.slug === dc.slug);
    if (existing) {
      existing.post_count += 1;
    } else {
      result.push({
        id: dc.id,
        name: dc.name,
        slug: dc.slug,
        created_at: defaultPost.created_at,
        post_count: 1,
      });
    }
  }
  return result;
}

export function useCategories(
  options?: Omit<UseQueryOptions<Category[]>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.categories(),
    queryFn: async () => {
      try {
        const categories = await getCategories();
        return mergeWithDefaultCategories(categories);
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[useCategories] falha ao carregar categorias:", err);
        }
        return mergeWithDefaultCategories([]);
      }
    },
    staleTime: 1000 * 60 * 5,
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
