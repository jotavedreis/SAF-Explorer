"use client";

import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "../theme-toggle";
import { LogoutButton } from "./logout-button";

export function AdminActionsMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative z-[100]">
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
          <Link
            href="/especies"
            onClick={() => setIsOpen(false)}
            className="px-3 py-2 text-sm font-semibold text-[var(--theme-ink)] transition hover:bg-[var(--theme-panel-soft)]"
          >
            Voltar ao site
          </Link>
          <ThemeToggle className="mt-1 w-full justify-start border-0 px-3 py-2" />
          <LogoutButton className="mt-1 w-full justify-start border-0 bg-transparent px-3 py-2 text-left text-[var(--theme-ink)] hover:bg-[var(--theme-panel-soft)]" />
        </div>
      ) : null}
    </div>
  );
}
