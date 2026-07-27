"use client";

import { useEffect, useRef } from "react";

/**
 * O fio do cabeçalho entintando conforme você lê.
 *
 * Não é uma barra de progresso colada no topo da tela: é o MESMO fio de um
 * pixel que já fecha o cabeçalho, ganhando tinta da esquerda para a direita.
 * Por isso a posição é MEDIDA a partir da barra (`.rg-bar`) em vez de escrita
 * como número mágico — se o cabeçalho mudar de altura, o fio continua em cima
 * dele.
 *
 * O progresso é do ARTIGO, não da página: começa em zero quando o corpo do
 * texto entra na tela e chega a um quando o último parágrafo sai. Medir contra
 * a altura do documento contaria rodapé e navegação como leitura.
 */
export function ReadingRule({ targetId }: { targetId: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rule = ref.current;
    if (!rule) return;

    // Sem guarda de prefers-reduced-motion: o fio não anima sozinho, ele
    // acompanha a rolagem. Não há movimento que o usuário não tenha causado.
    let frame = 0;
    let alvoTop = 0;
    let alvoAltura = 1;

    const medir = () => {
      const alvo = document.getElementById(targetId);
      if (alvo) {
        const box = alvo.getBoundingClientRect();
        alvoTop = box.top + window.scrollY;
        alvoAltura = Math.max(1, box.height - window.innerHeight * 0.6);
      }
      const barra = document.querySelector(".rg-bar");
      const base = barra ? barra.getBoundingClientRect().bottom : 0;
      rule.style.top = `${Math.max(0, Math.round(base) - 2)}px`;
    };

    const pintar = () => {
      const lido = (window.scrollY - alvoTop) / alvoAltura;
      const p = Math.min(1, Math.max(0, lido));
      rule.style.transform = `scaleX(${p})`;
      // Antes do artigo começar não existe leitura para mostrar, e um fio de
      // largura zero piscando no canto esquerdo é ruído.
      rule.style.opacity = p > 0.001 ? "1" : "0";
    };

    const aoRolar = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(pintar);
    };

    const aoRedimensionar = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        medir();
        pintar();
      });
    };

    medir();
    pintar();

    // A fonte real reflui o texto e muda a altura do artigo; sem isto o fio
    // fica calibrado para o layout da fonte de fallback.
    void document.fonts?.ready.then(aoRedimensionar);

    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", aoRedimensionar);

    const alvo = document.getElementById(targetId);
    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(aoRedimensionar)
        : null;
    if (alvo && observer) observer.observe(alvo);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("resize", aoRedimensionar);
      observer?.disconnect();
    };
  }, [targetId]);

  return <div className="cd-rule-lida" ref={ref} aria-hidden="true" />;
}
