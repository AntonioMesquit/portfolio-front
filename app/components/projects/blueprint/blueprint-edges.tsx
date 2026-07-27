"use client";

import { useId } from "react";
import type { BlueprintEdge } from "../types";
import { edgeKey } from "../types";

export interface BlueprintEdgesProps {
  /** União de todas as arestas de todos os projetos. */
  edges: BlueprintEdge[];
  /** Chaves das arestas que o projeto atual usa. */
  presentKeys: Set<string>;
}

/**
 * Camada de conexões.
 *
 * O atributo `d` é deixado de fora do JSX de propósito: quem escreve nele é o
 * `syncEdges` do hook de transição, a cada frame. Como o React nunca declara
 * `d`, ele nunca o sobrescreve num re-render.
 */
export function BlueprintEdges({ edges, presentKeys }: BlueprintEdgesProps) {
  const markerId = `bp-arrow-${useId().replace(/:/g, "")}`;

  return (
    <svg className="bp-edges" aria-hidden="true" focusable="false">
      <defs>
        <marker
          id={markerId}
          viewBox="0 0 8 8"
          refX="6.5"
          refY="4"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path
            d="M 0.5 1 L 6.5 4 L 0.5 7"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </marker>
      </defs>

      {edges.map((edge) => {
        const key = edgeKey(edge);
        return (
          <path
            key={key}
            data-edge-key={key}
            data-present={presentKeys.has(key) ? "true" : "false"}
            className="bp-edge"
            markerEnd={`url(#${markerId})`}
          />
        );
      })}
    </svg>
  );
}
