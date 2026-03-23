"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Project } from "./project-card";

interface ProjectInfoProps {
  project: Project;
}

export default function ProjectInfo({ project }: ProjectInfoProps) {
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-700/80 shadow-lg shadow-black/5"
      >
        <div
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: project.color }}
        />
        <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-widest">
          {project.name}
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight cherry-bomb-one-regular"
        style={{ color: project.color }}
      >
        {project.name}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-base sm:text-lg md:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed"
      >
        {project.description}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="space-y-3 md:space-y-4 text-sm sm:text-base md:text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed"
      >
        <p>{project.longDescription}</p>
      </motion.div>

      {/* Tecnologias */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="pt-4 md:pt-6 space-y-3 md:space-y-4"
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="p-2 rounded-xl"
            style={{
              backgroundColor: hexToRgba(project.color, 0.15),
            }}
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <Sparkles
              className="w-4 h-4"
              style={{ color: project.color }}
            />
          </motion.div>
          <span className="text-sm font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-widest">
            Tecnologias
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech, i) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.45 + i * 0.03, duration: 0.3 }}
              whileHover={{
                scale: 1.05,
                y: -2,
                boxShadow: `0 8px 25px ${hexToRgba(project.color, 0.25)}`,
              }}
              className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm font-semibold bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm border text-neutral-700 dark:text-neutral-300 transition-all duration-300"
              style={{
                borderColor: hexToRgba(project.color, 0.35),
              }}
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
