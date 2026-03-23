"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createMarkdownComponents } from "./markdown-components";
import { HeadingIdProvider } from "../table-of-contents/heading-id-context";
import type { HeadingItem } from "../table-of-contents/extract-headings";

const markdownComponents = createMarkdownComponents();

interface MarkdownContentProps {
  content: string;
  className?: string;
  headings?: HeadingItem[];
}

export function MarkdownContent({ content, className, headings }: MarkdownContentProps) {
  const contentEl = (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
      {content}
    </ReactMarkdown>
  );

  const wrapped = headings?.length ? (
    <HeadingIdProvider headings={headings}>{contentEl}</HeadingIdProvider>
  ) : (
    contentEl
  );

  return <div className={className}>{wrapped}</div>;
}
