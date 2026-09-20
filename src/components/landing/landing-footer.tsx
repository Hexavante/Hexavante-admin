"use client";

import Link from "next/link";
import { HexavanteLogo } from "@/components/brand/hexavante-logo";

const productLinks = [
  { label: "Cursos", href: "/cursos" },
  { label: "Tutoriais", href: "/tutorials" },
  { label: "Simulados", href: "/simulados" },
  { label: "Ranking", href: "/ranking" },
  { label: "Loja", href: "/shop" },
];

const companyLinks = [
  { label: "Sobre nós", href: "/ajuda" },
  { label: "Blog", href: "/ajuda" },
  { label: "Carreiras", href: "/ajuda" },
];

const resourceLinks = [
  { label: "Central de ajuda", href: "/ajuda" },
  { label: "Termos de uso", href: "/privacidade" },
  { label: "Privacidade", href: "/privacidade" },
];

const socialLinks = [
  { label: "YouTube", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "Discord", href: "#" },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-white/[0.06] bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-8 py-12 sm:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 sm:col-span-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5" aria-label="Hexavante">
              <HexavanteLogo
                size="md"
                showWordmark={false}
                className="gap-0"
                imageClassName="hx-header-logo-glow h-10 w-10"
              />
              <span className="text-sm font-extrabold tracking-tight hx-accent-text">
                HEXAVANTE
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-xs leading-5 text-[hsl(var(--sidebar-foreground)/0.48)]">
              A plataforma educacional que combina cursos, simulados e
              gamificação para transformar seu aprendizado.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[hsl(var(--sidebar-foreground)/0.36)]">
              Produto
            </h4>
            <ul className="mt-3 space-y-2">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[hsl(var(--sidebar-foreground)/0.6)] transition hover:text-[hsl(var(--sidebar-highlight))]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/hexa"
                  className="text-sm text-amber-400 transition hover:text-amber-300"
                >
                  Hexa ✦
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[hsl(var(--sidebar-foreground)/0.36)]">
              Empresa
            </h4>
            <ul className="mt-3 space-y-2">
              {companyLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-sm text-[hsl(var(--sidebar-foreground)/0.6)] transition hover:text-[hsl(var(--sidebar-highlight))]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[hsl(var(--sidebar-foreground)/0.36)]">
              Recursos
            </h4>
            <ul className="mt-3 space-y-2">
              {resourceLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-sm text-[hsl(var(--sidebar-foreground)/0.6)] transition hover:text-[hsl(var(--sidebar-highlight))]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[hsl(var(--sidebar-foreground)/0.36)]">
              Comunidade
            </h4>
            <ul className="mt-3 space-y-2">
              {socialLinks.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[hsl(var(--sidebar-foreground)/0.6)] transition hover:text-[hsl(var(--sidebar-highlight))]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] py-6 sm:flex-row">
          <p className="text-xs text-[hsl(var(--sidebar-foreground)/0.36)]">
            © {new Date().getFullYear()} Hexavante. Todos os direitos reservados.
          </p>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-[hsl(var(--sidebar-foreground)/0.2)]">
            HEXAVANTE
          </p>
        </div>
      </div>
    </footer>
  );
}
