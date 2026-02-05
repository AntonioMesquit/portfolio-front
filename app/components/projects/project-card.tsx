"use client";

import { motion } from "framer-motion";
import { Code2, Monitor, ExternalLink } from "lucide-react";
import Image from "next/image";
import ProjectFlow from "./project-flow";

export interface Project {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  technologies: string[];
  preview?: string;   
  workflow: {
    nodes: Array<{
      id: string;
      type: string;
      position: { x: number; y: number };
      data: { label: string; tech?: string };
    }>;
    edges: Array<{
      id: string;
      source: string;
      target: string;
    }>;
  };
  color: string;
  gradient: string;
}

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="mb-24 md:mb-32 last:mb-0"
    >
      <div className="w-full max-w-[1400px] mx-auto">
        <div className="mb-8 md:mb-12">
          <div className="flex items-center gap-4 mb-4">
            <motion.div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${project.color}, ${project.color}dd)`,
              }}
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <Code2 className="w-6 h-6 text-white" />
            </motion.div>
            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-black dark:text-white cherry-bomb-one-regular"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              {project.name}
            </motion.h2>
          </div>

          <motion.p
            className="text-lg md:text-xl text-neutral-700 dark:text-neutral-300 leading-relaxed max-w-4xl"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {project.description}
          </motion.p>

          <motion.p
            className="text-base md:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-4xl mt-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {project.longDescription}
          </motion.p>
        </div>

        {project.preview && (
          <motion.div
            className="mb-8 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            <div className="rounded-3xl overflow-hidden bg-linear-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-xl">
              <div className="p-4 md:p-6 border-b border-neutral-200 dark:border-neutral-700 bg-white/50 dark:bg-neutral-900/50">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                  <Monitor className="w-5 h-5" style={{ color: project.color }} />
                  Preview da Aplicação
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  Veja como ficou o resultado final
                </p>
              </div>
              <div className="relative w-full h-[300px] md:h-[400px] bg-neutral-100 dark:bg-neutral-900 overflow-hidden group">
                <Image
                  src={project.preview}
                  alt={`Preview do ${project.name}`}
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1400px"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="rounded-3xl overflow-hidden bg-linear-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-xl">
              <div className="p-4 md:p-6 border-b border-neutral-200 dark:border-neutral-700 bg-white/50 dark:bg-neutral-900/50">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  Arquitetura e Workflow
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  Visualize como os componentes se conectam
                </p>
              </div>
              <div className="h-[500px] md:h-[600px] bg-white dark:bg-neutral-950">
                <ProjectFlow workflow={project.workflow} />
              </div>
            </div>
          </motion.div>
            
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="rounded-3xl p-6 md:p-8 bg-linear-to-br from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-lg h-full">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-6 flex items-center gap-2">
                <Code2 className="w-5 h-5" style={{ color: project.color }} />
                Tecnologias
              </h3>
              <div className="space-y-3">
                {project.technologies.map((tech, techIndex) => (
                  <motion.div
                    key={tech}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.6 + techIndex * 0.05,
                      duration: 0.3,
                    }}
                    className="flex items-center gap-3 group"
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full transition-all group-hover:scale-150"
                      style={{ backgroundColor: project.color }}
                    />
                    <span className="text-base font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                      {tech}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
