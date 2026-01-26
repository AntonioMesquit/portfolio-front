"use client";

import { motion } from "framer-motion";
import { GraduationCap, Briefcase, MapPin, Award } from "lucide-react";
import type { CSSProperties } from "react";

type InfoCard = {
  icon: React.ElementType;
  label: string;
  value: string;
  period: string;
  from: string;
  to: string;
};

const infoCards: InfoCard[] = [
  {
    icon: GraduationCap,
    label: "Formação",
    value: "Ciencia da Computação - FBUNI",
    period: "2022",
    from: "#DCEBFF",
    to: "#A7C7FF",
  },
  {
    icon: Briefcase,
    label: "Experiência",
    value: "4 anos em desenvolvimento",
    period: "2022-2026",
    from: "#FDE2F3",
    to: "#F7B6E6",
  },
  {
    icon: MapPin,
    label: "Localização",
    value: "Ceará, Brasil",
    period: "Atual",
    from: "#E6FFF4",
    to: "#9FF1D8",
  },
  {
    icon: Award,
    label: "Posição",
    value: "Aberto para Freelancer e Parcerias.",
    period: "2025",
    from: "#FFF4D6",
    to: "#FFD59B",
  },
];

export default function InfoCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
      {infoCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="animated-card rounded-2xl p-4 shadow-lg shadow-black/5 border border-white/50 backdrop-blur-sm"
            style={
              {
                "--card-from": card.from,
                "--card-to": card.to,
              } as CSSProperties
            }
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-white/50 backdrop-blur-sm">
                <Icon className="w-5 h-5 text-neutral-700" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs uppercase tracking-wider text-neutral-700/70 mb-1">
                  {card.label}
                </div>
                <div className="text-sm font-semibold text-neutral-900 mb-1">
                  {card.value}
                </div>
                <div className="text-xs text-neutral-600">{card.period}</div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
