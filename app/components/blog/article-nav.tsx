import Link from "next/link";
import type { Post } from "../../lib/api";

interface ArticleNavProps {
  anterior: Post | null;
  proximo: Post | null;
}

/**
 * O que vem depois do fim.
 *
 * Um artigo que termina em botão de compartilhar termina em pedido. Aqui ele
 * termina em oferta: o texto vizinho, com título inteiro, para quem chegou ao
 * fim ter para onde ir sem voltar ao sumário.
 *
 * Sem "artigos relacionados" calculado por categoria — com este número de
 * textos, "relacionado" seria só uma palavra bonita para "o outro".
 */
export function ArticleNav({ anterior, proximo }: ArticleNavProps) {
  if (!anterior && !proximo) return null;

  return (
    <nav className="cd-vizinhos" aria-label="Outros artigos">
      {proximo && (
        <Link className="cd-vizinho" href={`/blog/${proximo.slug}`}>
          <span className="cd-vizinho__rotulo">Mais recente</span>
          <span className="cd-vizinho__titulo">{proximo.title}</span>
        </Link>
      )}
      {anterior && (
        <Link className="cd-vizinho cd-vizinho--fim" href={`/blog/${anterior.slug}`}>
          <span className="cd-vizinho__rotulo">Anterior</span>
          <span className="cd-vizinho__titulo">{anterior.title}</span>
        </Link>
      )}
    </nav>
  );
}
