"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Code2, ChevronLeft, ChevronRight } from "lucide-react";
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
    setCurrentProjectIndex((prev) => (prev - 1 + projectsData.length) % projectsData.length);
  };

  return (
    <section className="h-screen w-full bg-white dark:bg-neutral-950 overflow-hidden">
      <div className="h-full w-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start px-4 md:px-8 pt-24 md:pt-28 pb-12 md:pb-20">
        <div className="space-y-6 lg:col-span-2 lg:sticky lg:top-28 self-start">
          <ProjectInfo project={currentProject} />
          
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex items-center gap-3 pt-4"
          >
            <motion.button
              onClick={prevProject}
              whileHover={{ scale: 1.1, x: -2 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-neutral-900 dark:to-neutral-800 hover:from-gray-200 hover:to-gray-300 dark:hover:from-neutral-800 dark:hover:to-neutral-700 border border-gray-200 dark:border-neutral-800 shadow-md transition-all"
              aria-label="Projeto anterior"
            >
              <ChevronLeft className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
            </motion.button>
            
            <div className="flex-1 flex items-center justify-center gap-2">
              {projectsData.map((project, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentProjectIndex(index)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`h-2 rounded-full transition-all ${
                    index === currentProjectIndex
                      ? "w-8 shadow-md"
                      : "w-2 bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400 dark:hover:bg-neutral-600"
                  }`}
                  style={index === currentProjectIndex ? {
                    backgroundColor: project.color,
                    boxShadow: `0 0 10px ${project.color}40`
                  } : {}}
                  aria-label={`Ir para projeto ${index + 1}`}
                />
              ))}
            </div>
            
            <motion.button
              onClick={nextProject}
              whileHover={{ scale: 1.1, x: 2 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-neutral-900 dark:to-neutral-800 hover:from-gray-200 hover:to-gray-300 dark:hover:from-neutral-800 dark:hover:to-neutral-700 border border-gray-200 dark:border-neutral-800 shadow-md transition-all"
              aria-label="Próximo projeto"
            >
              <ChevronRight className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
            </motion.button>
          </motion.div>
        </div>
                  
        <div className="w-full lg:col-span-3 h-full overflow-hidden">
          <motion.div
            key={currentProject.id}
            initial={{ opacity: 0, x: 30, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -30, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <ProjectDetail project={currentProject} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
