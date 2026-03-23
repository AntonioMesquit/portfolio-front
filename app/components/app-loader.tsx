"use client";

import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { getPosts, getCategories } from "../lib/api";
import { queryKeys } from "../lib/query-keys";

export function AppLoader({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    let mounted = true;
    const MIN_LOAD_TIME_MS = 1200;
    const startTime = Date.now();

    async function preloadBlog() {
      try {
        const [posts, categories] = await Promise.all([
          getPosts({ limit: 50 }),
          getCategories(),
        ]);

        if (!mounted) return;

        queryClient.setQueryData(queryKeys.posts({ limit: 50 }), posts);
        queryClient.setQueryData(queryKeys.categories(), categories);

        posts.forEach((post) => {
          queryClient.setQueryData(queryKeys.post(post.slug), post);
        });
      } catch {
        // Backend offline: libera mesmo assim
      }

      if (!mounted) return;

      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, MIN_LOAD_TIME_MS - elapsed);

      setTimeout(() => {
        if (mounted) setIsReady(true);
      }, remaining);
    }

    preloadBlog();
    return () => {
      mounted = false;
    };
  }, [queryClient]);

  return (
    <AnimatePresence mode="wait">
      {!isReady ? (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-white dark:bg-neutral-950"
        >
          <div className="flex flex-col items-center gap-5">
            <div className="relative h-[2px] w-28 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
              <motion.div
                className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-neutral-900 dark:bg-neutral-400"
                animate={{ x: ["0%", "200%"] }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
            <span className="text-[11px] font-medium tracking-[0.2em] text-neutral-400 dark:text-neutral-500 uppercase">
              Carregando
            </span>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
