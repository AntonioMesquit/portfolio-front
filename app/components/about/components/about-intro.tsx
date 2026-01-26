"use client";

import { motion } from "framer-motion";
import { User } from "lucide-react";
import InfoCards from "./info-cards";


export default function AboutIntro() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-xl border border-gray-200"
      >
        <User className="w-4 h-4 text-neutral-700" />
        <span className="text-xs font-medium text-neutral-700 uppercase tracking-wider">
          Sobre Antonio Mesquita
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="text-3xl md:text-4xl lg:text-5xl font-bold text-black leading-tight"
      >
        De um aluno de Ciencia da Computação a CTO de uma startup juridica.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-lg md:text-xl text-neutral-600"
      >
        Uma jornada de 4 anos de estudos e trabalho em tecnologia.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="space-y-4 text-base md:text-lg text-neutral-700 leading-relaxed"
      >
        <p>
         Comecei a estudar Ciencia da Computação em 2022 com 17 anos, sem um rumo claro mas com 
         muita vontade de aprender e me tornar um desenvolvedor, foi ai que conheci 
         a programação web, e desde entao comecei a estudar e me especializar em desenvolvimento Web
         e Mobile.
        </p>
        <p>
          Hoje sou CTO de uma startup juridica, que cuida de todo o processo juridico de uma empresa, desde a criação de contratos, jurisprudencia, chatbots em relação aos processos juridicos, inicialmente a ideia era apenas ser um SaaS, porem com o tempo a ideia foi se expandindo e hoje temos uma plataforma completa de assistente juridico.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="space-y-3"
      >
      </motion.div>

      <InfoCards />
    </div>
  );
}
