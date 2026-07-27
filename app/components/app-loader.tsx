"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { postsQueryOptions } from "../hooks/use-posts";
import { categoriesQueryOptions } from "../hooks/use-categories";

/**
 * Pré-carrega o blog em segundo plano.
 *
 * Antes este componente SEGURAVA a árvore inteira: `children` só montava depois
 * do fetch e de um atraso mínimo artificial de 1200 ms. O efeito colateral era
 * que o HTML servido de TODA rota era apenas um spinner — nada indexável, e um
 * piso de quase dois segundos até a página existir.
 *
 * Agora renderiza na hora e o prefetch acontece por fora. Usa `prefetchQuery`
 * com as MESMAS opções dos hooks, de propósito: semear a chave com dados crus,
 * como era feito antes, colidia com o que `usePosts` espera (já mesclado com o
 * post padrão) e fazia o artigo em destaque sumir da listagem justamente quando
 * a API estava no ar.
 */
export function AppLoader({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  useEffect(() => {
    void queryClient.prefetchQuery(postsQueryOptions({ limit: 50 }));
    void queryClient.prefetchQuery(categoriesQueryOptions());
  }, [queryClient]);

  return <>{children}</>;
}
