"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Duração da passada da barra pela primeira tela. */
const PRESS_DURATION = 1.05;

/**
 * Carimba a hora da impressão. Uma vez, por textContent, e congela.
 *
 * Fica fora do React de propósito: o HTML servido traz `--:--:--`, então não há
 * divergência de hidratação entre servidor e cliente, e o valor nunca mais muda.
 */
function stampTime(root: HTMLElement) {
  const now = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date());
  root.querySelectorAll<HTMLElement>("[data-print-time]").forEach((el) => {
    el.textContent = now;
  });
}

/**
 * A prensa.
 *
 * Um verbo só: revelar por corte horizontal. Uma barra de 1px desce em
 * velocidade constante e cada bloco imprime no instante em que ela o cruza — a
 * posição é calculada, não coreografada. Nenhum translateY, nenhum fade-up
 * escalonado, nenhuma repetição infinita. Depois de ~1,3s a página está impressa
 * e parada para sempre.
 */
export function usePrintRun() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      stampTime(root);

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        root.classList.add("is-printed");
        gsap.fromTo(root, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "none" });
        return;
      }

      const prints = gsap.utils.toArray<HTMLElement>("[data-print]", root);
      const rules = gsap.utils.toArray<HTMLElement>("[data-rule]", root);

      // Espelhar o estado armado do CSS em estilo INLINE, de forma síncrona, e
      // só depois soltar a classe. Sem essa ordem, o clearProps no fim de cada
      // tween devolveria o elemento à regra do CSS e ele sumiria de novo.
      gsap.set(prints, { clipPath: "inset(0 0 100% 0)" });
      gsap.set(rules, { scaleX: 0, transformOrigin: "left center" });
      root.classList.add("is-printed");

      // Rede de segurança: se as fontes nunca resolverem, a página aparece.
      const bail = window.setTimeout(() => {
        gsap.set([...prints, ...rules], {
          clipPath: "none",
          scaleX: 1,
          clearProps: "all",
        });
      }, 2000);

      const reveal = (el: HTMLElement, at?: number, tl?: gsap.core.Timeline) => {
        const vars: gsap.TweenVars = el.hasAttribute("data-rule")
          ? { scaleX: 1, duration: 0.5, ease: "power4.out", clearProps: "transform" }
          : {
              clipPath: "inset(0 0 0% 0)",
              duration: 0.45,
              ease: "power3.out",
              clearProps: "clipPath",
            };
        if (tl && at !== undefined) tl.to(el, vars, at);
        else gsap.to(el, vars);
      };

      // Só a MEDIÇÃO espera as fontes: sem isso o layout muda debaixo da
      // timeline e a barra revela blocos na altura errada.
      void Promise.race([
        document.fonts.ready,
        new Promise((resolve) => window.setTimeout(resolve, 600)),
      ]).then(() => {
        window.clearTimeout(bail);
        if (!rootRef.current) return;

        const viewport = window.innerHeight;
        const top0 = root.getBoundingClientRect().top + window.scrollY;
        const timeline = gsap.timeline();

        // Velocidade constante: máquina não acelera para ficar bonita. É o
        // ease "none" que faz a barra ler como rolo de impressão.
        timeline.to(".ed-press", { y: viewport, duration: PRESS_DURATION, ease: "none" }, 0);

        for (const el of [...prints, ...rules]) {
          const y = el.getBoundingClientRect().top + window.scrollY - top0;
          if (y < viewport) {
            // Na primeira tela: entra na timeline, no instante em que a barra cruza.
            reveal(el, (y / viewport) * PRESS_DURATION, timeline);
          } else {
            // Abaixo da dobra: agendar aqui os poria em t≈3,5s, brigando com o
            // scroll que já aconteceu. Vão para o ScrollTrigger.
            ScrollTrigger.create({
              trigger: el,
              start: "top 90%",
              once: true,
              onEnter: () => reveal(el),
            });
          }
        }

        timeline.to(".ed-press", { autoAlpha: 0, duration: 0.2 }, PRESS_DURATION);
      });
    },
    { scope: rootRef }
  );

  return rootRef;
}
