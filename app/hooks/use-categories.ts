"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { getCategories, createCategory, type Category } from "../lib/api";
import { queryKeys } from "../lib/query-keys";

export function useCategories(
  options?: Omit<UseQueryOptions<Category[]>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: queryKeys.categories(),
    queryFn: getCategories,
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
