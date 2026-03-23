"use client";

import { FolderOpen } from "lucide-react";
import type { Category } from "../../lib/api";

interface BlogSidebarProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (slug: string | null) => void;
  totalPostsCount: number;
}

export function BlogSidebar({
  categories,
  selectedCategory,
  onSelectCategory,
  totalPostsCount,
}: BlogSidebarProps) {
  return (
    <aside className="lg:w-56 shrink-0">
      <h2 className="text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-widest mb-4 flex items-center gap-2">
        <FolderOpen className="w-4 h-4 text-amber-500 dark:text-amber-400" />
        Categorias
      </h2>
      <nav className="space-y-1">
        <button
          onClick={() => onSelectCategory(null)}
          className={`w-full text-left py-2.5 px-3.5 rounded-xl text-sm font-medium transition-colors ${
            selectedCategory === null
              ? "bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-700/50 text-amber-900 dark:text-amber-200"
              : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 hover:text-neutral-900 dark:hover:text-white"
          }`}
        >
          Todos os artigos [<span className="tabular-nums font-semibold">{totalPostsCount}</span>]
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelectCategory(selectedCategory === c.slug ? null : c.slug)}
            className={`w-full text-left py-2.5 px-3.5 rounded-xl text-sm font-medium transition-colors ${
              selectedCategory === c.slug
                ? "bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-700/50 text-amber-900 dark:text-amber-200"
                : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            {c.name} [<span className="tabular-nums font-semibold">{c.post_count}</span>]
          </button>
        ))}
        {categories.length === 0 && (
          <p className="text-neutral-500 text-sm py-2">Nenhuma categoria ainda</p>
        )}
      </nav>
    </aside>
  );
}
