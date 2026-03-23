"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { HeadingItem } from "./extract-headings";

interface TableOfContentsProps {
  headings: HeadingItem[];
}

const MAX_TEXT_LENGTH = 45;
const SCROLL_OFFSET = 120;

function truncate(text: string, max: number = MAX_TEXT_LENGTH): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trim() + "...";
}

function getActiveHeadingId(ids: string[]): string | null {
  if (ids.length === 0) return null;
  for (let i = ids.length - 1; i >= 0; i--) {
    const el = document.getElementById(ids[i]);
    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top <= SCROLL_OFFSET) return ids[i];
    }
  }
  return ids[0];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const ids = headings.map((h) => h.id);
  const [activeId, setActiveId] = useState<string | null>(() => ids[0] ?? null);
  const rafRef = useRef<number | null>(null);

  const updateActive = useCallback(() => {
    const newId = getActiveHeadingId(ids);
    setActiveId((prev) => (newId !== prev ? newId : prev));
  }, [ids.join(",")]);

  useEffect(() => {
    if (ids.length === 0) return;

    const handleScroll = () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        updateActive();
        rafRef.current = null;
      });
    };

    updateActive();
    const timer = setTimeout(updateActive, 150);

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      clearTimeout(timer);
    };
  }, [updateActive, ids.length]);

  if (headings.length === 0) return null;

  return (
    <>
      {/* Espaçador para reservar espaço no layout */}
      <div aria-hidden className="hidden xl:block shrink-0 w-56" />
      <nav
        aria-label="Conteúdo do artigo"
        className="hidden xl:block fixed top-28 w-56 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-hide pt-2"
        style={{
          left: "calc(50% + 22rem)",
        }}
      >
        <h3 className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-4">
          Conteúdo
        </h3>
        <ul className="space-y-1 text-sm">
          {headings.map((item) => {
            const isActive = activeId === item.id;
            const indent = item.level === 3 ? "pl-4" : "pl-0";

            return (
              <li key={item.id} className={indent}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(item.id)?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                  className={`block py-2 pl-3 -ml-px rounded-r-lg border-l-2 transition-all duration-200 truncate ${
                    isActive
                      ? "border-amber-500 dark:border-amber-400 text-neutral-900 dark:text-white font-semibold bg-amber-50/80 dark:bg-amber-950/40"
                      : "border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-amber-300 dark:hover:border-amber-600 hover:bg-neutral-50 dark:hover:bg-neutral-900/50"
                  }`}
                >
                  {truncate(item.text)}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
