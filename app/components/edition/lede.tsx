import { PortraitPlate } from "./portrait-plate";

/**
 * A capa.
 *
 * Não há corpo de texto em prosa: a linha fina e a tabela de trajetória contavam
 * os mesmos quatro fatos com palavras diferentes. Regra que fica valendo —
 * nenhum fato aparece duas vezes na página. A linha fina carrega o que a tabela
 * não consegue (voz, postura, disponibilidade); a tabela carrega o que a prosa
 * não consegue (data, empresa, stack, artefato).
 *
 * Sem byline: o folio já assinou.
 */
export function Lede() {
  return (
    <div className="ed-lede">
      <div className="ed-lede__text">
        <h1 className="ed-headline" data-print>
          Em 2022 eu era calouro. Em 2026, desenvolvedor pleno.
        </h1>
        <p className="ed-standfirst" data-print>
          Desenvolvedor no Ceará. Entrei na faculdade sem rumo nenhum e aprendi o
          ofício trabalhando. Hoje escrevo software de logística na Realize
          Software e continuo pegando freela e parceria.
        </p>
      </div>

      <div className="ed-lede__plate" data-print>
        <PortraitPlate />
      </div>
    </div>
  );
}
