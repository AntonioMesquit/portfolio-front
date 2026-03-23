"use client";

import { Search } from "lucide-react";

interface BlogSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function BlogSearch({
  value,
  onChange,
  placeholder = "Buscar artigos...",
}: BlogSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 dark:text-neutral-500" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-400 dark:focus:border-amber-600 outline-none text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 transition-colors"
      />
    </div>
  );
}
