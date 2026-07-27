"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Layout,
  Home,
  User,
  FolderKanban,
  BookOpen,
  FileText,
  Settings,
  Server,
  Palette,
  Sparkles,
  ChevronRight,
  Code2,
} from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const projects = [
  { name: "Piesse", desc: "Plataforma de gestão jurídica com assistente inteligente", stack: "Next.js, NestJS, PostgreSQL, OpenAI" },
  { name: "Frevo", desc: "Sistema de gestão de eventos e festivais", stack: "React, Node.js, MongoDB, Stripe" },
  { name: "Egle", desc: "Plataforma de e-learning com gamificação", stack: "Vue.js, FastAPI, PostgreSQL" },
  { name: "1001Tem", desc: "Marketplace de serviços com matching inteligente", stack: "Next.js, React Native, GraphQL" },
];

const pages = [
  { path: "/", label: "Início", icon: Home },
  { path: "/sobre", label: "Sobre", icon: User },
  { path: "/projetos", label: "Projetos", icon: FolderKanban },
  { path: "/blog", label: "Blog", icon: BookOpen },
  { path: "/tonio", label: "Admin", icon: Settings },
];

export default function SobreOSitePage() {
  return (
    <div className="min-h-screen w-full pt-24 pb-20 bg-[var(--paper)]">
      <div className="w-full max-w-4xl mx-auto px-4 md:px-6">
        {/* Hero */}
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 flex items-center justify-center">
              <Layout className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500 uppercase tracking-wider">
                Documentação
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">
                Sobre o Site
              </h1>
            </div>
          </div>
          <p className="text-lg text-neutral-600 leading-relaxed max-w-2xl">
            Portfólio pessoal e blog de Antonio Mesquita — focado em{" "}
            <span className="font-semibold text-neutral-800">performance</span>,{" "}
            <span className="font-semibold text-neutral-800">acessibilidade</span>{" "}
            e <span className="font-semibold text-neutral-800">detalhes visuais</span>.
          </p>
        </motion.header>

        {/* Seções */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-12"
        >
          {/* Páginas do site */}
          <motion.section variants={item} className="space-y-4">
            <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-neutral-600" />
              Estrutura do Site
            </h2>
            <div className="grid gap-3">
              {pages.map((p) => (
                <Link
                  key={p.path}
                  href={p.path}
                  className="group flex items-center gap-4 p-4 rounded-xl border border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center group-hover:bg-neutral-200 transition-colors">
                    <p.icon className="w-5 h-5 text-neutral-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-neutral-900">{p.label}</p>
                    <p className="text-sm text-neutral-500 font-mono">{p.path}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-neutral-600 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </motion.section>

          {/* Visão por página */}
          <motion.section variants={item} className="space-y-6">
            <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-neutral-600" />
              O que cada página oferece
            </h2>
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100">
                <h3 className="font-semibold text-neutral-900 mb-2">Início</h3>
                <p className="text-neutral-600 text-sm leading-relaxed mb-3">
                  Hero com apresentação, stats animados (4+ anos, 35+ projetos, 18+ parceiros)
                  e animações com Framer Motion.
                </p>
                <p className="text-xs text-neutral-500">→ /</p>
              </div>
              <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100">
                <h3 className="font-semibold text-neutral-900 mb-2">Sobre</h3>
                <p className="text-neutral-600 text-sm leading-relaxed mb-3">
                  Trajetória de aluno de Ciência da Computação (2022, 17 anos) a CTO de startup
                  jurídica — plataforma completa de assistente jurídico.
                </p>
                <p className="text-xs text-neutral-500">→ /sobre</p>
              </div>
              <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100">
                <h3 className="font-semibold text-neutral-900 mb-2">Projetos</h3>
                <p className="text-neutral-600 text-sm leading-relaxed mb-4">
                  Prancha de desenho técnico animada: o diagrama de arquitetura se
                  remonta ao trocar de projeto, com os nós compartilhados viajando
                  pela tela em vez de sumir e reaparecer.
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {projects.map((proj) => (
                    <div
                      key={proj.name}
                      className="p-3 rounded-lg bg-white border border-neutral-200"
                    >
                      <p className="font-semibold text-neutral-900 text-sm">{proj.name}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">{proj.stack}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-neutral-500 mt-3">→ /projetos</p>
              </div>
              <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100">
                <h3 className="font-semibold text-neutral-900 mb-2">Blog</h3>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  Listagem de artigos com busca, sidebar de categorias, tempo de leitura e tags.
                  Conteúdo em Markdown.
                </p>
                <p className="text-xs text-neutral-500 mt-3">→ /blog</p>
              </div>
            </div>
          </motion.section>

          {/* Stack */}
          <motion.section variants={item} className="space-y-4">
            <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-neutral-600" />
              Tecnologias
            </h2>
            <div className="flex flex-wrap gap-2">
              {["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "Framer Motion", "GSAP Flip", "Lucide Icons", "Poppins"].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-700 text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.section>

          {/* Backend */}
          <motion.section variants={item} className="space-y-4">
            <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
              <Server className="w-5 h-5 text-neutral-600" />
              Backend
            </h2>
            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100">
              <p className="text-neutral-600 text-sm leading-relaxed">
                API NestJS com Supabase (PostgreSQL). CRUD de posts e categorias,
                armazenamento em Markdown. Health check em <code className="px-1.5 py-0.5 rounded bg-neutral-200 text-neutral-800 text-xs">/api/health</code>.
              </p>
            </div>
          </motion.section>

          {/* Design */}
          <motion.section variants={item} className="space-y-4">
            <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
              <Palette className="w-5 h-5 text-neutral-600" />
              Design e UX
            </h2>
            <ul className="space-y-2 text-neutral-600 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                Layout minimalista, branco e tons neutros
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                Animações suaves e microinterações (Framer Motion)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                Cards com gradientes no hero
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                Responsivo para mobile, tablet e desktop
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                Acessibilidade com ARIA e estrutura semântica
              </li>
            </ul>
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
}
