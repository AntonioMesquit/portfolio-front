"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import antonioHomeIcon from "@/public/iconAntonioHome.png";

export default function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3, duration: 0.8 }}
      className="flex flex-col items-center lg:items-end gap-6"
    >
      <div className="relative w-full max-w-md lg:max-w-lg">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <Image
            src={antonioHomeIcon}
            alt="Antonio Mesquita"
            width={600}
            height={600}
            className="w-full h-auto object-contain"
            priority
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.6 }}
        whileHover={{ y: -6, scale: 1.01 }}
        className="animated-card cherry-bomb-one-regular w-full max-w-md lg:max-w-lg rounded-3xl p-5 md:p-6 shadow-lg shadow-black/5 border border-white/50 backdrop-blur-sm"
        style={
          {
            "--card-from": "#F1F5FF",
            "--card-to": "#E0ECFF",
          } as CSSProperties
        }
      >
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-neutral-700/70">
            Vamos conversar
          </span>
          <span className="h-2 w-2 rounded-full bg-black/70" />
        </div>
        <div className="mt-3 text-2xl md:text-3xl font-semibold text-neutral-900">
          Me chama e vamos criar algo lindo
        </div>
        <p className="mt-2 text-sm text-neutral-700">
          Disponível para freelas e parcerias em projetos web.
        </p>
      </motion.div>
    </motion.div>
  );
}
