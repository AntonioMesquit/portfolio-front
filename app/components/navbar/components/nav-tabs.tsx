"use client";

import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { navItems } from "./types";

gsap.registerPlugin(useGSAP);

/**
 * Ativo por SEGMENTO, não por prefixo.
 *
 * `pathname.startsWith(href)` acendia "Sobre" quando o usuário estava em
 * /sobre-o-site, porque "/sobre-o-site".startsWith("/sobre") é verdadeiro.
 */
function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavTabs() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const inkRef = useRef<HTMLSpanElement>(null);

  /**
   * A barra de tinta não some de uma aba e reaparece na outra: ela escorrega —
   * e chega fora de registro, passa do destino e volta. Mesmo erro, mesma
   * correção que a página inteira faz, na escala de um fio de 2px.
   */
  const placeInk = useCallback(
    (animate: boolean) => {
      const nav = navRef.current;
      const ink = inkRef.current;
      if (!nav || !ink) return;

      const active = nav.querySelector<HTMLAnchorElement>('[aria-current="page"]');
      if (!active) {
        gsap.set(ink, { autoAlpha: 0 });
        return;
      }

      const navBox = nav.getBoundingClientRect();
      const box = active.getBoundingClientRect();
      const to = { x: box.left - navBox.left, width: box.width, autoAlpha: 1 };

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!animate || reduce) {
        gsap.set(ink, to);
        return;
      }
      gsap.to(ink, { ...to, duration: 0.36, ease: "back.out(1.4)" });
    },
    []
  );

  useGSAP(
    () => {
      placeInk(true);
    },
    { dependencies: [pathname] }
  );

  // A mono reflui quando a fonte real chega, e a barra ficaria torta. Mesma
  // armadilha que o use-print-run já documenta.
  useEffect(() => {
    let frame = 0;
    const settle = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => placeInk(false));
    };
    void document.fonts.ready.then(settle);

    const nav = navRef.current;
    const observer =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(settle) : null;
    if (nav && observer) observer.observe(nav);
    window.addEventListener("resize", settle);

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("resize", settle);
    };
  }, [placeInk]);

  return (
    <nav className="rg-tabs" aria-label="Seções" ref={navRef}>
      {navItems.map((item, index) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className="rg-tab"
            aria-current={active ? "page" : undefined}
          >
            <span className="rg-tab__num">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="rg-tab__name">{item.label}</span>
          </Link>
        );
      })}
      {/*
        Fora do fluxo, largura zero até o JS medir — então sem JS ela
        simplesmente não aparece, e a aba ativa continua identificada pelo
        aria-current e pelo peso da tinta no rótulo. Nada de fallback em
        box-shadow: duas barras desenhadas pelo mesmo motivo se sobreporiam
        no instante em que o JS medisse.
      */}
      <span className="rg-tabs__ink" aria-hidden="true" ref={inkRef} />
    </nav>
  );
}
