"use client";

import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { detectLanguage } from "./detect-language";
import {
  useHeadingId,
  getTextFromChildren,
} from "../table-of-contents/heading-id-context";
import { slugify } from "../../../lib/slugify";

function useHeadingIdOrSlug(children: React.ReactNode, level: 1 | 2 | 3): string {
  const ctx = useHeadingId();
  if (ctx) return ctx.registerHeading(children, level);
  return slugify(getTextFromChildren(children)) || `heading-${level}`;
}

/*
  Componentes NOMEADOS, não funções anônimas em propriedade de objeto.

  Como arrow functions atribuídas a chaves, o ESLint não as reconhecia como
  componentes React e acusava `rules-of-hooks` nas três — a chamada a
  `useHeadingId` parecia um hook dentro de função comum. Nomeadas e
  capitalizadas, a regra passa e a intenção fica explícita: são componentes.
*/
type HeadingProps = { children?: React.ReactNode };

/* Markdown h1 sai como <h2>: o <h1> da rota é o título do artigo. */
function MdHeading1({ children }: HeadingProps) {
  const id = useHeadingIdOrSlug(children, 1);
  return (
    <h2 id={id} className="md-h2">
      {children}
    </h2>
  );
}

function MdHeading2({ children }: HeadingProps) {
  const id = useHeadingIdOrSlug(children, 2);
  return (
    <h2 id={id} className="md-h2">
      {children}
    </h2>
  );
}

function MdHeading3({ children }: HeadingProps) {
  const id = useHeadingIdOrSlug(children, 3);
  return (
    <h3 id={id} className="md-h3">
      {children}
    </h3>
  );
}

/**
 * Bloco de código.
 *
 * Componente separado porque precisa de estado próprio (o "copiado") — dentro
 * do objeto de componentes ele seria uma função anônima, e hook em função
 * anônima é exatamente o erro que os cabeçalhos acima já pagaram.
 *
 * A tarja só existe quando há linguagem: escrever "text" em cima de um diagrama
 * em cerca é rótulo que não informa nada.
 */
function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    if (!copiado) return;
    const id = window.setTimeout(() => setCopiado(false), 2000);
    return () => window.clearTimeout(id);
  }, [copiado]);

  return (
    <div className="md-block">
      <div className="md-block__bar">
        <span>{language === "text" ? "" : language}</span>
        <button
          type="button"
          className="md-block__copy"
          onClick={() => {
            void navigator.clipboard?.writeText(code).then(
              () => setCopiado(true),
              () => setCopiado(false)
            );
          }}
        >
          {copiado ? "copiado" : "copiar"}
        </button>
      </div>
      <SyntaxHighlighter
        style={oneDark as { [key: string]: React.CSSProperties }}
        language={language}
        PreTag="div"
        customStyle={{
          margin: 0,
          padding: "1rem 1.15rem",
          borderRadius: 0,
          background: "transparent",
          fontSize: "0.82rem",
          lineHeight: 1.65,
          overflow: "auto",
        }}
        codeTagProps={{ style: { fontFamily: "var(--mono)" } }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export function createMarkdownComponents() {
  return {
    h1: MdHeading1,
    h2: MdHeading2,
    h3: MdHeading3,
    p: ({ children }: { children?: React.ReactNode }) => (
      <p className="md-p">{children}</p>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="md-quote">{children}</blockquote>
    ),

    /*
      `pre` transparente, de propósito.

      Antes este componente tentava detectar se o filho era o bloco de código
      customizado, por `"data-code-block" in props` e por comparação de
      `child.type === SyntaxHighlighter`. As duas checagens eram SEMPRE falsas:
      o atributo fica no <div> que `code` RETORNA, não nas props do filho, e o
      tipo do filho é a função `code`, nunca o highlighter. O resultado era um
      <pre> extra com fundo e padding duplicados em volta de todo bloco.
    */
    pre: ({ children }: { children?: React.ReactNode }) => <>{children}</>,

    /*
      BUG CORRIGIDO: `inline` não existe mais.

      react-markdown 9 parou de passar props sintéticas para os componentes, e
      a versão instalada é a 10.1. `inline` chegava sempre `undefined`, então
      TODO código em crase simples caía no caminho de bloco — inclusive dentro
      de títulos e parágrafos, o que produzia um bloco de código completo, com
      barra de título e bolinhas, dentro de um <h3>. Acontecia no artigo em
      destaque do próprio site.

      A detecção correta: bloco é o que tem `language-*` no className (crase
      tripla com linguagem) ou o que contém quebra de linha.
    */
    code: ({
      className,
      children,
      ...props
    }: React.HTMLAttributes<HTMLElement>) => {
      const raw = String(children ?? "");
      const match = /language-(\w+)/.exec(className || "");
      const isBlock = Boolean(match) || raw.includes("\n");

      if (!isBlock) {
        return (
          <code className="md-code" {...props}>
            {children}
          </code>
        );
      }

      const language = match ? match[1] : detectLanguage(raw);

      return <CodeBlock code={raw.replace(/\n$/, "")} language={language} />;
    },

    ul: ({ children }: { children?: React.ReactNode }) => (
      <ul className="md-ul">{children}</ul>
    ),
    ol: ({ children }: { children?: React.ReactNode }) => (
      <ol className="md-ol">{children}</ol>
    ),
    li: ({ children }: { children?: React.ReactNode }) => <li>{children}</li>,

    a: ({ href, children }: { href?: string; children?: React.ReactNode }) => {
      // Âncora interna do próprio artigo não abre em aba nova.
      const external = Boolean(href && !href.startsWith("#"));
      return (
        <a
          href={href}
          className="ed-link"
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      );
    },

    /*
      `strong` volta a ser `strong`.

      Antes era embrulhado em <PointerHighlight>, que renderiza um <div> — ou
      seja, um bloco dentro de um <p>, marcação inválida — e desenhava um
      retângulo amarelo animado atrás de cada negrito. Num sistema de tinta
      chapada, negrito é peso de tinta.
    */
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="md-strong">{children}</strong>
    ),

    hr: () => <hr className="md-hr" />,

    table: ({ children }: { children?: React.ReactNode }) => (
      <div className="md-table-wrap">
        <table className="md-table">{children}</table>
      </div>
    ),
    thead: ({ children }: { children?: React.ReactNode }) => <thead>{children}</thead>,
    tbody: ({ children }: { children?: React.ReactNode }) => <tbody>{children}</tbody>,
    tr: ({ children }: { children?: React.ReactNode }) => <tr>{children}</tr>,
    th: ({ children }: { children?: React.ReactNode }) => <th>{children}</th>,
    td: ({ children }: { children?: React.ReactNode }) => <td>{children}</td>,

    img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
      const src = typeof props.src === "string" ? props.src : undefined;
      if (!src) return null;
      return (
        <span className="md-figure">
          {/* eslint-disable-next-line @next/next/no-img-element -- host arbitrário vindo do markdown; next/image exigiria allowlist */}
          <img
            src={src}
            alt={props.alt || ""}
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </span>
      );
    },
  };
}
