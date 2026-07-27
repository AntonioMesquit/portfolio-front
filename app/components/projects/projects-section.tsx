"use client";

import {
  useCallback,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { projectsData } from "./projects-data";
import { ProjectMeta } from "./project-meta";
import { TitleBlock } from "./title-block";
import { BlueprintDiagram } from "./blueprint/blueprint-diagram";
import { useFlipTransition } from "./blueprint/use-flip-transition";

export default function ProjectsSection() {
  const [index, setIndex] = useState(0);
  const { containerRef, capture } = useFlipTransition(index);
  const navRef = useRef<HTMLDivElement>(null);

  const total = projectsData.length;
  const project = projectsData[index];

  /**
   * Capturar ANTES de mudar o índice é o contrato do Flip: ele precisa ler o DOM
   * no estado antigo para calcular o delta de cada nó.
   */
  const goTo = useCallback(
    (next: number) => {
      const target = ((next % total) + total) % total;
      if (target === index) return;
      capture();
      setIndex(target);
    },
    [capture, index, total]
  );

  /**
   * Só `←`/`→`: a faixa é horizontal, e capturar `↑`/`↓` com preventDefault
   * roubaria a rolagem por teclado da página.
   */
  const onNavKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      let target: number | null = null;
      if (event.key === "ArrowRight") target = index + 1;
      else if (event.key === "ArrowLeft") target = index - 1;
      else if (event.key === "Home") target = 0;
      else if (event.key === "End") target = total - 1;
      if (target === null) return;

      event.preventDefault();
      const resolved = ((target % total) + total) % total;
      goTo(resolved);
      navRef.current?.querySelectorAll<HTMLButtonElement>("button")[resolved]?.focus();
    },
    [goTo, index, total]
  );

  return (
    <section className="bp-page" aria-label="Projetos">
      <div className="bp-page__inner">
        <div data-tx>
          <ProjectMeta project={project} index={index} total={total} />
        </div>

        {/*
          O acento vive na stage, não na folha: as setas são irmãs das abas e
          ficavam fora do escopo da variável, herdando o índigo da página mesmo
          com um projeto rosa ativo.
        */}
        <div
          data-tx
          className="bp-stage"
          style={
            {
              "--bp-accent": project.color,
              "--bp-accent-text": project.colorText,
            } as CSSProperties
          }
        >
          <div className="bp-sheet">
            <BlueprintDiagram ref={containerRef} projects={projectsData} index={index} />
            <TitleBlock project={project} index={index} total={total} />
          </div>

          {/*
            Grupo de botões com aria-current, e não tablist/tabpanel: o conteúdo
            que a navegação troca (nome, tagline, especificação) vive em
            ProjectMeta, fora de qualquer painel — declarar `tabpanel` na folha
            anunciaria uma relação que não existe. O anúncio da troca vem da
            região aria-live dentro do diagrama.
          */}
          <div className="bp-nav" /* wrapper visual: setas + faixa de abas */>
            <button
              type="button"
              className="bp-nav__arrow"
              onClick={() => goTo(index - 1)}
              aria-label="Projeto anterior"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>

            {/*
              O ref e o keydown ficam AQUI, não no .bp-nav: a busca por `button`
              no container externo pegaria as duas setas e deslocaria o índice de
              foco em um.
            */}
            <div
              ref={navRef}
              className="bp-nav__tabs"
              role="group"
              aria-label="Selecionar projeto"
              onKeyDown={onNavKeyDown}
            >
              {projectsData.map((candidate, position) => (
                <button
                  key={candidate.id}
                  type="button"
                  aria-current={position === index ? "true" : undefined}
                  className="bp-nav__tab"
                  onClick={() => goTo(position)}
                >
                  <span className="bp-nav__tab-number">
                    {String(position + 1).padStart(2, "0")}
                  </span>
                  <span className="bp-nav__tab-name">{candidate.name}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              className="bp-nav__arrow"
              onClick={() => goTo(index + 1)}
              aria-label="Próximo projeto"
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
