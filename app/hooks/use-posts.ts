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
import {
  defaultPost,
  isDefaultPostSlug,
  mergeWithDefaultPost,
} from "../lib/default-post";

export type PostsParams = {
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
  featured?: boolean;
};

export function usePosts(
  params?: PostsParams,
  options?: Omit<UseQueryOptions<Post[]>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.posts(params),
    queryFn: async () => {
      try {
        const posts = await getPosts(params);
        return mergeWithDefaultPost(posts, params);
      } catch (err) {
        // Garante que o post padrão sempre apareça mesmo se a API falhar
        if (process.env.NODE_ENV !== "production") {
          console.warn("[usePosts] falha ao carregar posts da API:", err);
        }
        return mergeWithDefaultPost([], params);
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
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
      if (isDefaultPostSlug(slug)) return defaultPost;
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
