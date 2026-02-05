"use client";

import { motion } from "framer-motion";
import { Code2 } from "lucide-react";
import { Project } from "./project-card";

interface ProjectInfoProps {
  project: Project;
}

export default function ProjectInfo({ project }: ProjectInfoProps) {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800"
      >
        <Code2 className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
        <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
          {project.name}
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="text-3xl md:text-4xl lg:text-5xl font-bold text-black dark:text-white leading-tight cherry-bomb-one-regular"
        style={{ color: project.color }}
      >
        {project.name}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400"
      >
        {project.description}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="space-y-4 text-base md:text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed"
      >
        <p>{project.longDescription}</p>
      </motion.div>
    </div>
  );
}
