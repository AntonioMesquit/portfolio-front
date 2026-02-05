"use client";

import { motion } from "framer-motion";
import { Code2, Monitor } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Project } from "./project-card";
import ProjectFlow from "./project-flow";

interface ProjectsTimelineProps {
  projects: Project[];
}

export default function ProjectsTimeline({ projects }: ProjectsTimelineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref, projects]);

  return (
    <div ref={ref} className="relative max-w-[1400px] mx-auto pb-20">
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          className={`flex justify-start pt-10 md:gap-10 ${index > 0 ? 'md:pt-60' : ''}`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.2, margin: "-100px" }}
          transition={{ duration: 0.3 }}
        >
          <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full md:min-w-[250px]">
            <motion.div
              className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white dark:bg-black flex items-center justify-center"
              initial={{ scale: 0, rotate: -90, opacity: 0 }}
              whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 25,
                duration: 0.4
              }}
            >
              <motion.div 
                className="h-4 w-4 rounded-full border border-neutral-300 dark:border-neutral-700 p-2"
                style={{ backgroundColor: project.color }}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ 
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  delay: 0.1
                }}
              />
            </motion.div>
            <motion.h3
              className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold cherry-bomb-one-regular"
              style={{ color: project.color }}
              initial={{ opacity: 0, x: -30, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ 
                duration: 0.4,
                ease: [0.25, 0.1, 0.25, 1],
                delay: 0.05
              }}
            >
              {project.name}
            </motion.h3>
          </div>

          <div className="relative pl-20 pr-4 md:pl-4 w-full max-w-4xl">
            <motion.h3
              className="md:hidden block text-2xl mb-4 text-left font-bold cherry-bomb-one-regular"
              style={{ color: project.color }}
              initial={{ opacity: 0, x: -20, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ 
                duration: 0.4,
                ease: [0.25, 0.1, 0.25, 1],
                delay: 0.05
              }}
            >
              {project.name}
            </motion.h3>

            <motion.div
              initial={{ opacity: 0, x: 30, y: 20, scale: 0.95, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" }}
              viewport={{ once: false, amount: 0.2, margin: "-50px" }}
              transition={{ 
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1],
                delay: 0.1
              }}
              className="space-y-6"
            >
              <div className="space-y-3">
                <p className="text-base md:text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {project.description}
                </p>
                <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {project.longDescription}
                </p>
              </div>

                {project.preview && (
                <div className="rounded-2xl overflow-hidden bg-linear-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-lg">
                  <div className="p-3 md:p-4 border-b border-neutral-200 dark:border-neutral-700 bg-white/50 dark:bg-neutral-900/50">
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4" style={{ color: project.color }} />
                      <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                        Preview da Aplicação
                      </span>
                    </div>
                  </div>
                  <div className="relative w-full h-[250px] md:h-[350px] bg-neutral-100 dark:bg-neutral-900 overflow-hidden group">
                    <Image
                      src={project.preview}
                      alt={`Preview do ${project.name}`}
                      fill
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 800px"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              )}

              <div className="rounded-2xl overflow-hidden bg-linear-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-lg">
                <div className="p-3 md:p-4 border-b border-neutral-200 dark:border-neutral-700 bg-white/50 dark:bg-neutral-900/50">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                    <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                      Arquitetura e Workflow
                    </span>
                  </div>
                </div>
                <div className="h-[400px] md:h-[500px] bg-white dark:bg-neutral-950">
                  <ProjectFlow workflow={project.workflow} />
                </div>
              </div>

                <div className="rounded-2xl p-4 md:p-6 bg-linear-to-br from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-lg">
                <h4 className="text-base font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                  <Code2 className="w-4 h-4" style={{ color: project.color }} />
                  Tecnologias Utilizadas
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 rounded-xl bg-white/80 dark:bg-black/80 backdrop-blur-sm text-sm font-medium text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      ))}
    
      {height > 0 && (
        <div
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-0% via-neutral-200 dark:via-neutral-700 to-transparent to-99% mask-[linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
          style={{
            height: `${height}px`,
          }}
        >
          <motion.div
            className="absolute inset-x-0 top-0 w-[2px] bg-linear-to-t from-purple-500 via-blue-500 to-transparent from-0% via-10% rounded-full"
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            viewport={{ once: false }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      )}
    </div>
  );
}
