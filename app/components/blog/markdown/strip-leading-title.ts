import { slugify } from "../../../lib/slugify";

/**
 * Remove o `# Título` inicial quando ele repete o título do post.
 *
 * É uma convenção comum escrever o título dentro do próprio Markdown, mas a
 * página já imprime esse título como <h1>. Sem isto o artigo abre com a mesma
 * frase duas vezes, em dois tamanhos, e o sumário lateral ganha uma entrada
 * inútil apontando para o topo.
 *
 * A comparação é por slug para tolerar diferença de acento, caixa e
 * pontuação. Só o PRIMEIRO bloco não vazio é considerado: um `#` no meio do
 * texto é conteúdo de verdade e fica.
 */
export function stripLeadingTitle(markdown: string, title: string): string {
  if (!markdown || !title) return markdown;

  const match = /^\s*#\s+(.+?)\s*$/m.exec(markdown);
  if (!match || match.index === undefined) return markdown;

  // Precisa ser a primeira coisa do documento, não um título qualquer.
  if (markdown.slice(0, match.index).trim() !== "") return markdown;
  if (slugify(match[1]) !== slugify(title)) return markdown;

  return markdown.slice(match.index + match[0].length).replace(/^\s*\n/, "");
}
