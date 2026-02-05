"use client";

import AboutIntro from "./components/about-intro";
import AboutVisual from "./components/about-visual";

export default function AboutSection() {
  return (
    <section className="h-screen w-full bg-white overflow-hidden">
      <div className="h-full w-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start px-4 md:px-8 pt-24 md:pt-28 pb-12 md:pb-20">
        <div className="space-y-6 lg:col-span-2 lg:sticky lg:top-28 self-start">
          <AboutIntro />
        </div>
        <div className="w-full lg:col-span-3 h-full overflow-hidden">
          <AboutVisual />
        </div>
      </div>
    </section>
  );
}
