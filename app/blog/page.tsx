"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { PostCard, BlogSidebar, BlogSearch } from "../components/blog";
import { usePosts, useCategories, useDebounce } from "../hooks";
import { queryKeys } from "../lib/query-keys";

export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const debouncedSearch = useDebounce(search, 300);

  const { data: posts = [], isLoading: postsLoading } = usePosts({
    category: selectedCategory ?? undefined,
    search: debouncedSearch || undefined,
    limit: 50,
  });

  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  // Pré-popula o cache de cada post para clique instantâneo (evita nova requisição)
  useEffect(() => {
    if (posts.length === 0) return;
    posts.forEach((post) => {
      queryClient.setQueryData(queryKeys.post(post.slug), post);
    });
  }, [posts, queryClient]);

  const loading = postsLoading || categoriesLoading;

  const totalPostsCount =
    selectedCategory === null
      ? posts.length
      : categories.find((c) => c.slug === selectedCategory)?.post_count ?? 0;

  return (
    <div className="min-h-screen w-full pt-24 pb-16 bg-white dark:bg-neutral-950">
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <p className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-1">
            Antonio Mesquita
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 cherry-bomb-one-regular mb-2">
            Últimas Atualizações
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl">
            Artigos sobre desenvolvimento, carreira tech e reflexões, direto da
            fonte.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative mb-10"
        >
          <BlogSearch
            value={search}
            onChange={setSearch}
            placeholder="Buscar artigos sobre desenvolvimento, carreira, tech..."
          />
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-10">
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <BlogSidebar
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              totalPostsCount={totalPostsCount}
            />
          </motion.aside>

          <main className="flex-1 min-w-0">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
              </div>
            ) : posts.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-neutral-500 py-12"
              >
                Nenhum artigo encontrado.
              </motion.p>
            ) : (
              <ul className="space-y-2">
                {posts.map((post, i) => (
                  <PostCard key={post.id} post={post} index={i} />
                ))}
              </ul>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
