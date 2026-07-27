/**
 * Registro de capas a nanquim.
 *
 * O post declara uma CHAVE, não um caminho de imagem. Chave desconhecida —
 * inclusive vinda da API, que não sabe deste registro — simplesmente não
 * renderiza figura. Nada quebra e nada some do texto.
 *
 * ARQUIVO, não inline. A primeira versão embutia os contornos como <path> no
 * componente. A capa tem 422 traços: inline, o Next serializa isso duas vezes
 * (markup + payload RSC) e o custo entra no HTML de toda visita. Capa de artigo
 * não se anima, então não precisa dos caminhos separados em runtime — só de um
 * arquivo que o navegador cacheia. Os desenhos da carta continuam inline porque
 * aqueles SE DESENHAM com o scroll, e para isso o traço precisa ser elemento.
 */
const COVERS = {
  autos: {
    src: "/ink/autos.svg",
    width: 1179,
    height: 692,
    alt: "Desenho a nanquim: cinco maços de papel amarrados lado a lado, cada um com o próprio cordão subindo reto, sem nenhum cordão cruzar com o do maço vizinho. Do maço do meio sai uma folha com um trecho marcado a caneta.",
    caption:
      "Cinco maços, cinco cordões. Nenhum encosta no outro — é essa a arquitetura descrita abaixo.",
  },
} as const;

export type CoverKey = keyof typeof COVERS;

export function hasCover(key?: string | null): key is CoverKey {
  return Boolean(key && key in COVERS);
}

export interface PostCoverProps {
  cover: CoverKey;
  /** Sem legenda no índice: lá a figura é chamada, não documento. */
  withCaption?: boolean;
  /** A capa da manchete é a primeira imagem da tela; a do artigo não. */
  priority?: boolean;
}

export function PostCover({
  cover,
  withCaption = true,
  priority = false,
}: PostCoverProps) {
  const { src, width, height, alt, caption } = COVERS[cover];

  return (
    <figure className="cd-cover">
      {/*
        width/height explícitos reservam a caixa antes do arquivo chegar — sem
        eles a página pula quando a figura carrega.
        eslint-disable-next-line @next/next/no-img-element -- SVG estático já
        otimizado; next/image não tem o que fazer com vetor.
      */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="cd-cover__img"
        src={src}
        width={width}
        height={height}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
      />
      {withCaption && (
        <figcaption className="cd-cover__caption">{caption}</figcaption>
      )}
    </figure>
  );
}
