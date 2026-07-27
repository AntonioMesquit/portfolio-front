"use client";

import { Folio } from "./folio";
import { Lede } from "./lede";
import { Trajectory } from "./trajectory";
import { ProductsStrip } from "./products-strip";
import { Classifieds } from "./classifieds";
import { Colophon } from "./colophon";
import { usePrintRun } from "./use-print-run";

export interface EditionSectionProps {
  /** Data formatada no servidor, no fuso do Ceará. */
  printedOn: string;
}

export function EditionSection({ printedOn }: EditionSectionProps) {
  const rootRef = usePrintRun();

  return (
    <div className="ed-page" ref={rootRef}>
      {/*
        Sem JS o estado armado do CSS deixaria a página inteira invisível: cada
        [data-print] nasce com clip-path: inset(0 0 100% 0) e é o GSAP que abre.
        Este bloco desarma tudo quando não há script para imprimir.
      */}
      <noscript>
        <style>{`.ed-page [data-print]{clip-path:none}.ed-page [data-rule]{transform:none}.ed-press{display:none}`}</style>
      </noscript>

      {/*
        A barra é sempre montada — decidir por estado exigiria um efeito que
        escreve estado, e o CSS já a esconde para quem pediu menos movimento.
      */}
      <div className="ed-press" aria-hidden="true" />

      <div data-tx>
        <Folio printedOn={printedOn} />
      </div>

      <div className="ed-inner" data-tx>
        <Lede />
      </div>

      <Trajectory />
      <ProductsStrip />
      <Classifieds />
      <Colophon printedOn={printedOn} />
    </div>
  );
}
