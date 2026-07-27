"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  PostCard,
  BlogSidebar,
  BlogSearch,
  PostCover,
  hasCover,
} from "../components/blog";
import Link from "next/link";
import { usePosts, useCategories, useDebounce } from "../hooks";
import { queryKeys } from "../lib/query-keys";

export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const debouncedSearch = useDebounce(search, 300);

  const { data: posts = [], isLoading: postsLoading } = usePosts({
    category: selectedCategory ?? undefined,
    search: debouncedSearch || undefined,
    limit: 50,
  });

  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  // Pré-popula o cache de cada post para clique instantâneo.
  useEffect(() => {
    if (posts.length === 0) return;
    posts.forEach((post) => {
      queryClient.setQueryData(queryKeys.post(post.slug), post);
    });
  }, [posts, queryClient]);

  const loading = postsLoading || categoriesLoading;

  // A manchete só existe quando não há filtro nem busca: sob filtro, o
  // destaque brigaria com o resultado que a pessoa pediu.
  const featured =
    !debouncedSearch && !selectedCategory
      ? posts.find((p) => p.featured) ?? null
      : null;
  const listed = featured ? posts.filter((p) => p.id !== featured.id) : posts;

  const totalPostsCount =
    selectedCategory === null
      ? posts.length
      : categories.find((c) => c.slug === selectedCategory)?.post_count ?? 0;

  return (
    <div className="cd-page">
      <div className="cd-inner">
        <div data-tx>
          <div className="cd-head">
            <h1>Caderno</h1>
            <span className="cd-head__count">
              {loading
                ? "—"
                : `${posts.length} artigo${posts.length === 1 ? "" : "s"}`}
            </span>
          </div>
          <div className="cd-rule" />

          <p className="cd-lede">
            Textos sobre desenvolvimento, decisão técnica e o que eu aprendo
            construindo. Escritos em Markdown, servidos por uma API que eu também
            mantenho.
          </p>

          <BlogSearch value={search} onChange={setSearch} />

          <BlogSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            totalPostsCount={totalPostsCount}
          />
        </div>

        {/*
          Manchete do caderno: o artigo em destaque ganha a figura e o resumo
          em corpo maior. Um sumário sem nenhuma imagem é correto e frio; a
          chamada dá ao caderno o que ele não tinha.
        */}
        {!loading && featured && (
          <div className="cd-splash" data-tx>
            <Link className="cd-splash__link" href={`/blog/${featured.slug}`}>
              {hasCover(featured.cover) && (
                <PostCover cover={featured.cover} withCaption={false} />
              )}
              <div className="cd-splash__text">
                <p className="cd-splash__kbd">Em destaque</p>
                <h2 className="cd-splash__title">{featured.title}</h2>
                {featured.snippet && (
                  <p className="cd-splash__snippet">{featured.snippet}</p>
                )}
                <span className="cd-splash__cta">Ler o artigo →</span>
              </div>
            </Link>
          </div>
        )}

        <div data-tx>
          {loading ? (
            <p className="cd-empty">Carregando o caderno…</p>
          ) : listed.length === 0 && !featured ? (
            <p className="cd-empty">
              Nenhum artigo encontrado
              {debouncedSearch ? ` para “${debouncedSearch}”` : ""}.
            </p>
          ) : listed.length === 0 ? (
            /* Só o destaque existe: sem esta linha sobrava um <ol> vazio e um
               fio solto embaixo da manchete. */
            <p className="cd-empty">
              Por enquanto o caderno tem uma edição só. A próxima sai quando
              tiver o que dizer.
            </p>
          ) : (
            <ol className="cd-index">
              {/* O destaque é o item 01 do caderno mesmo sem número impresso
                  na manchete; sem o deslocamento, a lista recomeçava do 01 e
                  havia dois primeiros artigos na mesma tela. */}
              {listed.map((post, i) => (
                <PostCard key={post.id} post={post} index={featured ? i + 1 : i} />
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}
