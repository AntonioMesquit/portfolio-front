import { LucideIcon, Home, User, FolderKanban, BookOpen } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { href: "/", label: "Início", icon: Home },
  { href: "/sobre", label: "Sobre", icon: User },
  { href: "/projetos", label: "Projetos", icon: FolderKanban },
  { href: "/blog", label: "Blog", icon: BookOpen },
];
