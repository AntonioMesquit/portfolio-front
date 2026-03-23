"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { X, Mail, Linkedin } from "lucide-react";
import { navItems, type NavItem as NavItemType } from "./types";
import antonioIcon from "@/public/antonior-icon.png";

interface MobileMenuProps {
  onClose: () => void;
}

export default function MobileMenu({ onClose }: MobileMenuProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const menuContent = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] md:hidden flex items-center justify-center p-4 overflow-hidden"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.4)",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, y: 50, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.8, y: 50, opacity: 0 }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 300,
          duration: 0.5,
        }}
        className="relative w-full max-w-lg h-[85vh] rounded-3xl border-4 border-black shadow-2xl overflow-hidden"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        style={{
          backgroundColor: "#D3D3D3",
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0,0,0,0.03) 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="absolute -top-10 left-1/2 transform -translate-x-1/2 z-10"
        >
          <div className="bg-black px-10 py-[6px] rounded-t-2xl border-4 border-black border-b-0 shadow-lg">
            <span className="text-white font-medium text-sm whitespace-nowrap">
              Antonio Mesquita
            </span>
          </div>
        </motion.div>

        <div className="h-full flex flex-col p-8 pt-12 relative overflow-y-auto overflow-x-hidden scrollbar-hide">
          <motion.button
            onClick={onClose}
            className="absolute top-6 left-6 text-black hover:opacity-70 transition-opacity"
            aria-label="Fechar menu"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-6 h-6" strokeWidth={2.5} />
          </motion.button>

          <motion.div 
            className="w-40 h-40 absolute bottom-0 left-0"
            initial={{ 
              scale: 0, 
              opacity: 0,
              y: 150,
              rotate: -15,
              x: -30
            }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              y: 0,
              rotate: 0,
              x: 0
            }}
            transition={{ 
              delay: 0.3, 
              type: "spring", 
              stiffness: 100,
              damping: 12,
              mass: 1
            }}
            whileHover={{
              scale: 1.05,
              rotate: 2,
              transition: { duration: 0.2 }
            }}
          >
            <motion.div
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5
              }}
              className="w-full h-full"
            >
              <Image
                src={antonioIcon}
                alt="Antonio"
                fill
                className="object-contain"
                priority
              />
            </motion.div>
          </motion.div>

          <div className="flex flex-col justify-center items-center gap-8 mb-6 w-full">
            {navItems.map((item: NavItemType, index: number) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} onClick={onClose} className="w-full text-center">
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{
                      delay: 0.4 + index * 0.1,
                      type: "spring",
                      stiffness: 100,
                    }}
                    whileHover={{ scale: 1.05, x: 10 }}
                    className="text-black text-5xl font-light tracking-wide hover:opacity-70 transition-opacity"
                  >
                    {item.label}
                  </motion.div>
                </Link>
              );
            })}
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="flex flex-col gap-4 mb-6 w-full"
          >
            <motion.a
              href="/contato"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-black text-white py-4 px-8 rounded-xl font-medium text-lg hover:bg-gray-800 transition-colors text-center w-full"
            >
              Vamos conectar
            </motion.a>
            <motion.a
              href="/resumo"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white border-2 border-black text-black py-4 px-8 rounded-xl font-medium text-lg hover:bg-gray-200 hover:text-black transition-colors text-center w-full"
            >
              Veja um resumo
            </motion.a>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.4 }}
            className="flex justify-center gap-5"
          >
            <motion.a
              href="mailto:antonio109mesquita@gmail.com"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="w-16 h-16 rounded-full border-2 border-black bg-white flex items-center justify-center hover:bg-gray-200 group transition-colors"
              aria-label="Email"
            >
              <Mail className="w-7 h-7 text-black group-hover:text-black transition-colors" />
            </motion.a>
            <motion.a
              href="https://www.linkedin.com/in/antonio-mesquita-467752287/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
              className="w-16 h-16 rounded-full border-2 border-black bg-white flex items-center justify-center hover:bg-gray-200 group transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-7 h-7 text-black group-hover:text-black transition-colors" />
            </motion.a>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );

  if (!mounted) return null;

  return createPortal(menuContent, document.body);
}
