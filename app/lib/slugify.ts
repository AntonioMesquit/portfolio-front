/**
 * Converte texto para slug (URL amigável)
 * Ex: "Se você se sente perdido" → "se-voce-se-sente-perdido"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
