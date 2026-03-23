"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    setUrl(typeof window !== "undefined" ? window.location.origin + `/blog/${slug}` : "");
  }, [slug]);

  const text = encodeURIComponent(`Confira: ${title}`);
  const shareUrl = encodeURIComponent(url || `https://example.com/blog/${slug}`);

  const buttons = [
    {
      href: `https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}`,
      label: "Twitter",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
      label: "LinkedIn",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {buttons.map((btn, i) => (
        <motion.a
          key={btn.label}
          href={btn.href}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-700/50 text-amber-900 dark:text-amber-200 font-semibold text-sm hover:bg-amber-100 dark:hover:bg-amber-900/50 hover:border-amber-300 dark:hover:border-amber-600 transition-colors"
        >
          {btn.icon}
          {btn.label}
        </motion.a>
      ))}
    </div>
  );
}
