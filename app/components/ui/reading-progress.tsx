"use client";

import { motion, useScroll, useSpring } from "motion/react";

export function ReadingProgress() {
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end end"],
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="fixed left-0 top-0 z-[100] h-1 w-full bg-neutral-200/50 dark:bg-neutral-800/50">
      <motion.div
        className="h-full w-full origin-left bg-neutral-900 dark:bg-neutral-100"
        style={{ scaleX }}
      />
    </div>
  );
}
