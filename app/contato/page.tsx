import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";

export const metadata: Metadata = generatePageMetadata("/contato");

export default function Contato() {
  return (
    <div className="min-h-screen w-full text-white">
      <h1>Contato</h1>
      {/* Página de contato será implementada aqui */}
    </div>
  );
}
