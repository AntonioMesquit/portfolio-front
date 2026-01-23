"use client";

import { usePathname } from "next/navigation";
import Logo from "./logo";
import NavItem from "./nav-item";
import { navItems } from "./types";

export default function NavbarDesktop() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="hidden md:flex items-center justify-center w-full pt-6 overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between">
        <Logo />

        <div className="flex-1"></div>

        <nav className="shrink-0 bg-gray-100 rounded-2xl border border-gray-300 px-3 md:px-4 py-3 flex items-center justify-evenly gap-2 w-[290px] max-w-[290px] min-w-0">
          {navItems.map((item, index) => (
            <NavItem
              key={item.href}
              item={item}
              index={index}
              isActive={isActive(item.href)}
            />
          ))}
        </nav>
      </div>
    </div>
  );
}
