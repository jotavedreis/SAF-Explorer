"use client";

import { useTheme } from "./theme-context";

type ThemeToggleProps = {
  className?: string;
  variant?: "solid" | "subtle";
};

export function ThemeToggle({ className = "", variant = "subtle" }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();
  const variantClass =
    variant === "solid"
      ? "bg-[var(--theme-button)] text-[var(--theme-button-text)] hover:bg-[var(--theme-button-hover)]"
      : "border border-[var(--theme-line)] bg-[var(--theme-panel-soft)] text-[var(--theme-ink)] hover:bg-[var(--theme-panel)]";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex justify-center px-4 py-2 text-sm font-semibold transition ${variantClass} ${className}`}
      aria-label={`Ativar modo ${isDark ? "claro" : "escuro"}`}
    >
      {isDark ? "Modo claro" : "Modo escuro"}
    </button>
  );
}
