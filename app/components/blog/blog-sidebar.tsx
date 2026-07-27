"use client";

import type { Category } from "../../lib/api";

interface BlogSidebarProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (slug: string | null) => void;
  totalPostsCount: number;
}

/**
 * Filtros em linha, não uma barra lateral.
 *
 * A lateral custava uma coluna inteira do layout para quatro botões, e os
 * botões eram pílulas âmbar com canto arredondado. Aqui os assuntos ficam numa
 * tira horizontal em monoespaçada, e o ativo é sublinhado por um fio pesado —
 * a mesma marcação da aba ativa no header.
 *
 * `aria-pressed` e não `aria-current`: são filtros que ligam e desligam, não
 * navegação.
 */
export function BlogSidebar({
  categories,
  selectedCategory,
  onSelectCategory,
  totalPostsCount,
}: BlogSidebarProps) {
  return (
    <div className="cd-filters" role="group" aria-label="Filtrar por assunto">
      <button
        type="button"
        className="cd-filter"
        aria-pressed={selectedCategory === null}
        onClick={() => onSelectCategory(null)}
      >
        Todos <span className="cd-filter__n">{totalPostsCount}</span>
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          className="cd-filter"
          aria-pressed={selectedCategory === category.slug}
          onClick={() =>
            onSelectCategory(selectedCategory === category.slug ? null : category.slug)
          }
        >
          {category.name} <span className="cd-filter__n">{category.post_count}</span>
        </button>
      ))}
    </div>
  );
}
