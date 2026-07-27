"use client";

import type { Project } from "./types";

export interface TitleBlockProps {
  project: Project;
  index: number;
  total: number;
}

/**
 * Cartucho — o quadro de identificação que toda prancha técnica traz no canto
 * inferior direito. É o detalhe que faz a metáfora fechar: sem ele o desenho é
 * só um diagrama bonito; com ele, é um documento.
 */
export function TitleBlock({ project, index, total }: TitleBlockProps) {
  const sheet = String(index + 1).padStart(2, "0");
  const sheets = String(total).padStart(2, "0");

  return (
    <div className="bp-titleblock" aria-hidden="true">
      <div className="bp-titleblock__row">
        <span className="bp-titleblock__key">Projeto</span>
        <span className="bp-titleblock__value bp-titleblock__value--strong">
          {project.name}
        </span>
      </div>
      <div className="bp-titleblock__row">
        <span className="bp-titleblock__key">Prancha</span>
        <span className="bp-titleblock__value">
          {sheet} / {sheets}
        </span>
      </div>
      <div className="bp-titleblock__row">
        <span className="bp-titleblock__key">Ano</span>
        <span className="bp-titleblock__value">{project.year}</span>
      </div>
      <div className="bp-titleblock__row">
        <span className="bp-titleblock__key">Nós</span>
        <span className="bp-titleblock__value">
          {String(project.blueprint.nodes.length).padStart(2, "0")}
        </span>
      </div>
      <div className="bp-titleblock__row">
        <span className="bp-titleblock__key">Stack</span>
        <span className="bp-titleblock__value">{project.technologies.length}</span>
      </div>
    </div>
  );
}
