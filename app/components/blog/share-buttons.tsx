"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

interface ShareButtonsProps {
  title: string;
  slug: string;
}

/**
 * Links de texto, não botões com ícone.
 *
 * A URL é resolvida depois do mount porque depende de `window.location.origin`
 * — o site não tem domínio fixo configurado. Enquanto não resolve, os links
 * ficam desabilitados em vez de apontar para um placeholder inventado, que era
 * o comportamento anterior (`https://example.com/...`).
 */
/*
  A origem é estado EXTERNO ao React (mora em window.location), então quem a
  lê é `useSyncExternalStore`, com snapshot vazio no servidor. A versão
  anterior gravava estado dentro de um efeito só para sair do primeiro render
  — o que a regra `set-state-in-effect` reprova, e com razão: é um render a
  mais para ler um valor que nunca muda.
*/
const subscribe = () => () => {};
const getOrigin = () => window.location.origin;
const getServerOrigin = () => "";

export function ShareButtons({ title, slug }: ShareButtonsProps) {
  const origin = useSyncExternalStore(subscribe, getOrigin, getServerOrigin);
  const [copied, setCopied] = useState(false);

  // Sem isto, clicar em "Copiar link" não dava sinal nenhum de que copiou.
  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(id);
  }, [copied]);

  if (!origin) {
    return (
      <p className="cd-share" aria-hidden="true">
        <span style={{ color: "var(--ink-mute)" }}>preparando…</span>
      </p>
    );
  }

  const url = encodeURIComponent(`${origin}/blog/${slug}`);
  const text = encodeURIComponent(title);

  const destinations = [
    { label: "X", href: `https://twitter.com/intent/tweet?text=${text}&url=${url}` },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    },
    { label: "Copiar link", href: `${origin}/blog/${slug}` },
  ];

  return (
    <p className="cd-share">
      {destinations.map((d) =>
        d.label === "Copiar link" ? (
          <button
            key={d.label}
            type="button"
            className="ed-link"
            style={{ border: 0, background: "transparent", cursor: "pointer", font: "inherit" }}
            onClick={() => {
              void navigator.clipboard?.writeText(d.href).then(
                () => setCopied(true),
                () => setCopied(false)
              );
            }}
          >
            {copied ? "Copiado" : d.label}
          </button>
        ) : (
          <a
            key={d.label}
            className="ed-link"
            href={d.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {d.label}
          </a>
        )
      )}
    </p>
  );
}
