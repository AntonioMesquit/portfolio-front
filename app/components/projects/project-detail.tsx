"use client";

import { motion } from "framer-motion";
import { Monitor, ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import { Project } from "./project-card";
import ProjectFlow from "./project-flow";

interface ProjectDetailProps {
  project: Project;
}

export default function ProjectDetail({ project }: ProjectDetailProps) {
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <div className="flex flex-col">
      <div className="space-y-6 md:space-y-8 pb-8 md:pb-12">
        {/* Preview da aplicação */}
        {project.preview && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="group"
          >
            <div className="rounded-2xl sm:rounded-3xl overflow-hidden bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-700/80 shadow-xl shadow-black/5">
              <div
                className="p-3 sm:p-4 md:p-5 border-b flex items-center gap-3"
                style={{
                  borderColor: hexToRgba(project.color, 0.1),
                  backgroundColor: hexToRgba(project.color, 0.04),
                }}
              >
                <motion.div
                  className="p-2.5 rounded-xl"
                  style={{ backgroundColor: hexToRgba(project.color, 0.15) }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Monitor
                    className="w-5 h-5"
                    style={{ color: project.color }}
                  />
                </motion.div>
                <span className="text-base font-bold text-neutral-900 dark:text-white">
                  Preview da aplicação
                </span>
              </div>
              <div className="relative w-full h-[220px] sm:h-[280px] md:h-[360px] lg:h-[420px] bg-neutral-100 dark:bg-neutral-950 overflow-hidden">
                <Image
                  src={project.preview}
                  alt={`Preview do ${project.name}`}
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 800px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <motion.div
                  className="absolute bottom-5 right-5 px-5 py-2.5 rounded-2xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-700/80 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2"
                  initial={{ y: 20 }}
                  whileHover={{ y: -2 }}
                  style={{
                    boxShadow: `0 10px 40px ${hexToRgba(project.color, 0.2)}`,
                  }}
                >
                  <span
                    className="text-sm font-semibold"
                    style={{ color: project.color }}
                  >
                    Ver mais
                  </span>
                  <ArrowRight
                    className="w-4 h-4"
                    style={{ color: project.color }}
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Arquitetura e Workflow */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-700/80 shadow-xl shadow-black/5">
            <div
              className="p-3 sm:p-4 md:p-5 border-b flex items-center gap-3"
              style={{
                borderColor: hexToRgba(project.color, 0.1),
                backgroundColor: hexToRgba(project.color, 0.04),
              }}
            >
              <motion.div
                className="p-2.5 rounded-xl"
                style={{ backgroundColor: hexToRgba(project.color, 0.15) }}
                whileHover={{ scale: 1.1, rotate: -5 }}
              >
                <Sparkles
                  className="w-5 h-5"
                  style={{ color: project.color }}
                />
              </motion.div>
              <span className="text-base font-bold text-neutral-900 dark:text-white">
                Arquitetura e workflow
              </span>
            </div>
            <div className="h-[280px] sm:h-[360px] md:h-[440px] lg:h-[520px] bg-neutral-50/50 dark:bg-neutral-950/50 overflow-hidden">
              <ProjectFlow workflow={project.workflow} color={project.color} />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
