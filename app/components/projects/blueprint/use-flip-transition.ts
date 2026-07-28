"use client";

import { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";
import { orthogonalPath, toLocalBox, type Box } from "./geometry";

gsap.registerPlugin(Flip, useGSAP);

const FLIP_DURATION = 0.95;
const FLIP_EASE = "power3.inOut";

/** ~3s a 60fps. Teto do laço que espera a transição de rota terminar. */
const SETTLE_FRAME_CAP = 180;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Orquestra a remontagem da prancha quando o projeto muda.
 *
 * O contrato com quem usa é de duas etapas, que é o padrão do Flip em React:
 * chame `capture()` ANTES de mudar o índice (para ler o DOM no estado antigo),
 * e deixe o efeito interno, disparado pela mudança de `index`, tocar a animação.
 *
 * Quem move os nós é o Flip. Quem mantém as linhas coladas neles é o `onUpdate`,
 * que relê as posições reais a cada frame — é por isso que as conexões
 * acompanham o voo em vez de piscar no lugar novo.
 */
export function useFlipTransition(index: number) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<Flip.FlipState | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const previousEdgeKeys = useRef<Set<string> | null>(null);

  /**
   * Redesenha todas as conexões a partir da posição real dos nós no DOM.
   * Chamada a cada frame durante o voo, e também no mount e no resize.
   */
  const syncEdges = useCallback(() => {
    const root = containerRef.current;
    if (!root) return;

    const containerRect = root.getBoundingClientRect();
    if (containerRect.width === 0) return;

    // Todas as leituras primeiro, todas as escritas depois: um só reflow por frame.
    const boxes = new Map<string, Box>();
    root.querySelectorAll<HTMLElement>("[data-flip-id]").forEach((el) => {
      const id = el.dataset.flipId;
      if (id) boxes.set(id, toLocalBox(el.getBoundingClientRect(), containerRect));
    });

    root.querySelectorAll<SVGPathElement>("path[data-edge-key]").forEach((path) => {
      const key = path.dataset.edgeKey;
      if (!key) return;
      const separator = key.indexOf("->");
      const from = boxes.get(key.slice(0, separator));
      const to = boxes.get(key.slice(separator + 2));
      path.setAttribute("d", from && to ? orthogonalPath(from, to) : "");
    });
  }, []);

  /**
   * Adia a primeira medição até o ancestral parar de deformar.
   *
   * `getBoundingClientRect` enxerga transform — e é exatamente isso que se quer
   * durante o voo do Flip: as linhas acompanham os nós porque leem a posição já
   * transformada. No primeiro render, porém, quem está transformando não é o
   * Flip: é a transição de rota, que abre a página inteira a partir de
   * `scaleY: 0.006` em cada bloco `[data-tx]` — e `.bp-stage` é ancestral desta
   * prancha.
   *
   * Medir naquele instante devolve os nós empilhados a 0,6% da altura. Aí
   * `orthogonalPath` descarta como sobrepostos os pares que só se distinguem na
   * vertical (`MIN_SPAN`), e as conexões nascem sem `d` ou apontando para o topo
   * da folha.
   *
   * E não se consertavam sozinhas: o ResizeObserver abaixo observa a caixa de
   * LAYOUT, que transform nenhum altera. Sem isto, o diagrama só se acertava
   * quando o usuário trocava de projeto — que é o que disparava um novo sync.
   *
   * São dois testes, e nenhum basta sozinho:
   *
   * 1. Altura visual contra altura de LAYOUT, com folga de 1px. Pega a
   *    deformação grosseira. Não pode ser exato: `offsetHeight` é inteiro e
   *    `getBoundingClientRect` é fracionário, então sem transform nenhum eles
   *    já diferem até meio pixel.
   * 2. Altura visual parada por dois quadros. A folga do teste 1 libera a
   *    medição ainda na cauda do easing, e os nós assentam meio pixel depois —
   *    invisível, mas é diferença real entre entrar na rota e trocar de projeto.
   *
   * O teto de quadros existe para isto nunca virar laço eterno se alguma
   * transição não terminar.
   */
  const settleFrame = useRef(0);

  const syncWhenSettled = useCallback(() => {
    cancelAnimationFrame(settleFrame.current);
    let frames = 0;
    let lastHeight = -1;
    let stable = 0;

    const tick = () => {
      const root = containerRef.current;
      if (!root) return;

      const visual = root.getBoundingClientRect().height;
      const deformed = Math.abs(visual - root.offsetHeight) >= 1;
      stable = visual === lastHeight ? stable + 1 : 0;
      lastHeight = visual;

      if ((!deformed && stable >= 2) || frames++ > SETTLE_FRAME_CAP) {
        syncEdges();
        return;
      }
      settleFrame.current = requestAnimationFrame(tick);
    };

    settleFrame.current = requestAnimationFrame(tick);
  }, [syncEdges]);

  useEffect(() => () => cancelAnimationFrame(settleFrame.current), []);

  /** Lê o estado atual do DOM. Precisa rodar antes do re-render do React. */
  const capture = useCallback(() => {
    const root = containerRef.current;
    if (!root) return;
    stateRef.current = Flip.getState(root.querySelectorAll("[data-flip-id]"), {
      props: "opacity",
    });
  }, []);

  useGSAP(
    () => {
      const root = containerRef.current;
      if (!root) return;

      // O React já trocou data-present e as posições; alinhar as linhas ao novo estado.
      syncEdges();

      const currentEdgeKeys = new Set<string>();
      root
        .querySelectorAll<SVGPathElement>('path[data-edge-key][data-present="true"]')
        .forEach((path) => {
          if (path.dataset.edgeKey) currentEdgeKeys.add(path.dataset.edgeKey);
        });

      const state = stateRef.current;
      stateRef.current = null;

      // Primeiro render: nada a animar, só registrar a linha de base — e
      // remedir quando a transição de rota devolver a folha ao tamanho real.
      if (!state) {
        previousEdgeKeys.current = currentEdgeKeys;
        syncWhenSettled();
        return;
      }

      const previous = previousEdgeKeys.current ?? new Set<string>();
      previousEdgeKeys.current = currentEdgeKeys;

      timelineRef.current?.kill();

      // kill() interrompe tweens mas NÃO reverte estilos. Sem esta limpeza, uma
      // aresta pega no meio do fade fica com `opacity` inline para sempre — e o
      // ramo de reduced-motion abaixo retorna antes de qualquer limpeza.
      gsap.set(root.querySelectorAll("path[data-edge-key]"), {
        clearProps: "opacity",
      });

      // Repouso das arestas: um número só, morando no CSS.
      const restOpacity =
        parseFloat(getComputedStyle(root).getPropertyValue("--bp-edge-opacity")) || 0.9;

      if (prefersReducedMotion()) {
        // Sem voo: corte com um crossfade curto, e as linhas já no lugar certo.
        timelineRef.current = null;
        gsap.fromTo(
          root.querySelectorAll('[data-flip-id][data-present="true"]'),
          { opacity: 0 },
          { opacity: 1, duration: 0.2, ease: "none", clearProps: "opacity" }
        );
        return;
      }

      const entering: SVGPathElement[] = [];
      const leaving: SVGPathElement[] = [];
      root.querySelectorAll<SVGPathElement>("path[data-edge-key]").forEach((path) => {
        const key = path.dataset.edgeKey;
        if (!key) return;
        const isPresent = currentEdgeKeys.has(key);
        const wasPresent = previous.has(key);
        if (isPresent && !wasPresent) entering.push(path);
        else if (!isPresent && wasPresent) leaving.push(path);
      });

      // Conexões que ficam já acompanham o voo pelo onUpdate. As que entram
      // esperam os nós assentarem; as que saem apagam antes de tudo começar.
      gsap.set(entering, { opacity: 0 });
      if (leaving.length) {
        // fromTo, não to: o React já commitou data-present="false" e o CSS já
        // zerou a opacidade computada, então um `to` animaria de 0 para 0.
        gsap.fromTo(
          leaving,
          { opacity: restOpacity },
          { opacity: 0, duration: 0.22, ease: "power1.out", clearProps: "opacity" }
        );
      }

      const timeline = Flip.from(state, {
        duration: FLIP_DURATION,
        ease: FLIP_EASE,
        stagger: 0.015,
        onUpdate: syncEdges,
        onComplete: () => {
          syncEdges();
          timelineRef.current = null;
        },
      });

      // Duração REAL do voo: `stagger` incide nos 14 alvos e estica a timeline
      // além de FLIP_DURATION. Ancorar os cues secundários na constante erraria
      // por ~0,2s, resolvendo o texto antes do pouso. Ler antes de anexar filhos.
      const flightEnd = timeline.duration();

      // Os rótulos dos nós que viajam mudam (NestJS -> Express). Deixar o texto
      // desfocado durante o voo e resolver na aterrissagem lê como reconfiguração,
      // não como troca de slide.
      // 0.3, não 0: `fromTo` tem immediateRender por padrão mesmo inserido numa
      // posição adiantada, então o valor inicial vale desde t=0. Com 0 as caixas
      // atravessariam a prancha vazias, só com borda e ticks.
      timeline.fromTo(
        root.querySelectorAll('[data-flip-id][data-present="true"] [data-node-text]'),
        { opacity: 0.3, filter: "blur(4px)" },
        {
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.4,
          ease: "power2.out",
          stagger: 0.02,
          clearProps: "filter,opacity",
        },
        flightEnd * 0.55
      );

      if (entering.length) {
        timeline.to(
          entering,
          {
            opacity: restOpacity,
            duration: 0.35,
            ease: "power2.out",
            clearProps: "opacity",
          },
          flightEnd * 0.7
        );
      }

      timelineRef.current = timeline;
    },
    { dependencies: [index], scope: containerRef }
  );

  // Coordenadas são percentuais: qualquer mudança de tamanho move os nós e as
  // linhas precisam ser redesenhadas.
  useEffect(() => {
    const root = containerRef.current;
    if (!root || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => syncEdges());
    observer.observe(root);
    return () => observer.disconnect();
  }, [syncEdges]);

  return { containerRef, capture };
}
