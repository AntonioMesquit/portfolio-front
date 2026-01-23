import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";

export const metadata: Metadata = generatePageMetadata("/sobre");

export default function Sobre() {
  return (
    <div className="min-h-screen w-full text-white">
      <h1>Sobre</h1>
    </div>
  );
}
