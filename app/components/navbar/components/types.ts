/**
 * As quatro seções. A ordem é a numeração impressa nas abas (01 a 04).
 *
 * Sem ícone: ícone é vocabulário de UI, e este header é impresso. Antes o
 * ícone era a única coisa visível quando a aba estava inativa e o rótulo
 * expandia por animação de maxWidth — custava framer-motion e comunicava menos
 * que o número da chapa.
 */
export interface NavItem {
  href: string;
  label: string;
}

export const navItems: NavItem[] = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "Sobre" },
  { href: "/projetos", label: "Projetos" },
  { href: "/blog", label: "Blog" },
];
