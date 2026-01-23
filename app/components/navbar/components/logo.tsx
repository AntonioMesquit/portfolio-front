"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import logo from "@/public/icon-navbar.png";

interface LogoProps {
  className?: string;
  size?: number;
}

export default function Logo({ className = "", size = 200 }: LogoProps) {
  return (
    <Link href="/" aria-label="Ir para a página inicial">
      <motion.div
        initial={{ opacity: 0, scaleX: 0, originX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{
          type: "spring",
          stiffness: 80,
          damping: 20,
          duration: 1,
        }}
        className={`shrink-0 overflow-hidden max-w-full cursor-pointer ${className}`}
      >
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            delay: 0.3,
            type: "spring",
            stiffness: 80,
            damping: 18,
            duration: 0.8,
          }}
        >
          <Image
            src={logo}
            alt="Tonio"
            width={80}
            height={80}
            className="object-contain md:w-[140px]"
          />
        </motion.div>
      </motion.div>
    </Link>
  );
}


