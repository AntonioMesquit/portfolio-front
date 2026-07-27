import Link from "next/link";
import { trajectory } from "./edition-data";

/**
 * `<ol>` com subgrid, não `<table>`.
 *
 * O subgrid alinha as quatro colunas ENTRE as linhas, o que `max-content` por
 * linha não faz. E abaixo de 768px cada item empilha em quatro blocos sem que
 * nenhum papel de acessibilidade se perca — trocar `display` num `<table>`
 * remove os papéis de tabela no Chrome e no Safari, e aqui não há tabela para
 * quebrar.
 *
 * A linha de cabeçalho visual é aria-hidden: é guia de leitura, e os quatro
 * campos de cada item já leem em ordem natural.
 */
export function Trajectory() {
  return (
    <section data-tx className="ed-section ed-inner" aria-labelledby="ed-traj-head">
      <div className="ed-head" data-print>
        <h2 id="ed-traj-head" className="ed-label">
          Trajetória
        </h2>
        <Link className="ed-link ed-head__link" href="/sobre">
          A versão longa está em /sobre →
        </Link>
      </div>

      <ol className="ed-traj" data-print>
        <li className="ed-traj__row ed-traj__row--head" aria-hidden="true">
          <span className="ed-label">Período</span>
          <span className="ed-label">Onde</span>
          <span className="ed-label">Cargo</span>
          <span className="ed-label">O que fiz</span>
        </li>

        {trajectory.map((row) => (
          <li
            key={row.period}
            className={`ed-traj__row${row.current ? " ed-traj__row--current" : ""}`}
          >
            <span className="ed-value">{row.period}</span>
            <span className="ed-value">{row.where}</span>
            <span className="ed-value">{row.role}</span>
            <span className="ed-traj__what">{row.what}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
