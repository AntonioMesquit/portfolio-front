"use client";

import { useMemo, type Ref } from "react";
import type { BlueprintEdge, BlueprintNode as NodeData, NodeRole, Project } from "../types";
import { NODE_ROLES, edgeKey } from "../types";
import { BlueprintNode } from "./blueprint-node";
import { BlueprintEdges } from "./blueprint-edges";

export interface BlueprintDiagramProps {
  projects: Project[];
  index: number;
  ref?: Ref<HTMLDivElement>;
}

/**
 * Resolve o nó de um papel olhando para trás a partir do projeto atual.
 *
 * Se o projeto atual define o papel, ele está presente. Se não, devolvemos a
 * definição do projeto anterior mais próximo que o tinha — assim o rótulo que
 * aparece durante o colapso é o que o usuário acabou de ver, e não um texto
 * arbitrário. Determinístico, sem ref mutável, seguro no SSR.
 */
function resolveNode(
  projects: Project[],
  index: number,
  role: NodeRole
): { node: NodeData; present: boolean } | null {
  const total = projects.length;
  for (let back = 0; back < total; back++) {
    const project = projects[(((index - back) % total) + total) % total];
    const node = project.blueprint.nodes.find((candidate) => candidate.role === role);
    if (node) return { node, present: back === 0 };
  }
  return null;
}

export function BlueprintDiagram({ projects, index, ref }: BlueprintDiagramProps) {
  const project = projects[index];

  const allEdges = useMemo(() => {
    const seen = new Set<string>();
    const edges: BlueprintEdge[] = [];
    for (const candidate of projects) {
      for (const edge of candidate.blueprint.edges) {
        const key = edgeKey(edge);
        if (seen.has(key)) continue;
        seen.add(key);
        edges.push(edge);
      }
    }
    return edges;
  }, [projects]);

  const presentEdgeKeys = useMemo(
    () => new Set(project.blueprint.edges.map(edgeKey)),
    [project]
  );

  // Todos os projetos têm `api`. O fallback ao centro é defesa, não expectativa.
  const hub = useMemo(
    () => project.blueprint.nodes.find((node) => node.role === "api") ?? { x: 50, y: 50 },
    [project]
  );

  /**
   * Único canal do diagrama para leitor de tela — o desenho todo é aria-hidden.
   * Precisa incluir as CONEXÕES: um inventário de peças sem as ligações omite
   * justamente a informação que um diagrama de arquitetura existe para passar.
   */
  const textAlternative = useMemo(() => {
    const labelOf = (role: NodeRole) =>
      project.blueprint.nodes.find((candidate) => candidate.role === role)?.label ?? role;
    const parts = project.blueprint.nodes.map((node) => `${node.label} em ${node.tech}`);
    const links = project.blueprint.edges.map(
      (edge) => `${labelOf(edge.from)} conecta em ${labelOf(edge.to)}`
    );
    return (
      `Arquitetura do projeto ${project.name}: ` +
      `${project.blueprint.nodes.length} componentes — ${parts.join(", ")}. ` +
      `${links.length} conexões: ${links.join("; ")}.`
    );
  }, [project]);

  return (
    <div className="bp-canvas">
      <p className="sr-only" aria-live="polite">
        {textAlternative}
      </p>

      <span className="bp-mark bp-mark--tl" aria-hidden="true" />
      <span className="bp-mark bp-mark--tr" aria-hidden="true" />
      <span className="bp-mark bp-mark--bl" aria-hidden="true" />
      <span className="bp-mark bp-mark--br" aria-hidden="true" />

      {/*
        A área de plotagem é recuada em meia largura/altura de nó. Como as
        coordenadas são percentuais dela, um nó em x=0 ou x=100 encosta na borda
        do canvas em vez de vazar — a margem some sozinha em qualquer viewport.
        O ref vive aqui porque é a origem do sistema de coordenadas das linhas.
      */}
      <div ref={ref} className="bp-plot">
        <BlueprintEdges edges={allEdges} presentKeys={presentEdgeKeys} />

        <div className="bp-nodes" aria-hidden="true">
          {NODE_ROLES.map((role) => {
            const resolved = resolveNode(projects, index, role);
            if (!resolved) return null;
            const { node, present } = resolved;
            return (
              <BlueprintNode
                key={role}
                role={role}
                label={node.label}
                tech={node.tech}
                x={present ? node.x : hub.x}
                y={present ? node.y : hub.y}
                present={present}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
