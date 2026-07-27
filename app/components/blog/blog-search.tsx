"use client";

import { useId } from "react";

interface BlogSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * Busca como linha de formulário impresso: rótulo em monoespaçada, campo sem
 * caixa, um fio embaixo que escurece no foco. Sem ícone de lupa, sem pílula.
 */
export function BlogSearch({
  value,
  onChange,
  placeholder = "título, assunto, trecho…",
}: BlogSearchProps) {
  const id = useId();

  return (
    <div className="cd-search">
      <label className="cd-search__label" htmlFor={id}>
        Buscar
      </label>
      <input
        id={id}
        className="cd-search__input"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
      />
    </div>
  );
}
