"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  MarkdownContent,
  ShareButtons,
  PostLinks,
  TableOfContents,
  extractHeadings,
  stripLeadingTitle,
  PostCover,
  hasCover,
  ReadingRule,
  ArticleNav,
} from "../../components/blog";
import { usePost } from "../../hooks";
import { localNeighbors } from "../../lib/posts";
import { CONTACT } from "../../components/edition/edition-data";

/** "26 de julho de 2026" — por extenso, como a carta assina. */
function longDate(iso: string | null): string {
  if (!iso) return "sem data";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeZone: "America/Fortaleza",
  }).format(new Date(iso));
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";

  const { data: post, isLoading, isError } = usePost(slug);

  // O corpo sem o título repetido, e o sumário extraído DESSE corpo — se as
  // duas fontes divergirem, o mapeamento posicional de ids sai deslocado.
  const body = useMemo(
    () => stripLeadingTitle(post?.content ?? "", post?.title ?? ""),
    [post?.content, post?.title]
  );
  const headings = useMemo(() => extractHeadings(body), [body]);
  const vizinhos = useMemo(() => localNeighbors(slug), [slug]);

  if (isLoading) {
    return (
      <div className="cd-page">
        <div className="cd-inner">
          <p className="cd-empty">Carregando…</p>
        </div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="cd-page">
        <div className="cd-inner">
          <p className="cd-article__meta">Erro 404</p>
          <h1 className="cd-article__title">Este artigo não existe.</h1>
          <div className="cd-article__rule" />
          <Link className="ed-link cd-back" href="/blog">
            ← Voltar ao caderno
          </Link>
        </div>
      </div>
    );
  }

  const category = post.categories?.[0];

  return (
    <div className="cd-page">
      {/* O fio do cabeçalho entintando conforme o corpo do artigo passa. */}
      <ReadingRule targetId="corpo-do-artigo" />

      {/* --artigo vira grade de duas colunas em ≥1280px: texto + sumário fixo */}
      <div className="cd-inner cd-inner--artigo">
        <article className="cd-article" data-tx>
          <Link className="ed-link cd-back" href="/blog">
            ← Caderno
          </Link>

          <p className="cd-article__meta">
            {[
              category?.name,
              longDate(post.published_at),
              `${post.read_time_minutes} min de leitura`,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>

          <h1 className="cd-article__title">{post.title}</h1>
          <div className="cd-article__rule" />

          {hasCover(post.cover) && <PostCover cover={post.cover} priority />}

          <div id="corpo-do-artigo">
            <MarkdownContent
              className="cd-prose"
              content={body}
              headings={headings}
            />
          </div>

          {post.links && post.links.length > 0 && <PostLinks links={post.links} />}

          {/*
            Assinatura, não "sobre o autor".
            A carta em /sobre fecha assinada; um artigo do mesmo caderno fecha
            do mesmo jeito. Cartão de autor com foto e biografia seria um
            componente de template, e o site não tem nenhum.
          */}
          <div className="cd-assina">
            <p className="cd-assina__nome">Antonio Mesquita</p>
            <p className="cd-assina__linha">
              Escrevo aqui de vez em quando. Discordância por e-mail é bem-vinda:{" "}
              <a className="ed-link" href={`mailto:${CONTACT.email}`}>
                {CONTACT.email}
              </a>
              .
            </p>
          </div>

          <ArticleNav anterior={vizinhos.anterior} proximo={vizinhos.proximo} />

          <div className="cd-foot">
            <p className="cd-foot__label">Compartilhar</p>
            <ShareButtons title={post.title} slug={post.slug} />
          </div>
        </article>

        <TableOfContents headings={headings} />
      </div>
    </div>
  );
}
