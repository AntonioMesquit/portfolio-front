"use client";

import { motion } from "framer-motion";
import { Link2, ExternalLink } from "lucide-react";

interface Link {
  label: string;
  url: string;
}

interface PostLinksProps {
  links: Link[];
}

export function PostLinks({ links }: PostLinksProps) {
  if (!links.length) return null;

  return (
    <section className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-700">
      <h3 className="text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-widest mb-4 flex items-center gap-2">
        <Link2 className="w-4 h-4 text-amber-500 dark:text-amber-400" />
        Links relacionados
      </h3>
      <ul className="space-y-3">
        {links.map((link, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 p-4 rounded-xl border border-amber-200/60 dark:border-amber-700/40 bg-amber-50/50 dark:bg-amber-950/20 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:border-amber-300/80 dark:hover:border-amber-600/50 transition-all duration-200"
            >
              <span className="font-semibold text-neutral-900 dark:text-white group-hover:text-amber-800 dark:group-hover:text-amber-300 transition-colors">
                {link.label}
              </span>
              <span className="text-sm text-neutral-500 dark:text-neutral-400 truncate flex-1 min-w-0">
                {link.url}
              </span>
              <ExternalLink className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
