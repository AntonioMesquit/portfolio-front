import { ink01 } from "./ink/ink-01";
import { ink02 } from "./ink/ink-02";
import { ink03 } from "./ink/ink-03";
import { ALT_TEXTS, CAPTIONS } from "./letter-data";

const DRAWINGS = { "01": ink01, "02": ink02, "03": ink03 } as const;

export type InkId = keyof typeof DRAWINGS;

/** Quantos contornos a página inteira imprime. A nota de rodapé lê daqui. */
export const TOTAL_CONTOURS =
  ink01.paths.length + ink02.paths.length + ink03.paths.length;

export interface InkFigureProps {
  id: InkId;
}

/**
 * Um desenho, em duas camadas — mas o dado é servido UMA vez.
 *
 * O servidor emite só a camada de TINTA: um <path> único com fill-rule="evenodd".
 * Único porque o potrace resolve buracos (o vão das lentes, o vão entre braço e
 * tronco) como subcaminhos de winding oposto do mesmo `d`; preencher cada
 * contorno isolado transformaria todo buraco numa mancha sólida.
 *
 * A camada de TRAÇO — os 300+ paths que o scroll desenha um a um — é montada no
 * cliente, fatiando esse mesmo `d` em cada `M`. Emitir as duas no servidor
 * colocaria o mesmo dado duas vezes no HTML e dobrava a página de 300KB para
 * 650KB. Aqui o `d` viaja uma vez só, e não entra no bundle: o cliente o lê do
 * próprio DOM.
 *
 * Efeito colateral bom: sem JS, o que sobra é o desenho preenchido e correto —
 * melhor do que um contorno oco.
 */
export function InkFigure({ id }: InkFigureProps) {
  const drawing = DRAWINGS[id];

  /*
   * Só o primeiro desenho vai inline.
   *
   * Medido: o Next serializa a saída de um Server Component DUAS vezes — uma no
   * markup, outra no payload RSC de hidratação. Com os três inline o HTML de
   * /sobre ia a 331KB. O primeiro é o menor e é o que aparece mais cedo, então
   * fica; os outros dois são buscados de /ink/0N.svg quando o scroll se aproxima,
   * pagam o dado uma vez e ganham cache immutable.
   *
   * A viewBox vem do módulo mesmo assim, porque a caixa precisa reservar a
   * proporção antes de o arquivo chegar — sem isso a página saltaria.
   */
  const inline = id === "01";

  return (
    <figure className="ct-fig" data-ink-figure={id}>
      <div className="ct-fig__box">
        <svg
          className="ct-fig__svg"
          viewBox={drawing.viewBox}
          role="img"
          aria-label={ALT_TEXTS[id]}
          preserveAspectRatio="xMidYMid meet"
          {...(inline ? {} : { "data-ink-src": `/ink/${id}.svg` })}
        >
          {inline && (
            <path
              className="ct-fig__flood"
              d={drawing.paths.join(" ")}
              fillRule="evenodd"
            />
          )}
          {/* Preenchido no cliente, fatiando o `d` da camada de tinta. */}
          <g className="ct-fig__strokes" data-ink />
        </svg>
      </div>
      <figcaption className="ct-fig__caption">{CAPTIONS[id]}</figcaption>
    </figure>
  );
}
