"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/** Quanto sobra de um bloco quando ele colapsa. Fica um fio, não some. */
const RULE = 0.006;
const COLLAPSE = 0.24;
const OPEN = 0.36;
const PAGE = "#page-root";

/**
 * DISTRIBUIR O TIPO — a transição entre rotas.
 *
 * A página não desliza, não é coberta e não pisca. Ela é DESMONTADA como
 * tipografia: cada bloco colapsa na própria linha, de baixo para cima, até
 * sobrar uma pilha de fios de tinta sobre o papel. Os fios apagam, a rota
 * troca escondida, e a página nova se ABRE a partir de fios, de cima para
 * baixo — o gesto de distribuir o tipo na gaveta e recompor a forma.
 *
 * As duas versões anteriores eram cortinas: um traço passando por cima de uma
 * troca já feita, e depois uma chapa diagonal cobrindo a tela. Cortina é
 * decoração aplicada por fora. Isto é feito do material da própria página —
 * blocos e fios de 1px, que é do que o site inteiro é feito.
 *
 * Sem <ViewTransition> do React porque ele não existe nesta instalação:
 * react 19.2.3 estável exporta só `startTransition` e `useTransition`.
 */
export function RegisterTransition() {
  const pathname = usePathname();
  const router = useRouter();
  const covered = useRef(false);
  const busy = useRef(false);
  const firstRender = useRef(true);

  const reduced = useCallback(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  /**
   * Os blocos que colapsam.
   *
   * Preferimos os marcados com `data-tx` nas páginas já redesenhadas. Onde não
   * houver marcação (blog, admin), o alvo é a raiz inteira: um bloco só, mesmo
   * gesto, menos detalhe — degrada, não quebra.
   */
  const blocks = useCallback((): HTMLElement[] => {
    const root = document.querySelector<HTMLElement>(PAGE);
    if (!root) return [];
    const marked = Array.from(root.querySelectorAll<HTMLElement>("[data-tx]"));
    if (marked.length) return marked;
    const child = root.firstElementChild as HTMLElement | null;
    return child ? [child] : [root];
  }, []);

  /* ---- saída: colapsar em fios, de baixo para cima ----------------------- */
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement | null)?.closest("a");
      if (!anchor || (anchor.target && anchor.target !== "_self")) return;
      if (anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("/") || href.startsWith("//")) return;

      const url = new URL(href, window.location.origin);
      if (url.pathname === window.location.pathname || url.hash) return;
      if (reduced() || busy.current) return;

      // Captura + stopPropagation: o <Link> do Next tem handler no próprio <a>,
      // e na fase de bubble ele navegaria antes de a saída começar.
      event.preventDefault();
      event.stopPropagation();
      busy.current = true;

      const items = blocks();
      gsap
        .timeline({
          onComplete: () => {
            covered.current = true;
            router.push(url.pathname + url.search);
          },
        })
        .to(items, {
          scaleY: RULE,
          opacity: 0.55,
          duration: COLLAPSE,
          ease: "power2.in",
          transformOrigin: "center center",
          // De cima para baixo: quem está na tela colapsa PRIMEIRO. Com
          // "from: end" os primeiros a fechar eram os blocos do rodapé, fora
          // da vista, e a transição parecia travada por 300ms antes de
          // qualquer coisa acontecer.
          stagger: { each: 0.02, from: "start" },
        })
        // Os fios permanecem por um instante e então apagam. É esse respiro que
        // faz o gesto ler como "a página virou tipo solto".
        .to(items, { opacity: 0, duration: 0.14, ease: "none" }, ">-0.02");
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router, reduced, blocks]);

  /* ---- entrada: abrir a partir de fios, de cima para baixo ---------------- */
  useGSAP(
    () => {
      if (firstRender.current) {
        firstRender.current = false;
        return;
      }

      const items = blocks();
      if (!items.length) return;

      if (reduced()) {
        gsap.set(items, { clearProps: "all" });
        return;
      }

      // Botão voltar: não houve colapso, então não há o que reabrir.
      if (!covered.current) {
        gsap.fromTo(
          items,
          { opacity: 0, y: 8 },
          {
            opacity: 1,
            y: 0,
            duration: 0.28,
            ease: "power2.out",
            stagger: 0.02,
            clearProps: "all",
          }
        );
        return;
      }
      covered.current = false;

      gsap.fromTo(
        items,
        { scaleY: RULE, opacity: 0, transformOrigin: "center center" },
        {
          scaleY: 1,
          opacity: 1,
          duration: OPEN,
          ease: "power3.out",
          stagger: { each: 0.03, from: "start" },
          clearProps: "all",
          onComplete: () => {
            busy.current = false;
          },
        }
      );
    },
    { dependencies: [pathname] }
  );

  // Se algo travar no meio, a página nunca fica colapsada.
  useEffect(() => {
    const guard = window.setTimeout(() => {
      if (!busy.current) return;
      busy.current = false;
      covered.current = false;
      gsap.set(blocks(), { clearProps: "all" });
    }, 3000);
    return () => window.clearTimeout(guard);
  }, [pathname, blocks]);

  return null;
}
