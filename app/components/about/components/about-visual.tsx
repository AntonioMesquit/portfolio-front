"use client";

import { motion } from "framer-motion";
import { MapPin, Code, Briefcase, Rocket, GraduationCap } from "lucide-react";
import { Timeline } from "@/app/components/ui/timeline";
import type { CSSProperties } from "react";

type TimelineNode = {
  year: string;
  period: string;
  title: string;
  company: string;
  icon: React.ElementType;
  description: string;
  technologies?: string[];
  from: string;
  to: string;
};

const timelineNodes: TimelineNode[] = [
  {
    year: "2022",
    period: "2022",
    title: "Início da Jornada",
    company: "Ciência da Computação",
    icon: GraduationCap,
    description: "Início dos estudos em Ciência da Computação na FB Uni Central. Comecei minha jornada na programação com muita vontade de aprender e me tornar um desenvolvedor, foi então que conheci a programação web e comecei a me especializar em desenvolvimento Web e Mobile.",
    from: "#E5E7EB",
    to: "#D1D5DB",
  },
  {
    year: "2024",
    period: "Jun/2024 - Jan/2025",
    title: "Desenvolvedor Back-end Junior",
    company: "Açailandia",
    icon: Code,
    description: "Desenvolvimento integral dos sistemas das redes e afiliadas do grupo, focando em escalabilidade e segurança. Utilização de ElysiaJS e NestJS para criação de APIs robustas e performáticas. Implementação de testes automatizados e criação de um guia de boas práticas para padronização do código da equipe.",
    from: "#D1D5DB",
    to: "#C4C9D0",
  },
  {
    year: "2025",
    period: "Jan/2025 - Out/2025",
    title: "Desenvolvedor Full Stack Junior",
    company: "Empresa Infinity",
    icon: Briefcase,
    description: "Desenvolvimento de SaaS: Responsável pela criação e manutenção de múltiplos softwares como serviço, entregando aplicações completas para web e mobile.",
    technologies: ["Next.js", "TypeScript", "React Native", "Vue.js", "NestJS", "Cloudflare"],
    from: "#C4C9D0",
    to: "#B0B5BC",
  },
  {
    year: "Atual",
    period: "2025",
    title: "CTO",
    company: "Startup Jurídica",
    icon: Rocket,
    description: "Liderança técnica e desenvolvimento de plataforma jurídica completa. A plataforma cuida de todo o processo jurídico de uma empresa, desde a criação de contratos, jurisprudência, chatbots em relação aos processos jurídicos. Inicialmente a ideia era apenas ser um SaaS, porém com o tempo a ideia foi se expandindo e hoje temos uma plataforma completa de assistente jurídico.",
    from: "#B0B5BC",
    to: "#9CA3AF",
  },
];

const timelineData = timelineNodes.map((node) => {
  const Icon = node.icon;
  
  return {
    title: node.year,
    content: (
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        className="relative"
      >
        <div
          className="animated-card cherry-bomb-one-regular rounded-3xl p-6 md:p-8 shadow-lg shadow-black/5 border border-white/50 backdrop-blur-sm"
          style={
            {
              "--card-from": node.from,
              "--card-to": node.to,
            } as CSSProperties
          }
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <motion.div
                className="p-4 rounded-2xl bg-white/70 backdrop-blur-sm shadow-md"
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <Icon className="w-7 h-7 md:w-8 md:h-8 text-neutral-700" />
              </motion.div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-2xl md:text-3xl font-semibold text-neutral-900">
                    {node.year}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-black/70" />
                  <span className="text-sm text-neutral-600 font-normal">
                    {node.period}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl md:text-3xl font-semibold text-neutral-900">
              {node.title}
            </h3>
            
            <p className="text-lg md:text-xl text-neutral-700 font-medium">
              {node.company}
            </p>
            
            <p className="text-base text-neutral-700 leading-relaxed font-normal" style={{ fontFamily: "var(--font-poppins)" }}>
              {node.description}
            </p>


            {node.technologies && (
              <div className="pt-2">
                <div className="flex flex-wrap gap-2">
                  {node.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 rounded-xl bg-white/60 backdrop-blur-sm text-sm font-medium text-neutral-700 border border-neutral-300 shadow-sm"
                      style={{ fontFamily: "var(--font-poppins)" }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="absolute top-4 right-4">
            <span className="h-3 w-3 rounded-full bg-black/70" />
          </div>
        </div>
      </motion.div>
    ),
  };
});

export default function AboutVisual() {
  return (
    <div className="w-full lg:h-full flex flex-col">
      <div className="flex-1 lg:overflow-y-auto scrollbar-hide -mx-4 md:-mx-8 px-4 md:px-8">
        <Timeline data={timelineData} />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="flex items-center gap-2 text-neutral-700 justify-center pt-6 pb-4"
      >
        <MapPin className="w-5 h-5" />
        <span className="text-base font-medium">Ceará, Brasil</span>
      </motion.div>
    </div>
  );
}
