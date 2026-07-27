"use client";

import { useInk } from "./use-ink";

/**
 * Monta o comportamento e renderiza NADA.
 *
 * É esse `null` que mantém os três desenhos fora do bundle do cliente: a carta
 * inteira, incluindo os 308 contornos, é renderizada no servidor, e este
 * componente só opera sobre ela por seletor. Se o SVG morasse dentro da árvore
 * "use client", cada `d` viajaria duas vezes — no HTML e no payload de flight —
 * e o peso dobraria.
 */
export function LetterInk() {
  useInk("ct-page");
  return null;
}
