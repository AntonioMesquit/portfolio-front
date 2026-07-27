import { markPath } from "./mark-path";

/**
 * A marca: os óculos redondos.
 *
 * É o elemento que aparece em todos os desenhos do site — no retrato da home e
 * nos três da carta. Serve como marca porque é a única forma que já significa
 * "Antonio" dentro deste sistema, e porque não tem uma letra sequer: modelo de
 * imagem erra lettering, e um monograma torto seria pior que tipo limpo.
 *
 * Saiu do mesmo pipeline dos desenhos (Higgsfield → limiar → potrace), então é
 * literalmente a mesma tinta. Camada única, preenchida, estática: o header é a
 * única coisa da tela que não é folha, e ele não se move.
 *
 * `currentColor` faz a marca seguir a cor do lockup sem uma linha de CSS a mais.
 * `aria-hidden` porque o nome acessível vem do texto real ao lado.
 */
export function Mark({ size = 18 }: { size?: number }) {
  return (
    <svg
      viewBox={markPath.viewBox}
      width={size}
      height={(size * 291) / 720}
      aria-hidden="true"
      focusable="false"
      className="rg-mark"
    >
      <path d={markPath.paths.join(" ")} fillRule="evenodd" fill="currentColor" />
    </svg>
  );
}
