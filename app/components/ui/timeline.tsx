"use client";
import {
  useMotionValueEvent,
  useScroll,
  useTransform,
  motion,
  useInView,
} from "motion/react";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

const TimelineItem = ({ 
  item, 
  index 
}: { 
  item: TimelineEntry; 
  index: number;
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(itemRef, { 
    once: false,
    margin: "-100px 0px -100px 0px"
  });

  // Animação do ponto da timeline
  const dotVariants = {
    hidden: { 
      scale: 0,
      opacity: 0,
    },
    visible: { 
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 20,
        delay: 0.1
      }
    },
    exit: {
      scale: 0,
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  // Animação do título do ano
  const titleVariants = {
    hidden: { 
      opacity: 0,
      x: -50,
      filter: "blur(10px)"
    },
    visible: { 
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
        delay: 0.2
      }
    },
    exit: {
      opacity: 0,
      x: -30,
      filter: "blur(5px)",
      transition: {
        duration: 0.3
      }
    }
  };

  // Animação do conteúdo (card)
  const contentVariants = {
    hidden: { 
      opacity: 0,
      x: 100,
      y: 50,
      scale: 0.8,
      rotateY: -15,
      filter: "blur(10px)"
    },
    visible: { 
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotateY: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 20,
        delay: 0.3,
        opacity: { duration: 0.4 }
      }
    },
    exit: {
      opacity: 0,
      x: 50,
      y: 30,
      scale: 0.9,
      filter: "blur(8px)",
      transition: {
        duration: 0.4,
        ease: "easeInOut" as const
      }
    }
  };

  return (
    <motion.div
      ref={itemRef}
      className="flex justify-start pt-10 md:pt-40 md:gap-10"
      initial="hidden"
      animate={isInView ? "visible" : "exit"}
    >
      <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full md:min-w-[250px]">
        <motion.div 
          className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white dark:bg-black flex items-center justify-center"
          variants={dotVariants}
        >
          <motion.div 
            className="h-4 w-4 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 p-2"
            animate={isInView ? {
              boxShadow: [
                "0 0 0 0 rgba(147, 51, 234, 0.4)",
                "0 0 0 10px rgba(147, 51, 234, 0)",
              ],
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop"
            }}
          />
        </motion.div>
        <motion.h3 
          className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold text-neutral-500 dark:text-neutral-500 cherry-bomb-one-regular"
          variants={titleVariants}
        >
          {item.title}
        </motion.h3>
      </div>

      <div className="relative pl-20 pr-4 md:pl-4 w-full max-w-4xl">
        <motion.h3 
          className="md:hidden block text-2xl mb-4 text-left font-bold text-neutral-500 dark:text-neutral-500 cherry-bomb-one-regular"
          variants={titleVariants}
        >
          {item.title}
        </motion.h3>
        <motion.div
          variants={contentVariants}
          style={{ perspective: 1000 }}
        >
          {item.content}
        </motion.div>
      </div>
    </motion.div>
  );
};

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
      <motion.div 
        className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h2 
          className="cherry-bomb-one-regular text-4xl md:text-5xl mb-4 text-black dark:text-white max-w-4xl"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Trajetória de Desenvolvimento
        </motion.h2>
        <motion.p 
          className="text-neutral-700 dark:text-neutral-300 text-base md:text-lg max-w-2xl"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Minha jornada profissional desde 2022 até hoje.
        </motion.p>
      </motion.div>

      <div ref={ref} className="relative max-w-[1400px] mx-auto pb-20">
        {data.map((item, index) => (
          <TimelineItem key={index} item={item} index={index} />
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
