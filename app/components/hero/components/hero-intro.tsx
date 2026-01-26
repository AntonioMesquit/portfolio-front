"use client";

import { motion } from "framer-motion";

export default function HeroIntro() {
  return (
    <>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-2xl md:text-3xl lg:text-4xl font-bold text-black leading-tight"
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Eu sou um{" "}
        </motion.span>
        <motion.span
          className="relative inline-block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <span className="relative z-10">desenvolvedor de software</span>
          <motion.svg
            className="absolute -bottom-3 left-0 w-full h-8 z-0"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
            viewBox="0 0 500 35"
            preserveAspectRatio="none"
          >
            <motion.path
              d="M 15 20 Q 60 8, 120 20 Q 180 32, 240 20 Q 300 8, 360 20 Q 420 32, 480 20"
              fill="none"
              stroke="#60A5FA"
              strokeWidth="14"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.4"
            />
          </motion.svg>
        </motion.span>
        <br />
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          que cria{" "}
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          experiências imersivas e{" "}
        </motion.span>
        <br />
        <motion.span
          className="relative inline-block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.5 }}
        >
          <span className="relative z-10">aplicações</span>
          <motion.svg
            className="absolute -bottom-1 left-0 w-full h-6 z-0"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: 1,
              opacity: 1,
            }}
            transition={{ delay: 1.3, duration: 1, ease: "easeOut" }}
            viewBox="0 0 350 30"
            preserveAspectRatio="none"
          >
            <motion.path
              d="M 5 18 Q 20 8, 35 18 Q 50 28, 65 18 Q 80 8, 95 18 Q 110 28, 125 18 Q 140 8, 155 18 Q 170 28, 185 18 Q 200 8, 215 18 Q 230 28, 245 18 Q 260 8, 275 18 Q 290 28, 305 18 Q 320 8, 335 18"
              fill="none"
              stroke="#EF4444"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={{
                d: [
                  "M 5 18 Q 20 8, 35 18 Q 50 28, 65 18 Q 80 8, 95 18 Q 110 28, 125 18 Q 140 8, 155 18 Q 170 28, 185 18 Q 200 8, 215 18 Q 230 28, 245 18 Q 260 8, 275 18 Q 290 28, 305 18 Q 320 8, 335 18",
                  "M 5 18 Q 20 12, 35 18 Q 50 24, 65 18 Q 80 12, 95 18 Q 110 24, 125 18 Q 140 12, 155 18 Q 170 24, 185 18 Q 200 12, 215 18 Q 230 24, 245 18 Q 260 12, 275 18 Q 290 24, 305 18 Q 320 12, 335 18",
                  "M 5 18 Q 20 8, 35 18 Q 50 28, 65 18 Q 80 8, 95 18 Q 110 28, 125 18 Q 140 8, 155 18 Q 170 28, 185 18 Q 200 8, 215 18 Q 230 28, 245 18 Q 260 8, 275 18 Q 290 28, 305 18 Q 320 8, 335 18",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.svg>
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          {" "}
          amigáveis ao usuário.
        </motion.span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.35, duration: 0.6 }}
        className="text-base md:text-lg text-neutral-700"
      >
        Transformo ideias em experiências digitais envolventes, com foco em
        performance, acessibilidade e detalhes visuais.
      </motion.p>
    </>
  );
}
