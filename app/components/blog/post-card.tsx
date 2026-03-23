"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { formatDate } from "../../lib/format";
import type { Post } from "../../lib/api";

interface PostCardProps {
  post: Post;
  index?: number;
}

export function PostCard({ post, index = 0 }: PostCardProps) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.03 * index }}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="block p-5 md:p-6 rounded-2xl border border-transparent hover:border-amber-200/60 dark:hover:border-amber-700/40 hover:bg-amber-50/30 dark:hover:bg-amber-950/20 transition-all duration-200 group"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-700/50 text-amber-900 dark:text-amber-200 text-xs font-medium">
                {formatDate(post.published_at)}
              </span>
              {post.featured && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/50 border border-amber-300/80 dark:border-amber-600/50 text-amber-800 dark:text-amber-300 text-xs font-semibold">
                  Destaque
                </span>
              )}
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 text-xs font-medium">
                {post.read_time_minutes} min
              </span>
            </div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white group-hover:text-amber-900 dark:group-hover:text-amber-200 mb-2 transition-colors">
              {post.title}
            </h2>
            {post.snippet && (
              <p className="text-neutral-600 dark:text-neutral-400 text-base leading-relaxed line-clamp-2">
                {post.snippet}
              </p>
            )}
          </div>
          <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-amber-500 group-hover:translate-x-1 shrink-0 mt-1 transition-all duration-200" />
        </div>
      </Link>
    </motion.li>
  );
}
