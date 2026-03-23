"use client";

import { useCallback, useEffect, useRef } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

interface MarkdownEditorProps {
  value: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
  className?: string;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = "Comece a escrever...",
  className = "",
}: MarkdownEditorProps) {
  const editor = useCreateBlockNote();
  const initialized = useRef(false);

  useEffect(() => {
    if (!editor || initialized.current || !value?.trim()) return;
    let cancelled = false;
    (async () => {
      try {
        const blocks = await editor.tryParseMarkdownToBlocks(value);
        if (!cancelled && blocks.length > 0) {
          editor.replaceBlocks(editor.document, blocks);
        }
        initialized.current = true;
      } catch {
        initialized.current = true;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [editor, value]);

  const handleChange = useCallback(() => {
    if (!editor) return;
    try {
      const markdown = editor.blocksToMarkdownLossy(editor.document);
      onChange(markdown);
    } catch {
    }
  }, [editor, onChange]);

  return (
    <div className={className}>
      <BlockNoteView
        editor={editor}
        onChange={handleChange}
        theme="light"
        data-placeholder={placeholder}
        className="min-h-[280px] rounded-xl border border-neutral-200 bg-white [&_.bn-editor]:min-h-[260px] [&_.bn-editor]:p-4 [&_.bn-block-content]:outline-none"
      />
    </div>
  );
}
