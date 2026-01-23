"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { NavItem as NavItemType } from "./types";

interface NavItemProps {
  item: NavItemType;
  index: number;
  isActive: boolean;
}

export default function NavItem({ item, index, isActive }: NavItemProps) {
  const Icon = item.icon;

  return (
    <Link href={item.href}>
      <motion.div
        initial={{ opacity: 0, x: 50 + (index * 20), scale: 0.8 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        layout
        whileHover={{ scale: isActive ? 1 : 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          flex items-center justify-center rounded-xl cursor-pointer overflow-hidden
          ${isActive 
            ? "bg-gray-200 border-2 border-black shadow-sm" 
            : "hover:bg-gray-150"
          }
        `}
        transition={{
          delay: 0.4 + (index * 0.12),
          type: "spring",
          stiffness: 100,
          damping: 15,
          duration: 0.8,
          layout: {
            type: "spring",
            stiffness: 300,
            damping: 28,
            duration: 0.7
          }
        }}
        style={{
          padding: isActive ? "6px 12px" : "5px",
        }}
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-black shrink-0" strokeWidth={2} />
          <motion.div 
            className="overflow-hidden"
            initial={false}
            animate={{
              maxWidth: isActive ? 150 : 0,
            }}
            transition={{
              maxWidth: {
                type: "spring",
                stiffness: 300,
                damping: 28,
                duration: 0.7
              }
            }}
            style={{ display: "inline-block" }}
          >
            <AnimatePresence initial={false}>
              {isActive && (
                <motion.span
                  key={`text-${item.href}`}
                  initial={{ 
                    opacity: 0,
                    x: -8
                  }}
                  animate={{ 
                    opacity: 1,
                    x: 0
                  }}
                  exit={{ 
                    opacity: 0,
                    x: -8
                  }}
                  transition={{
                    opacity: {
                      duration: 0.35,
                      ease: [0.4, 0, 0.2, 1]
                    },
                    x: {
                      type: "spring",
                      stiffness: 300,
                      damping: 28,
                      duration: 0.7
                    }
                  }}
                  className="text-black font-medium text-sm whitespace-nowrap inline-block"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </Link>
  );
}
