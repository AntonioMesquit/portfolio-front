import { slugify } from "../../../lib/slugify";

export interface HeadingItem {
  level: 1 | 2 | 3;
  text: string;
  id: string;
}

/**
 * Remove blocos cercados antes de procurar títulos.
 *
 * A varredura anterior rodava sobre o markdown cru, então qualquer linha
 * começando com `#` DENTRO de um bloco de código virava um título fantasma:
 * comentário de shell, de Python, diretiva de YAML. Cada fantasma entrava na
 * lista e, como o mapeamento de ids é POSICIONAL, deslocava o id de todos os
 * títulos reais seguintes — o sumário passava a apontar para âncoras que não
 * existem.
 */
function stripFences(markdown: string): string {
  return markdown.replace(/^[ \t]*(`{3,}|~{3,})[\s\S]*?^[ \t]*\1[ \t]*$/gm, "");
}

export function extractHeadings(markdown: string): HeadingItem[] {
  const regex = /^(#{1,3})\s+(.+)$/gm;
  const headings: HeadingItem[] = [];
  const idCount = new Map<string, number>();
  const source = stripFences(markdown);

  let match: RegExpExecArray | null;
  while ((match = regex.exec(source)) !== null) {
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
