"use client";

import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";

type HeaderActionLink = {
  href: string;
  label: string;
};

type HeaderActionsMenuProps = {
  links: HeaderActionLink[];
};

export function HeaderActionsMenu({ links }: HeaderActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex items-center gap-3 border border-[var(--theme-line)] bg-[var(--theme-panel-soft)] px-4 py-2 text-sm font-semibold text-[var(--theme-ink)] transition hover:bg-[var(--theme-panel)]"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
      >
        Menu
        <span className="grid gap-1">
          <span className="block h-px w-5 bg-current" />
          <span className="block h-px w-5 bg-current" />
          <span className="block h-px w-5 bg-current" />
        </span>
      </button>

      {isOpen ? (
        <div className="theme-dropdown-menu absolute right-0 top-[calc(100%+0.5rem)] z-[100] grid min-w-52 border border-[var(--theme-line)] p-2 shadow-[0_18px_60px_rgba(0,0,0,0.3)] backdrop-blur-2xl">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="px-3 py-2 text-sm font-semibold text-[var(--theme-ink)] transition hover:bg-[var(--theme-panel-soft)]"
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle className="mt-1 w-full justify-start border-0 px-3 py-2" />
        </div>
      ) : null}
    </div>
  );
}
