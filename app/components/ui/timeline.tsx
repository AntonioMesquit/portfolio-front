"use client";
import {
  useMotionValueEvent,
  useScroll,
  useTransform,
  motion,
} from "motion/react";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full bg-white dark:bg-neutral-950 font-sans md:px-10"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 lg:px-10">
        <motion.h2
          className="cherry-bomb-one-regular text-4xl md:text-5xl mb-4 text-black dark:text-white max-w-4xl"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.4,
            ease: [0.25, 0.1, 0.25, 1]
          }}
        >
          Trajetória de Desenvolvimento
        </motion.h2>
        <motion.p
          className="text-neutral-700 dark:text-neutral-300 text-base md:text-lg max-w-2xl"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.4,
            delay: 0.1,
            ease: [0.25, 0.1, 0.25, 1]
          }}
        >
          Minha jornada profissional desde 2022 até hoje.
        </motion.p>
      </div>

      <div ref={ref} className="relative max-w-[1400px] mx-auto pb-20">
        {data.map((item, index) => (
          <motion.div
            key={index}
            className={`flex justify-start pt-10 md:gap-10 ${index > 0 ? 'md:pt-60' : ''}`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, amount: 0.2, margin: "-100px" }}
            transition={{ duration: 0.3 }}
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full md:min-w-[250px]">
              <motion.div
                className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white dark:bg-black flex items-center justify-center"
                initial={{ scale: 0, rotate: -90, opacity: 0 }}
                whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ 
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                  duration: 0.4
                }}
              >
                <motion.div 
                  className="h-4 w-4 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 p-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    delay: 0.1
                  }}
                />
              </motion.div>
              <motion.h3
                className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold text-neutral-500 dark:text-neutral-500 cherry-bomb-one-regular"
                initial={{ opacity: 0, x: -30, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ 
                  duration: 0.4,
                  ease: [0.25, 0.1, 0.25, 1],
                  delay: 0.05
                }}
              >
                {item.title}
              </motion.h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full max-w-4xl">
              <motion.h3
                className="md:hidden block text-2xl mb-4 text-left font-bold text-neutral-500 dark:text-neutral-500 cherry-bomb-one-regular"
                initial={{ opacity: 0, x: -20, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ 
                  duration: 0.4,
                  ease: [0.25, 0.1, 0.25, 1],
                  delay: 0.05
                }}
              >
                {item.title}
              </motion.h3>
              <motion.div
                initial={{ opacity: 0, x: 30, y: 20, scale: 0.95, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" }}
                viewport={{ once: false, amount: 0.2, margin: "-50px" }}
                transition={{ 
                  duration: 0.5,
                  ease: [0.25, 0.1, 0.25, 1],
                  delay: 0.1
                }}
              >
                {item.content}
              </motion.div>
            </div>
          </motion.div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-0% via-neutral-200 dark:via-neutral-700 to-transparent to-99%  mask-[linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0  w-[2px] bg-linear-to-t from-purple-500 via-blue-500 to-transparent from-0% via-10% rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
