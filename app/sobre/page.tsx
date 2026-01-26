import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import AboutSection from "../components/about/about-section";

export const metadata: Metadata = generatePageMetadata("/sobre");

export default function Sobre() {
  return (
    <div className="min-h-screen w-full bg-white">
      <AboutSection />
    </div>
  );
}
