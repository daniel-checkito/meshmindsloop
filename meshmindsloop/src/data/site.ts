export type NavItem = {
  href: string;
  label: string;
  description: string;
};

export const navItems: NavItem[] = [
  { href: "/", label: "Home", description: "Tool hub" },
  { href: "/loop", label: "Loop", description: "Queue automation" },
  { href: "/loop-pro", label: "Loop Pro", description: "Advanced loop mode" },
  { href: "/gen", label: "Gen", description: "Algorithmic forms" },
  { href: "/impossible", label: "Impossible", description: "Print challenges" },
  { href: "/character", label: "Character", description: "Figurine builder" },
  { href: "/about", label: "About", description: "@meshminds3d" },
  { href: "/contact", label: "Contact", description: "Work with me" }
];
