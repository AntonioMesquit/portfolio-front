"use client";

import { useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { Project } from "./types";

gsap.registerPlugin(useGSAP);

export interface ProjectMetaProps {
  project: Project;
  index: number;
  total: number;
}

/**
 * Coluna de texto da prancha.
 *
 * Onde antes havia badge + h1 + description + longDescription + 10 pills, agora
 * há uma única escada: índice, nome, uma linha, um parágrafo, especificação.
 * A stack vira lista numerada em monoespaçada — mesma informação das pills, com
 * uma fração do peso visual.
 */
export function ProjectMeta({ project, index, total }: ProjectMetaProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduce) {
        gsap.fromTo(
          root.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.2, ease: "none" }
        );
        return;
      }

      gsap.fromTo(
        root.current!.querySelectorAll("[data-meta-line]"),
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power3.out",
          stagger: 0.06,
          clearProps: "transform,opacity",
        }
      );
    },
    { dependencies: [index], scope: root }
  );

  return (
    <div
      ref={root}
      className="bp-meta"
      style={
        {
          "--bp-accent": project.color,
          "--bp-accent-text": project.colorText,
        } as CSSProperties
      }
    >
      <p className="bp-meta__index" data-meta-line>
        <span className="bp-meta__index-current">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="bp-meta__index-rule" aria-hidden="true" />
        <span className="bp-meta__index-total">
          {String(total).padStart(2, "0")}
        </span>
      </p>

      <h1 className="bp-meta__name" data-meta-line>
        {project.name}
      </h1>

      {/*
        O ano só é exibido no cartucho, que é decorativo (aria-hidden). Em um
        portfólio a data é conteúdo, não ornamento. `.sr-only` é position:absolute,
        então não cria linha no grid nem altera o gap.
      */}
      <p className="sr-only">Ano do projeto: {project.year}</p>

      <p className="bp-meta__tagline" data-meta-line>
        {project.tagline}
      </p>

      <p className="bp-meta__description" data-meta-line>
        {project.description}
      </p>

      <div className="bp-meta__spec" data-meta-line>
        <h2 className="bp-meta__spec-title">Especificação</h2>
        <ol className="bp-meta__spec-list">
          {project.technologies.map((technology, position) => (
            <li key={technology} className="bp-meta__spec-item">
              <span className="bp-meta__spec-number" aria-hidden="true">
                {String(position + 1).padStart(2, "0")}
              </span>
              {technology}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
