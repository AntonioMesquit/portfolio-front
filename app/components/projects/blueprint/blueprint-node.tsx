"use client";

import type { NodeRole } from "../types";

/** Designação de duas letras, no espírito de item numerado em prancha técnica. */
const ROLE_CODE: Record<NodeRole, string> = {
  client: "CL",
  mobile: "MB",
  api: "AP",
  db: "DB",
  cache: "CH",
  ai: "AI",
  chatbot: "CB",
  payment: "PY",
  realtime: "RT",
  cms: "CM",
  storage: "ST",
  video: "VD",
  auth: "AU",
  maps: "MP",
};

export interface BlueprintNodeProps {
  role: NodeRole;
  label: string;
  tech: string;
  /** Centro em porcentagem da área de desenho. */
  x: number;
  y: number;
  /** Falso quando o projeto atual não usa este papel: colapsa no hub, invisível. */
  present: boolean;
}

/**
 * Um nó da prancha.
 *
 * Todos os 14 papéis ficam SEMPRE montados. Os que o projeto atual não usa são
 * estacionados sobre o nó `api` com opacidade zero. É isso que dá ao Flip um
 * conjunto de elementos estável — sem enter/leave — e produz de graça o gesto
 * de satélites nascendo do hub e colapsando de volta nele.
 *
 * `translate: -50% -50%` usa a propriedade CSS independente, não `transform`,
 * justamente porque o Flip escreve em `transform`. As duas compõem sem brigar.
 */
export function BlueprintNode({
  role,
  label,
  tech,
  x,
  y,
  present,
}: BlueprintNodeProps) {
  return (
    <div
      data-flip-id={role}
      data-present={present ? "true" : "false"}
      className="bp-node"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <span className="bp-node__tick bp-node__tick--tl" />
      <span className="bp-node__tick bp-node__tick--tr" />
      <span className="bp-node__tick bp-node__tick--bl" />
      <span className="bp-node__tick bp-node__tick--br" />

      <span className="bp-node__code">{ROLE_CODE[role]}</span>
      <span className="bp-node__label" data-node-text>
        {label}
      </span>
      <span className="bp-node__tech" data-node-text>
        {tech}
      </span>
    </div>
  );
}
