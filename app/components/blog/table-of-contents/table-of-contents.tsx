"use client";

import { useEffect, useMemo, useState } from "react";
import type { HeadingItem } from "./extract-headings";

interface TableOfContentsProps {
  headings: HeadingItem[];
}

const SCROLL_OFFSET = 120;

/**
 * Sumário lateral do artigo.
 *
 * Sem truncagem: o título inteiro aparece, quebrando em duas linhas se
 * precisar. Cortar em 45 caracteres economizava altura e custava o sentido do
 * item, que é a única coisa que ele tem.
 *
 * A dependência do efeito é `key`, uma string estável — antes era
 * `ids.join(",")` calculado dentro do array de dependências, o que o ESLint
 * não consegue verificar estaticamente e o `ids` era recriado a cada render.
 */
export function TableOfContents({ headings }: TableOfContentsProps) {
  const key = useMemo(() => headings.map((h) => h.id).join(","), [headings]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const ids = key ? key.split(",") : [];
    if (ids.length === 0) return;

    let frame = 0;
    const update = () => {
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= SCROLL_OFFSET) current = id;
      }
      setActiveId((prev) => (prev === current ? prev : current));
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    const settle = window.setTimeout(update, 200);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(settle);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [key]);

  if (headings.length === 0) return null;

  return (
    <nav className="cd-toc" aria-label="Conteúdo do artigo">
      <p className="cd-foot__label">Neste artigo</p>
      <ul className="cd-toc__list">
        {headings.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`cd-toc__link${item.level === 3 ? " cd-toc__link--sub" : ""}`}
              aria-current={activeId === item.id ? "true" : undefined}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
