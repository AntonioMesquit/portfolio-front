"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, ChevronLeft, ChevronRight, Layers } from "lucide-react";
import { projectsData } from "./projects-data";
import ProjectInfo from "./project-info";
import ProjectDetail from "./project-detail";

export default function ProjectsSection() {
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const currentProject = projectsData[currentProjectIndex];

  const nextProject = () => {
    setCurrentProjectIndex((prev) => (prev + 1) % projectsData.length);
  };

  const prevProject = () => {
    setCurrentProjectIndex(
      (prev) => (prev - 1 + projectsData.length) % projectsData.length
    );
  };

  return (
    <section className="relative w-full overflow-x-hidden">
      <div className="relative z-10 w-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-12 lg:gap-16 xl:gap-20 items-start px-4 sm:px-6 md:px-8 pt-20 md:pt-28 pb-12 md:pb-20">
        {/* Header badge - visible on mobile */}
        <div className="lg:hidden mb-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-700/80 shadow-lg shadow-black/5"
          >
            <Layers className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
            <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-widest">
              Projetos em destaque
            </span>
          </motion.div>
        </div>

        {/* Left column - Project info */}
        <div className="space-y-6 md:space-y-8 lg:col-span-2 lg:sticky lg:top-28 self-start">
          <ProjectInfo project={currentProject} />

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex items-center gap-3 sm:gap-4 pt-2"
          >
            <motion.button
              onClick={prevProject}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-700/80 shadow-lg shadow-black/5 hover:shadow-xl hover:border-neutral-300/80 dark:hover:border-neutral-600/80 transition-all duration-300 flex-shrink-0"
              aria-label="Projeto anterior"
            >
              <ChevronLeft className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            </motion.button>

            <div className="flex-1 flex items-center justify-center gap-2.5">
              {projectsData.map((project, index) => (
                <motion.button
                  key={project.id}
                  onClick={() => setCurrentProjectIndex(index)}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    index === currentProjectIndex
                      ? "shadow-lg"
                      : "w-2.5 bg-neutral-300/80 dark:bg-neutral-600/80 hover:bg-neutral-400/80 dark:hover:bg-neutral-500/80"
                  }`}
                  style={
                    index === currentProjectIndex
                      ? {
                          width: "2rem",
                          backgroundColor: project.color,
                          boxShadow: `0 0 20px ${project.color}50`,
                        }
                      : {}
                  }
                  aria-label={`Ir para projeto ${index + 1}`}
                />
              ))}
            </div>

            <motion.button
              onClick={nextProject}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-700/80 shadow-lg shadow-black/5 hover:shadow-xl hover:border-neutral-300/80 dark:hover:border-neutral-600/80 transition-all duration-300 flex-shrink-0"
              aria-label="Próximo projeto"
            >
              <ChevronRight className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            </motion.button>
          </motion.div>
        </div>

        {/* Right column - Project detail */}
        <div className="w-full lg:col-span-3 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProject.id}
              initial={{ opacity: 0, x: 40, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -40, scale: 0.98 }}
              transition={{
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <ProjectDetail project={currentProject} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
