"use client";

import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import logo from "@/public/icon-navbar.png";
import MobileMenuButton from "./mobile-menu-button";
import MobileMenu from "./mobile-menu";

interface NavbarMobileProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
}

export default function NavbarMobile({ isMenuOpen, toggleMenu, closeMenu }: NavbarMobileProps) {
  return (
    <>
      <div className="md:hidden pt-2 px-4 flex justify-between items-center relative z-50 w-full overflow-x-hidden">
        <div className="shrink-0 max-w-[60%]">
          <Image src={logo} alt="logo" width={120} height={120} className="w-full h-auto max-w-[100px]" />
        </div>
        <MobileMenuButton isOpen={isMenuOpen} onClick={toggleMenu} />
      </div>
      
      <div className="w-full border-t-[0.5px] border-dashed border-black/5 mt-4"></div>

      <AnimatePresence>
        {isMenuOpen && <MobileMenu onClose={closeMenu} />}
      </AnimatePresence>
    </>
  );
}
