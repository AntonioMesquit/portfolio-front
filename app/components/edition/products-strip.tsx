import Link from "next/link";
import { projectsData } from "../projects/projects-data";

/**
 * Faixa horizontal, não empilhada — para não virar a terceira lista raiada
 * idêntica da página.
 *
 * Tudo é lido de `projectsData`: nome, ano e tagline. O número da folha vem do
 * mesmo `padStart(2, "0")` que `title-block.tsx` imprime no cartucho da prancha,
 * então a capa referencia a outra página pelo identificador que ela usa para si
 * mesma. Zero string redigitada.
 *
 * Há um único link, no cabeçalho. As quatro células são texto porque
 * `projects-section.tsx` guarda o projeto atual em `useState`, sem searchParams:
 * quatro links levariam todos ao primeiro projeto, e quatro âncoras com nomes
 * diferentes e o mesmo destino é defeito de acessibilidade.
 */
export function ProductsStrip() {
  const total = String(projectsData.length).padStart(2, "0");

  return (
    <section data-tx className="ed-section ed-inner" aria-labelledby="ed-prod-head">
      <div className="ed-head" data-print>
        <h2 id="ed-prod-head" className="ed-label">
          Quatro produtos
        </h2>
        <Link className="ed-link ed-head__link" href="/projetos">
          Ver as pranchas técnicas →
        </Link>
      </div>

      <div className="ed-products" data-print>
        {projectsData.map((project, index) => {
          const sheet = String(index + 1).padStart(2, "0");
          return (
            <article className="ed-product" key={project.id}>
              <span className="ed-label">{sheet}</span>
              <div className="ed-product__top">
                <h3 className="ed-product__name">{project.name}</h3>
                <span className="ed-value">{project.year}</span>
              </div>
              <p className="ed-product__tagline">{project.tagline}</p>
              <span className="ed-label">
                Fl. {sheet}/{total}
              </span>
            </article>
          );
        })}
      </div>
    </section>
  );
}
