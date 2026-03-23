import { slugify } from "../../../lib/slugify";

export interface HeadingItem {
  level: 1 | 2 | 3;
  text: string;
  id: string;
}


export function extractHeadings(markdown: string): HeadingItem[] {
  const regex = /^(#{1,3})\s+(.+)$/gm;
  const headings: HeadingItem[] = [];
  const idCount = new Map<string, number>();

  let match: RegExpExecArray | null;
  while ((match = regex.exec(markdown)) !== null) {
    const level = match[1].length as 1 | 2 | 3;
    const text = match[2].trim().replace(/#+$/, "").replace(/\s+/g, " ");
    const baseId = slugify(text);
    const count = idCount.get(baseId) ?? 0;
    idCount.set(baseId, count + 1);
    const id = count === 0 ? baseId : `${baseId}-${count}`;
    headings.push({ level, text, id });
  }

  return headings;
}
