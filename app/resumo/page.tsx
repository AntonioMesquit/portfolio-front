import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";

export const metadata: Metadata = generatePageMetadata("/resumo");

export default function Resumo() {
  return (
    <div className="min-h-screen w-full text-white">
      <h1>Resumo</h1>
      {/* Página de resumo da carreira será implementada aqui */}
    </div>
  );
}
