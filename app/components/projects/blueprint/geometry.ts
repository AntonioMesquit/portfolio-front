/**
 * Geometria das conexões da prancha.
 *
 * Função pura: dado dois retângulos em coordenadas locais do container, devolve
 * o atributo `d` de um caminho ORTOGONAL com um cotovelo em ângulo reto.
 * Blueprint não tem bezier — curva suave é linguagem de fluxograma, não de
 * desenho técnico.
 */

export interface Box {
  /** Centro horizontal, em px relativos ao container. */
  cx: number;
  /** Centro vertical, em px relativos ao container. */
  cy: number;
  width: number;
  height: number;
}

/** Distância entre a borda do nó e o início do traço. */
const GAP = 6;

/** Abaixo disso os nós estão praticamente sobrepostos e a linha não faz sentido. */
const MIN_SPAN = 4;

function round(value: number): number {
  return Math.round(value * 10) / 10;
}

function line(points: Array<[number, number]>): string {
  return points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${round(x)} ${round(y)}`)
    .join(" ");
}

/**
 * Caminho ortogonal entre dois nós. Sai pela borda mais próxima do destino e
 * entra pela borda oposta, com o cotovelo no meio do trajeto.
 *
 * Devolve string vazia quando os nós estão sobrepostos — o consumidor deve
 * tratar isso como "sem linha", que é o caso dos satélites colapsados no hub.
 */
export function orthogonalPath(from: Box, to: Box): string {
  const dx = to.cx - from.cx;
  const dy = to.cy - from.cy;

  if (Math.abs(dx) < MIN_SPAN && Math.abs(dy) < MIN_SPAN) return "";

  if (Math.abs(dx) >= Math.abs(dy)) {
    const dir = dx >= 0 ? 1 : -1;
    const sx = from.cx + dir * (from.width / 2 + GAP);
    const ex = to.cx - dir * (to.width / 2 + GAP);

    // Sem vão horizontal: desviar pela vertical. Uma reta de centro a centro
    // ficaria enterrada sob as duas caixas — que têm fundo opaco — junto com a
    // ponta de seta, resultando em aresta invisível.
    if ((ex - sx) * dir <= MIN_SPAN) {
      const vdir = dy >= 0 ? 1 : -1;
      const oy1 = from.cy + vdir * (from.height / 2 + GAP);
      const oy2 = to.cy - vdir * (to.height / 2 + GAP);
      if ((oy2 - oy1) * vdir <= MIN_SPAN) return "";
      const midY = (oy1 + oy2) / 2;
      return line([
        [from.cx, oy1],
        [from.cx, midY],
        [to.cx, midY],
        [to.cx, oy2],
      ]);
    }

    if (Math.abs(dy) < 1) {
      return line([
        [sx, from.cy],
        [ex, to.cy],
      ]);
    }

    const mid = (sx + ex) / 2;
    return line([
      [sx, from.cy],
      [mid, from.cy],
      [mid, to.cy],
      [ex, to.cy],
    ]);
  }

  const dir = dy >= 0 ? 1 : -1;
  const sy = from.cy + dir * (from.height / 2 + GAP);
  const ey = to.cy - dir * (to.height / 2 + GAP);

  // Simétrico do ramo horizontal: sem vão vertical, desviar pela horizontal.
  if ((ey - sy) * dir <= MIN_SPAN) {
    const hdir = dx >= 0 ? 1 : -1;
    const ox1 = from.cx + hdir * (from.width / 2 + GAP);
    const ox2 = to.cx - hdir * (to.width / 2 + GAP);
    if ((ox2 - ox1) * hdir <= MIN_SPAN) return "";
    const midX = (ox1 + ox2) / 2;
    return line([
      [ox1, from.cy],
      [midX, from.cy],
      [midX, to.cy],
      [ox2, to.cy],
    ]);
  }

  if (Math.abs(dx) < 1) {
    return line([
      [from.cx, sy],
      [to.cx, ey],
    ]);
  }

  const mid = (sy + ey) / 2;
  return line([
    [from.cx, sy],
    [from.cx, mid],
    [to.cx, mid],
    [to.cx, ey],
  ]);
}

/** Converte um rect de tela para coordenadas locais do container. */
export function toLocalBox(element: DOMRect, container: DOMRect): Box {
  return {
    cx: element.left - container.left + element.width / 2,
    cy: element.top - container.top + element.height / 2,
    width: element.width,
    height: element.height,
  };
}
