"use client";

import { motion } from "framer-motion";
import { Code2, Monitor, ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import { Project } from "./project-card";
import ProjectFlow from "./project-flow";

interface ProjectDetailProps {
  project: Project;
}

export default function ProjectDetail({ project }: ProjectDetailProps) {
  const frontendTechs = project.technologies.filter(tech => 
    ['Next.js', 'React', 'Vue.js', 'TypeScript', 'Tailwind CSS', 'React Native'].includes(tech)
  );
  const backendTechs = project.technologies.filter(tech => 
    ['NestJS', 'Node.js', 'Express', 'FastAPI', 'Python', 'Django', 'GraphQL', 'Apollo'].includes(tech)
  );
  const otherTechs = project.technologies.filter(tech => 
    !frontendTechs.includes(tech) && !backendTechs.includes(tech)
  );

  return (
    <div className="h-full flex flex-col overflow-y-auto scrollbar-hide">
      <div className="space-y-6 pb-8">
        {project.preview && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="rounded-3xl overflow-hidden bg-linear-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-xl group"
          >
            <div className="p-4 md:p-5 border-b border-neutral-200 dark:border-neutral-700 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <motion.div
                  className="p-2 rounded-xl"
                  style={{ backgroundColor: `${project.color}15` }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Monitor className="w-5 h-5" style={{ color: project.color }} />
                </motion.div>
                <span className="text-base font-bold text-neutral-900 dark:text-white">
                  Preview da Aplicação
                </span>
              </div>
            </div>
            <div className="relative w-full h-[350px] md:h-[450px] bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
              <Image
                src={project.preview}
                alt={`Preview do ${project.name}`}
                fill
                className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 800px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <motion.div
                className="absolute bottom-4 right-4 px-4 py-2 rounded-xl bg-white/90 dark:bg-black/90 backdrop-blur-sm border border-neutral-200 dark:border-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity"
                initial={{ y: 20 }}
                whileHover={{ y: 0 }}
              >
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                  Ver mais <ArrowRight className="w-4 h-4" />
                </span>
              </motion.div>
            </div>
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="rounded-3xl overflow-hidden bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-xl"
        >
          <div className="p-4 md:p-5 border-b border-neutral-200 dark:border-neutral-700 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <motion.div
                className="p-2 rounded-xl"
                style={{ backgroundColor: `${project.color}15` }}
                whileHover={{ scale: 1.1, rotate: -5 }}
              >
                <Sparkles className="w-5 h-5" style={{ color: project.color }} />
              </motion.div>
              <span className="text-base font-bold text-neutral-900 dark:text-white">
                Arquitetura e Workflow
              </span>
            </div>
          </div>
          <div className="h-[450px] md:h-[550px] bg-white dark:bg-neutral-950">
            <ProjectFlow workflow={project.workflow} color={project.color} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="rounded-3xl p-6 md:p-8 bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <motion.div
              className="p-2 rounded-xl"
              style={{ backgroundColor: `${project.color}15` }}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Code2 className="w-5 h-5" style={{ color: project.color }} />
            </motion.div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              Tecnologias Utilizadas
            </h3>
          </div>
          
          <div className="space-y-4">
            {frontendTechs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="space-y-2"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-1 w-8 rounded-full" style={{ backgroundColor: project.color }} />
                  <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Frontend
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {frontendTechs.map((tech, index) => (
                    <motion.div
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.05, duration: 0.3 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border border-blue-200 dark:border-blue-800 shadow-sm"
                    >
                      <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                        {tech}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {backendTechs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="space-y-2"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-1 w-8 rounded-full" style={{ backgroundColor: project.color }} />
                  <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Backend
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {backendTechs.map((tech, index) => (
                    <motion.div
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + index * 0.05, duration: 0.3 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border border-purple-200 dark:border-purple-800 shadow-sm"
                    >
                      <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                        {tech}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {otherTechs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="space-y-2"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-1 w-8 rounded-full" style={{ backgroundColor: project.color }} />
                  <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Infraestrutura & Outros
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {otherTechs.map((tech, index) => (
                    <motion.div
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.9 + index * 0.05, duration: 0.3 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 border border-neutral-300 dark:border-neutral-600 shadow-sm"
                    >
                      <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                        {tech}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -4 }}
            className="rounded-2xl p-4 bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-lg"
          >
            <div className="text-2xl font-bold mb-1" style={{ color: project.color }}>
              {project.technologies.length}+
            </div>
            <div className="text-xs text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
              Tecnologias
            </div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05, y: -4 }}
            className="rounded-2xl p-4 bg-linear-to-br from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-lg"
          >
            <div className="text-2xl font-bold mb-1" style={{ color: project.color }}>
              {project.workflow.nodes.length}
            </div>
            <div className="text-xs text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
              Componentes
            </div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05, y: -4 }}
            className="rounded-2xl p-4 bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-lg col-span-2 md:col-span-1"
          >
            <div className="text-2xl font-bold mb-1" style={{ color: project.color }}>
              100%
            </div>
            <div className="text-xs text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
              Responsivo
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
