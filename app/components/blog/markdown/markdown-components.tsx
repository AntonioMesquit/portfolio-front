"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { detectLanguage } from "./detect-language";
import { useHeadingId, getTextFromChildren } from "../table-of-contents/heading-id-context";
import { slugify } from "../../../lib/slugify";
import { PointerHighlight } from "../../ui/pointer-highlight";

function useHeadingIdOrSlug(children: React.ReactNode, level: 1 | 2 | 3): string {
  const ctx = useHeadingId();
  if (ctx) return ctx.registerHeading(children, level);
  return slugify(getTextFromChildren(children)) || `heading-${level}`;
}

export function createMarkdownComponents() {
  return {
    h1: ({ children }: { children?: React.ReactNode }) => {
      const id = useHeadingIdOrSlug(children, 1);
      return (
        <h1 id={id} className="mt-12 mb-5 text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white first:mt-0 scroll-mt-24 pb-2 border-b border-neutral-200 dark:border-neutral-700">
          {children}
        </h1>
      );
    },
    h2: ({ children }: { children?: React.ReactNode }) => {
      const id = useHeadingIdOrSlug(children, 2);
      return (
        <h2 id={id} className="mt-10 mb-4 text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white scroll-mt-24">
          {children}
        </h2>
      );
    },
    h3: ({ children }: { children?: React.ReactNode }) => {
      const id = useHeadingIdOrSlug(children, 3);
      return (
        <h3 id={id} className="mt-8 mb-3 text-xl font-bold text-neutral-900 dark:text-white scroll-mt-24">
          {children}
        </h3>
      );
    },
    p: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-5 text-neutral-700 dark:text-neutral-300 leading-[1.75]">{children}</p>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="my-6 pl-5 pr-5 py-4 rounded-xl border-l-4 border-amber-400 dark:border-amber-600 bg-amber-50/80 dark:bg-amber-950/30 text-neutral-800 dark:text-neutral-200 not-italic">
        {children}
      </blockquote>
    ),
    pre: ({ children }: { children?: React.ReactNode }) => {
      const child = Array.isArray(children) ? children[0] : children;
      const props = typeof child === "object" && child !== null && "props" in child ? (child as { props?: Record<string, unknown> }).props : undefined;
      const isCodeBlock = props && "data-code-block" in props;
      const isHighlighter =
        !isCodeBlock &&
        typeof child === "object" &&
        child !== null &&
        "type" in child &&
        (child as { type?: unknown }).type === SyntaxHighlighter;
      if (isCodeBlock || isHighlighter)
        return (
          <div className="my-6 overflow-hidden rounded-lg bg-[#1e1e1e]">
            {children}
          </div>
        );
      return <pre className="my-6 overflow-x-auto scrollbar-hide rounded-lg bg-[#1e1e1e] px-5 py-4 text-sm leading-relaxed">{children}</pre>;
    },
    code: ({
      className,
      children,
      inline,
      ...props
    }: React.HTMLAttributes<HTMLElement> & { inline?: boolean }) => {
      if (inline) {
        return (
          <code
            className="rounded bg-neutral-800 px-1.5 py-0.5 font-mono text-sm text-neutral-200"
            {...props}
          >
            {children}
          </code>
        );
      }
      const match = /language-(\w+)/.exec(className || "");
      let language = match ? match[1] : "text";
      if (language === "text" || language === "plaintext") {
        language = detectLanguage(String(children));
      }
      return (
        <div data-code-block className="scrollbar-hide">
          <div className="flex items-center justify-between border-b border-neutral-700/50 bg-[#252526] px-4 py-2">
            <span className="font-mono text-xs capitalize text-neutral-400">{language}</span>
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            </div>
          </div>
          <SyntaxHighlighter
            style={oneDark as { [key: string]: React.CSSProperties }}
            language={language} 
            PreTag="div"
            customStyle={{
              margin: 0,
              padding: "1rem 1.25rem",
              borderRadius: 0,
              fontSize: "0.875rem",
              lineHeight: 1.6,
              overflow: "auto",
              boxShadow: "none",
            }}
            codeTagProps={{ style: { fontFamily: "ui-monospace, monospace" } }}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        </div>
      );
    },
    ul: ({ children }: { children?: React.ReactNode }) => (
      <ul className="my-5 list-disc space-y-2.5 pl-6 text-neutral-700 dark:text-neutral-300 [&>li]:leading-relaxed marker:text-amber-500 dark:marker:text-amber-400">
        {children}
      </ul>
    ),
    ol: ({ children }: { children?: React.ReactNode }) => (
      <ol className="my-5 space-y-2.5 pl-6 list-decimal text-neutral-700 dark:text-neutral-300 [&>li]:leading-relaxed marker:font-semibold marker:text-amber-600 dark:marker:text-amber-400">
        {children}
      </ol>
    ),
    li: ({ children }: { children?: React.ReactNode }) => (
      <li className="pl-1">{children}</li>
    ),
    a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-amber-700 dark:text-amber-400 underline decoration-amber-300 dark:decoration-amber-600 hover:decoration-amber-600 dark:hover:decoration-amber-400 underline-offset-2 transition-colors"
      >
        {children}
      </a>
    ),
    strong: ({ children }: { children?: React.ReactNode }) => (
      <PointerHighlight
        rectangleClassName="rounded-sm bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700"
        pointerClassName="text-amber-600 dark:text-amber-400 h-3 w-3"
        containerClassName="inline-block mx-1"
      >
        <strong className="relative z-10 font-bold text-neutral-900 dark:text-neutral-100">
          {children}
        </strong>
      </PointerHighlight>
    ),
    hr: () => <hr className="my-10 border-neutral-200 dark:border-neutral-700" />,
    table: ({ children }: { children?: React.ReactNode }) => (
      <div className="my-6 overflow-x-auto scrollbar-hide rounded-xl border border-neutral-200 dark:border-neutral-700">
        <table className="w-full min-w-[400px] text-sm">{children}</table>
      </div>
    ),
    thead: ({ children }: { children?: React.ReactNode }) => (
      <thead className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-700">
        {children}
      </thead>
    ),
    tbody: ({ children }: { children?: React.ReactNode }) => (
      <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">{children}</tbody>
    ),
    tr: ({ children }: { children?: React.ReactNode }) => (
      <tr className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 transition-colors">
        {children}
      </tr>
    ),
    th: ({ children }: { children?: React.ReactNode }) => (
      <th className="px-4 py-3 text-left font-semibold text-neutral-900 dark:text-white">
        {children}
      </th>
    ),
    td: ({ children }: { children?: React.ReactNode }) => (
      <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">
        {children}
      </td>
    ),
    img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
      const src = typeof props.src === "string" ? props.src : undefined;
      if (!src) return null;
      return (
        <span className="my-6 block">
          <img
            {...props}
            src={src}
            alt={props.alt || ""}
            className="max-w-full rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-lg"
          />
        </span>
      );
    },
  };
}
