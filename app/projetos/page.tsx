import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";

export const metadata: Metadata = generatePageMetadata("/projetos");

export default function Projetos() {
  return (
    <div className="min-h-screen w-full text-white">
      <h1>Projetos</h1>
    </div>
  );
}
