"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Quantos contornos ficam vivos ao mesmo tempo. Maior que 1 = a mão não pula. */
const OVERLAP = 3;
/** Atraso da tinta atrás da caneta. É este número que cria o contorno seco. */
const FLOOD_LAG = 0.55;

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/**
 * A carta inka.
 *
 * Dois drivers por figura, com latências DIFERENTES — é essa diferença que
 * produz o efeito:
 *
 *   1. O CONTORNO segue a POSIÇÃO do scroll (scrub 0.3). A caneta acompanha a
 *      mão de perto: cada contorno é desenhado quando o scroll o alcança.
 *   2. A TINTA segue com ATRASO (quickTo de 0.55s). Ela persegue o contorno.
 *
 * Rolando rápido, a tinta não acompanha e você vê o desenho em traço seco.
 * Parando, ela alcança em meio segundo e inunda. A página recompensa quem
 * desacelera, que é literalmente o que uma carta pede.
 *
 * Ao ATRAVESSAR a figura inteira, o contorno trava (`latched`) e nunca mais se
 * recolhe. Subir para reler drena a tinta e deixa o risco no papel — um estado
 * que não existe na descida. Reler nunca destrói o desenho, só a densidade.
 *
 * Sem DrawSVGPlugin de propósito: o plugin mede por getTotalLength() e ignora
 * pathLength, então os dois juntos fazem o traço estalar. Com pathLength="1"
 * já no SVG, tweenar strokeDashoffset de 1 a 0 dá o mesmo desenho, sem medição
 * nenhuma e com um plugin a menos na rota.
 */
export function useInk(rootId: string) {
  useGSAP(
    () => {
      // A raiz é renderizada no servidor, então não há ref para prender nela.
      // Buscar aqui é seguro: useGSAP é layout effect, o DOM já existe. E como
      // todo seletor abaixo é escopado por `root` na mão, não é preciso `scope`.
      const root = document.getElementById(rootId);
      if (!root) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        // O estado armado vive dentro de uma media query de no-preference, então
        // não há nada a desarmar: a página já nasce completa.
        return;
      }

      root.classList.add("is-inking");

      // O fio do timbre é o único movimento não dirigido pelo scroll. Uma carta
      // já está escrita quando você a abre; só o timbre se imprime na sua frente.
      gsap.fromTo(
        root.querySelectorAll("[data-letter-rule]"),
        { scaleX: 0 },
        { scaleX: 1, duration: 0.55, ease: "power4.out", transformOrigin: "left center" }
      );

      const figures = gsap.utils.toArray<HTMLElement>("[data-ink-figure]", root);

      const SVG_NS = "http://www.w3.org/2000/svg";

      /**
       * Fatia o `d` da camada de tinta em um <path> por contorno.
       *
       * O servidor manda o dado uma vez só; os traços nascem aqui. `pathLength`
       * é escrito em cada um: é o que permite ao CSS armar 300 caminhos de
       * comprimentos diferentes com uma única declaração de dasharray, sem
       * nenhuma chamada a getTotalLength.
       */
      const sliceStrokes = (flood: SVGPathElement, target: SVGGElement) => {
        const d = flood.getAttribute("d");
        if (!d) return [];
        const fragment = document.createDocumentFragment();
        const created: SVGPathElement[] = [];
        for (const piece of d.split(/(?=M)/)) {
          const trimmed = piece.trim();
          if (trimmed.length < 8) continue;
          const path = document.createElementNS(SVG_NS, "path");
          path.setAttribute("d", trimmed);
          path.setAttribute("pathLength", "1");
          path.style.strokeDashoffset = "1";
          fragment.appendChild(path);
          created.push(path);
        }
        target.appendChild(fragment);
        return created;
      };

      /**
       * Busca a camada de tinta dos desenhos que não vieram inline.
       *
       * Só o desenho 1 é servido no HTML; os outros dois moram em /ink/0N.svg
       * para não pagar a dupla serialização do RSC. A caixa já reservou a
       * proporção, então injetar aqui não move o layout.
       */
      const ensureFlood = async (figure: HTMLElement) => {
        const svg = figure.querySelector<SVGSVGElement>("svg[data-ink-src]");
        if (!svg) return figure.querySelector<SVGPathElement>(".ct-fig__flood");

        const src = svg.getAttribute("data-ink-src");
        if (!src) return null;
        svg.removeAttribute("data-ink-src");

        try {
          const response = await fetch(src);
          if (!response.ok) return null;
          const text = await response.text();
          const d = /\sd="([^"]+)"/.exec(text)?.[1];
          if (!d) return null;

          const path = document.createElementNS(SVG_NS, "path");
          path.setAttribute("class", "ct-fig__flood");
          path.setAttribute("d", d);
          path.setAttribute("fill-rule", "evenodd");
          path.style.fillOpacity = "0";
          svg.insertBefore(path, svg.firstChild);
          return path;
        } catch {
          // Rede fora: sobra a legenda e a caixa reservada. Nada quebra.
          return null;
        }
      };

      const wire = (
        figure: HTMLElement,
        flood: SVGPathElement,
        group: SVGGElement
      ) => {
        {
          const strokes = sliceStrokes(flood, group);
          if (!strokes.length) return;

          const total = strokes.length;
          const step = 1 / (total + OVERLAP - 1);
          let latched = false;

          // OVERLAP > 1 garante que o espalhamento é maior que a duração de cada
          // contorno. Sem isso todos animam juntos e o gesto vira borrão.
          const paint = (progress: number) => {
            const p = latched ? 1 : progress;
            for (let i = 0; i < total; i++) {
              const t = clamp01((p - i * step) / (OVERLAP * step));
              strokes[i].style.strokeDashoffset = String(1 - t);
            }
          };

          const wet = { v: 0 };
          const soak = gsap.quickTo(wet, "v", {
            duration: FLOOD_LAG,
            ease: "power2.out",
            onUpdate: () => {
              flood.style.fillOpacity = String(clamp01(wet.v));
            },
          });

          ScrollTrigger.create({
            trigger: figure,
            start: "top 85%",
            end: "bottom 60%",
            scrub: 0.3,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              paint(self.progress);
              soak(self.progress);
            },
            onLeave: () => {
              latched = true;
              paint(1);
            },
          });

          paint(0);
        }
      };

      const build = () => {
        for (const figure of figures) {
          const group = figure.querySelector<SVGGElement>("[data-ink]");
          if (!group) continue;

          const inlineFlood = figure.querySelector<SVGPathElement>(".ct-fig__flood");
          if (inlineFlood) {
            wire(figure, inlineFlood, group);
            continue;
          }

          // Desenho buscado: um gatilho descartável, bem antes da dobra, só para
          // trazer o arquivo. Quando ele chega, a figura é ligada normalmente.
          ScrollTrigger.create({
            trigger: figure,
            start: "top bottom+=1200",
            once: true,
            onEnter: () => {
              void ensureFlood(figure).then((flood) => {
                if (!flood) return;
                wire(figure, flood, group);
                ScrollTrigger.refresh();
              });
            },
          });
        }
      };

      // Só a MEDIÇÃO espera as fontes: o texto reflui quando a fonte troca, e um
      // trigger criado antes disso mede a altura errada.
      let bailed = false;
      const bail = window.setTimeout(() => {
        bailed = true;
        build();
      }, 2000);

      void Promise.race([
        document.fonts.ready,
        new Promise((resolve) => window.setTimeout(resolve, 600)),
      ]).then(() => {
        if (bailed || !document.getElementById(rootId)) return;
        window.clearTimeout(bail);
        build();
      });
    },
    { dependencies: [rootId] }
  );

  // A carta é longa e o layout depende de fonte e de largura; sem isto os
  // gatilhos ficam medidos na altura de antes depois de um resize.
  useEffect(() => {
    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
}
