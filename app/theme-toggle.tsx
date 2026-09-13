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
    className={`inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold transition ${variantClass} ${className}`}
    aria-label={`Ativar modo ${isDark ? "claro" : "escuro"}`}
  >
    <img
      src={isDark ? "/images/icones/sun_icon.png" : "/images/icones/moon_icon.png"}
      alt=""
      className="h-5 w-5 object-contain"
    />
    <span className="flex w-full justify-end sm:w-auto font-semibold">
      {isDark ? "Modo claro" : "Modo escuro"}
    </span>
  </button>
  );
}
