"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import {
  getPosts,
  getPost,
  createPost,
  type Post,
} from "../lib/api";
import { queryKeys } from "../lib/query-keys";
import { findLocalPost, mergeWithLocalPosts } from "../lib/posts";

export type PostsParams = {
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
  featured?: boolean;
};

/**
 * Fonte única das opções desta query.
 *
 * Existe para que o prefetch e o hook usem exatamente a mesma `queryFn`. Semear
 * a chave por fora, com dados que não passaram pelo `mergeWithLocalPosts`,
 * produz um cache fresco e errado: a `queryFn` nunca roda e os artigos locais
 * somem.
 */
export function postsQueryOptions(params?: PostsParams) {
  return {
    queryKey: queryKeys.posts(params),
    queryFn: async () => {
      try {
        const posts = await getPosts(params);
        return mergeWithLocalPosts(posts, params);
      } catch (err) {
        // Os artigos locais aparecem mesmo com a API fora do ar.
        if (process.env.NODE_ENV !== "production") {
          console.warn("[usePosts] falha ao carregar posts da API:", err);
        }
        return mergeWithLocalPosts([], params);
      }
    },
    /*
      Resultado local IMEDIATO enquanto a rede não responde.

      Cada termo digitado é uma queryKey nova, e o sumário esperava o fetch
      terminar para mostrar qualquer coisa — com a API fora do ar isso é o
      timeout de conexão inteiro, medido em ~4s por tecla. `keepPreviousData`
      resolvia o piscar mostrando a lista ERRADA nesse intervalo.
      Os artigos que moram no repositório não dependem de rede: filtrá-los é
      síncrono. Então o estado inicial de toda busca já é a resposta certa para
      a parte local, e a rede só acrescenta.
    */
    placeholderData: () => mergeWithLocalPosts([], params),
    staleTime: 1000 * 60 * 5, // 5 minutos
  };
}

export function usePosts(
  params?: PostsParams,
  options?: Omit<UseQueryOptions<Post[]>, "queryKey" | "queryFn">
) {
  return useQuery({
    ...postsQueryOptions(params),
    ...options,
  });
}

export function usePost(
  slug: string,
  options?: Omit<UseQueryOptions<Post | null>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.post(slug),
    queryFn: async () => {
      const local = findLocalPost(slug);
      if (local) return local;
      try {
        const post = await getPost(slug);
        return post;
      } catch {
        return null;
      }
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
    ...options,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.allPosts() });
      queryClient.invalidateQueries({ queryKey: queryKeys.categories() });
    },
  });
}
