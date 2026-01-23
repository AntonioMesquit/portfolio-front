"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useMotionValueEvent, useSpring } from "framer-motion";

type CounterConfig = {
  number: number;
  decimals: number;
  prefix: string;
  suffix: string;
};

type StatItem = {
  label: string;
  value: string;
  description: string;
  from: string;
  to: string;
  size: string;
  valueClass: string;
};

const stats: StatItem[] = [
  {
    label: "Tempo de experiência",
    value: "4+ anos",
    description: "",
    from: "#DCEBFF",
    to: "#A7C7FF",
    size: "md:col-span-4 md:row-span-2",
    valueClass: "text-3xl md:text-4xl",
  },
  {
    label: "Projetos entregues",
    value: "35+",
    description: "Web apps, landing pages e dashboards.",
    from: "#FDE2F3",
    to: "#F7B6E6",
    size: "md:col-span-2 md:row-span-1",
    valueClass: "text-2xl md:text-3xl",
  },
  {
    label: "Parceiros atendidos",
    value: "18+",
    description: "Times e marcas de vários segmentos.",
    from: "#E6FFF4",
    to: "#9FF1D8",
    size: "md:col-span-2 md:row-span-2",
    valueClass: "text-2xl md:text-3xl",
  },
  {
    label: "Satisfação média",
    value: "5.0",
    description: "Feedbacks consistentes e recorrentes.",
    from: "#FFF4D6",
    to: "#FFD59B",
    size: "md:col-span-4 md:row-span-1",
    valueClass: "text-3xl md:text-4xl",
  },
];

function getCounterConfig(value: string): CounterConfig | null {
  const match = value.match(/-?\d+(\.\d+)?/);
  if (!match || match.index === undefined) {
    return null;
  }
  const raw = match[0];
  const number = Number.parseFloat(raw);
  const decimals = raw.includes(".") ? raw.split(".")[1]?.length ?? 0 : 0;
  const prefix = value.slice(0, match.index);
  const suffix = value.slice(match.index + raw.length);
  return {
    number,
    decimals,
    prefix,
    suffix,
  };
}

function CounterText({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const config = getCounterConfig(value);
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { damping: 18, stiffness: 120 });
  const [display, setDisplay] = useState("0");
  useEffect(() => {
    if (!config) {
      return;
    }
    motionValue.set(config.number);
  }, [config, motionValue]);
  useMotionValueEvent(spring, "change", (latest) => {
    if (!config) {
      return;
    }
    const formatted =
      config.decimals > 0
        ? latest.toFixed(config.decimals)
        : Math.round(latest).toString();
    setDisplay(formatted);
  });
  if (!config) {
    return <span className={className}>{value}</span>;
  }
  return (
    <span className={className}>
      {config.prefix}
      {display}
      {config.suffix}
    </span>
  );
}
export default function StatsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 md:auto-rows-[165px] gap-4 pt-2">
      {stats.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.45 + index * 0.1, duration: 0.5 }}
          whileHover={{ y: -6, scale: 1.02 }}
          className={`animated-card cherry-bomb-one-regular rounded-3xl p-4 md:p-5 shadow-lg shadow-black/5 border border-white/50 backdrop-blur-sm ${item.size}`}
          style={
            {
              "--card-from": item.from,
              "--card-to": item.to,
            } as CSSProperties
          }
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-neutral-700/70">
              {item.label}
            </span>
            <span className="h-2 w-2 rounded-full bg-black/70" />
          </div>
          <div className={`mt-3 font-semibold text-neutral-900 ${item.valueClass}`}>
            <CounterText value={item.value} />
          </div>
          {item.description ? (
            <p className="mt-2 text-sm text-neutral-700">
              {item.description}
            </p>
          ) : null}
        </motion.div>
      ))}
    </div>
  );
}
