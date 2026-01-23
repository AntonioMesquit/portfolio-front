"use client";

import HeroIntro from "./components/hero-intro";
import HeroVisual from "./components/hero-visual";
import StatsGrid from "./components/stats-grid";

export default function HeroSection() {
  return (
    <section className="min-h-screen w-full flex items-center justify-center px-4 md:px-8 py-12 md:py-0 bg-white">
      <div className="w-full max-w-328 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        <div className="space-y-6">
          <HeroIntro />
          <StatsGrid />
        </div>
        <HeroVisual />
      </div>
    </section>
  );
}
