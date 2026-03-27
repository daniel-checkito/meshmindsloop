"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/loop", label: "Loop" },
  { href: "/loop-pro", label: "Loop Pro" },
  { href: "/gen", label: "Gen" },
  { href: "/impossible", label: "Impossible" },
  { href: "/character", label: "Character" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand">
          Meshminds<span>3D</span>
        </Link>
        <nav className="main-nav">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`nav-link${active ? " active" : ""}`}>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
