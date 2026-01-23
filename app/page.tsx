import type { Metadata } from "next";
import { generatePageMetadata } from "./lib/metadata";

export const metadata: Metadata = generatePageMetadata("/");

import HeroSection from "./components/hero/hero-section";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-white">
      <HeroSection />
    </div>
  );
}
