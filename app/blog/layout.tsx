import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";

/**
 * A listagem do blog é `"use client"` — busca, filtro por categoria e paginação
 * acontecem no navegador. Componente de cliente não pode exportar `metadata`,
 * então a página mais compartilhável do site era a única sem título próprio:
 * herdava o do layout raiz e ia para o WhatsApp como "Antonio Mesquita".
 *
 * O layout resolve sem tirar a interatividade da página: ele é servidor, ela
 * continua cliente.
 */
export const metadata: Metadata = generatePageMetadata("/blog");

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
