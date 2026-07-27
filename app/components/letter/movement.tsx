import { InkFigure } from "./ink-figure";
import type { Movement as MovementData } from "./letter-data";

export interface MovementProps {
  movement: MovementData;
}

/**
 * Um movimento da carta: canhoto à esquerda, coluna de leitura à direita.
 *
 * O <h2> é heading de verdade — existe para leitor de tela e para o índice do
 * navegador — mas mora FORA da coluna de leitura. É isso que impede a página de
 * virar blog post: a prosa corre inteira, sem subtítulo cortando o texto.
 */
export function Movement({ movement }: MovementProps) {
  return (
    <section data-tx className="ct-mov" aria-labelledby={`ct-${movement.id}`}>
      <div className="ct-stub">
        <h2 id={`ct-${movement.id}`} className="ct-stub__num">
          {movement.stub}
        </h2>
        <p className="ct-stub__gloss">{movement.gloss}</p>
      </div>

      <div className="ct-body">
        {movement.paragraphs.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
        {movement.ink && <InkFigure id={movement.ink} />}
      </div>
    </section>
  );
}
