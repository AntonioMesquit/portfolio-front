"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, User } from "lucide-react";
import { formatDate } from "../../lib/format";
import {
  MarkdownContent,
  ShareButtons,
  PostLinks,
  TableOfContents,
  extractHeadings,
} from "../../components/blog";
import { usePost } from "../../hooks";
import { ReadingProgress } from "../../components/ui/reading-progress";

export default function BlogPostPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";

  const { data: post, isLoading, isError } = usePost(slug);
  const headings = useMemo(
    () => extractHeadings(post?.content ?? ""),
    [post?.content]
  );

  if (isLoading) {
    return (
      <div className="min-h-screen w-full pt-24 pb-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="min-h-screen w-full pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            Artigo não encontrado
          </h1>
          <Link
            href="/blog"
            className="text-neutral-600 hover:text-neutral-900 underline"
          >
            ← Voltar para o blog
          </Link>
        </div>
      </div>
    );
  }

  const firstCategory = post.categories?.[0];

  return (
    <div className="min-h-screen w-full pt-24 pb-16 bg-white dark:bg-neutral-950">
      <ReadingProgress />
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 flex flex-col xl:flex-row xl:gap-12">
        <div className="flex-1 min-w-0 max-w-4xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar para o blog</span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="flex flex-wrap items-center gap-2.5 mb-5"
          >
            {firstCategory && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-700/50 text-amber-900 dark:text-amber-200 text-sm font-semibold">
                {firstCategory.name}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-700/50 text-amber-900 dark:text-amber-200 text-sm font-medium">
              {formatDate(post.published_at)}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-700/50 text-amber-900 dark:text-amber-200 text-sm font-medium">
              {post.read_time_minutes} min de leitura
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-white cherry-bomb-one-regular mb-6 leading-tight"
          >
            {post.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-700/50 mb-10"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/40 border border-amber-200/80 dark:border-amber-700/50 flex items-center justify-center shrink-0">
              <User className="w-6 h-6 text-amber-700 dark:text-amber-400" />
            </div>
            <div>
              <p className="font-bold text-neutral-900 dark:text-white">Antonio Mesquita</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Desenvolvedor Full Stack</p>
            </div>
          </motion.div>

          <motion.article
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="[&_*:first-child]:mt-0"
          >
            <MarkdownContent content={post.content} headings={headings} />
          </motion.article>

          {post.links && post.links.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <PostLinks links={post.links} />
            </motion.div>
          )}

          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-700"
          >
            <h3 className="text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-widest mb-4">
              Compartilhar este artigo
            </h3>
            <ShareButtons title={post.title} slug={post.slug} />
          </motion.section>
        </div>

        <TableOfContents headings={headings} />
      </div>
    </div>
  );
}
