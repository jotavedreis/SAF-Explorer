"use client";

import Link from "next/link";
import { useState } from "react";
import { useTheme } from "./theme-context";

const backgroundImage = "/images/palmeira-planta-2.jpeg";

const groupMembers = [
  {
    affiliation: "Licenciatura em Química, Universidade do Estado do Pará (UEPA)",
    email: "I7165135@gmail.com",
    name: "Isabelle da Silva da Cunha",
  },
  {
    affiliation: "ISARH/Universidade Federal Rural da Amazônia (UFRA)",
    email: "gabriel.resque@ufra.edu.br",
    name: "Antonio Gabriel Lima Resque",
  },
  {
    affiliation: "ICA/Universidade Federal Rural da Amazônia (UFRA)",
    email: "breno.rayol@ufra.edu.br",
    name: "Breno Pinto Rayol",
  },
  {
    affiliation: "INEAF/Universidade Federal do Pará (UFPA)",
    email: "ricardo.macedo.ns@gmail.com",
    name: "Ricardo Macedo do Nascimento",
  },
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const lineColor = isDark ? "border-white/12" : "border-[#233528]/18";
  const mutedText = isDark ? "text-white/58" : "text-[#1b2a20]/68";
  const kickerText = isDark ? "text-white/48" : "text-[#24362a]/58";
  const mainText = isDark ? "text-white" : "text-[#111b15]";
  const accentText = isDark ? "text-[#d9e6bd]" : "text-[#263e2b]";

  return (
    <main
      className={`relative min-h-dvh overflow-hidden px-3 py-3 transition-colors duration-500 sm:px-5 sm:py-4 lg:px-6 ${
        isDark ? "bg-[#080d09] text-[#f3f1e8]" : "bg-[#eef0e5] text-[#111b15]"
      }`}
    >
      <img
        src={backgroundImage}
        alt="Folhagem de monstera em fundo escuro"
        className={`fixed inset-0 h-full w-full scale-110 object-cover transition duration-500 ${
          isDark ? "opacity-75 grayscale" : "opacity-78"
        }`}
      />
      <div
        className={`pointer-events-none fixed inset-0 transition duration-500 ${
          isDark
            ? "bg-[linear-gradient(90deg,rgba(5,9,6,0.9)_0%,rgba(5,9,6,0.36)_44%,rgba(5,9,6,0.82)_100%),linear-gradient(180deg,rgba(5,9,6,0.08)_0%,rgba(5,9,6,0.48)_38%,rgba(5,9,6,0.82)_68%,#030604_100%)]"
            : "bg-[linear-gradient(90deg,rgba(238,240,229,0.56)_0%,rgba(238,240,229,0.12)_44%,rgba(238,240,229,0.5)_100%),linear-gradient(180deg,rgba(238,240,229,0.04)_0%,rgba(238,240,229,0.18)_46%,rgba(238,240,229,0.42)_78%,#eef0e5_100%)]"
        }`}
      />
      <div
        className={`pointer-events-none fixed inset-0 bg-[linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] bg-[size:72px_72px] opacity-20 ${
          isDark ? "text-white/20" : "text-[#203226]/20"
        }`}
      />
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 top-[88dvh] transition duration-500 ${
          isDark
            ? "bg-[linear-gradient(180deg,rgba(3,6,4,0)_0%,rgba(3,6,4,0.72)_10rem,rgba(3,6,4,0.9)_24rem,#020403_100%)]"
            : "bg-[linear-gradient(180deg,rgba(238,240,229,0)_0%,rgba(238,240,229,0.34)_14rem,rgba(238,240,229,0.68)_34rem,#eef0e5_100%)]"
        }`}
      />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col pt-16 sm:pt-14">
        <nav
          className={`fixed left-3 right-3 top-3 z-50 mx-auto max-w-7xl border text-[0.64rem] uppercase tracking-[0.12em] shadow-[0_18px_60px_rgba(0,0,0,0.12)] backdrop-blur-md transition-colors duration-500 sm:left-5 sm:right-5 sm:top-4 lg:left-6 lg:right-6 ${
            isDark
              ? "border-white/18 bg-[linear-gradient(90deg,rgba(3,6,4,0.58),rgba(3,6,4,0.24),rgba(3,6,4,0.54))] text-white/78"
              : "border-[#233528]/22 bg-[linear-gradient(90deg,rgba(238,240,229,0.88),rgba(238,240,229,0.58),rgba(238,240,229,0.86))] text-[#17241b]/82"
          }`}
        >
          <div className="flex items-center justify-between">
          <Link href="/" className="px-3 py-3 font-semibold">
            SAF Explorer
          </Link>
          <div className="hidden items-center text-right md:flex">
            <Link href="/especies" className={`border-l px-3 py-3 transition hover:bg-current/10 ${lineColor}`}>
              Plantas
            </Link>
            <Link href="/solo" className={`border-l px-3 py-3 transition hover:bg-current/10 ${lineColor}`}>
              Solo
            </Link>
            <Link href="/admin" className={`border-l px-3 py-3 transition hover:bg-current/10 ${lineColor}`}>
              Admin
            </Link>
            <button
              type="button"
              onClick={toggleTheme}
              className={`border-l px-3 py-3 text-left uppercase transition hover:bg-current/10 ${lineColor}`}
              aria-label={`Ativar modo ${isDark ? "claro" : "escuro"}`}
            >
              {isDark ? "Claro" : "Escuro"}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
            className={`flex items-center border-l px-3 py-3 md:hidden ${lineColor}`}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            <span className="grid gap-1">
              <span className={`block h-px w-5 ${isDark ? "bg-white/78" : "bg-[#17241b]/82"}`} />
              <span className={`block h-px w-5 ${isDark ? "bg-white/78" : "bg-[#17241b]/82"}`} />
              <span className={`block h-px w-5 ${isDark ? "bg-white/78" : "bg-[#17241b]/82"}`} />
            </span>
          </button>
          </div>

          {mobileMenuOpen ? (
            <div className={`border-t md:hidden ${lineColor}`}>
              <MobileNavLink href="/especies" label="Plantas" onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink href="/solo" label="Solo" onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink href="/admin" label="Admin" onClick={() => setMobileMenuOpen(false)} />
              <button
                type="button"
                onClick={() => {
                  toggleTheme();
                  setMobileMenuOpen(false);
                }}
                className={`block w-full border-t px-3 py-3 text-left uppercase transition hover:bg-current/10 ${lineColor}`}
              >
                {isDark ? "Modo claro" : "Modo escuro"}
              </button>
            </div>
          ) : null}
        </nav>

        <section className="relative min-h-[calc(100dvh-4.75rem)] sm:min-h-[calc(100dvh-5rem)]">
          <div className="flex min-h-[calc(100dvh-4.75rem)] flex-col justify-end px-1 pb-6 pt-16 sm:min-h-[calc(100dvh-5rem)] sm:px-3 lg:px-4 lg:pb-8">
            <p className={`mb-3 max-w-xs text-xs leading-5 sm:mb-4 ${isDark ? "text-white/76" : "text-[#111b15]/74"}`}>
              Ferramenta digital para observar espécies, funções ecológicas e fertilidade do solo em sistemas
              agroflorestais.
            </p>
            <div className="grid gap-7 lg:grid-cols-[1fr_20rem] lg:items-end">
              <div>
                <h1
                  className={`max-w-5xl text-6xl font-semibold leading-[0.9] tracking-[-0.05em] sm:text-8xl lg:text-[8.8rem] ${mainText}`}
                >
                  SAF
                  <span className={isDark ? "block text-white/78" : "block text-[#111b15]/72"}>Explorer</span>
                </h1>
                <p className={`mt-5 max-w-2xl text-base leading-7 sm:text-lg ${isDark ? "text-white/72" : "text-[#111b15]/72"}`}>
                  Organize plantas, relações ecológicas, nutrientes e sintomas visuais em uma experiência limpa,
                  precisa e pronta para consulta.
                </p>
              </div>

              <div className="lg:pb-2">
                <p className={`text-[0.65rem] font-semibold uppercase tracking-[0.24em] ${kickerText}`}>Acesso rápido</p>
                <div className="mt-4 grid gap-3">
                  <HomeAction accentText={accentText} href="/especies" isDark={isDark} label="Explorar plantas" />
                  <HomeAction accentText={accentText} href="/solo" isDark={isDark} label="Ver química do solo" />
                  <HomeAction accentText={accentText} href="/admin" isDark={isDark} label="Área administrativa" />
                </div>
              </div>
            </div>

            <div className={`mt-9 flex flex-wrap gap-x-8 gap-y-3 border-t pt-4 ${lineColor}`}>
              {["Catálogo", "Manejo", "Relações", "Sintomas", "pH"].map((item) => (
                <p key={item} className={`text-[0.64rem] font-semibold uppercase tracking-[0.18em] ${kickerText}`}>
                  {item}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className={`grid gap-x-10 gap-y-8 border-t py-12 md:grid-cols-3 lg:py-16 ${lineColor}`}>
          <HomeModule
            accentText={accentText}
            eyebrow="Catálogo"
            href="/especies"
            kickerText={kickerText}
            mainText={mainText}
            mutedText={mutedText}
            title="Espécies agroflorestais"
            text="Pesquise por nome, filtre por função e abra detalhes com categoria, explicação e relações."
          />
          <HomeModule
            accentText={accentText}
            eyebrow="Solo"
            href="/solo"
            kickerText={kickerText}
            mainText={mainText}
            mutedText={mutedText}
            title="Nutrientes e pH"
            text="Compare disponibilidade, fontes naturais e sintomas de deficiência em um painel visual."
          />
          <HomeModule
            accentText={accentText}
            eyebrow="Gestão"
            href="/admin"
            kickerText={kickerText}
            mainText={mainText}
            mutedText={mutedText}
            title="Área administrativa"
            text="Atualize plantas, categorias, funções, relações e dados do solo em uma interface organizada."
          />
        </section>

        <section className={`grid gap-x-12 gap-y-8 border-t py-12 lg:grid-cols-[0.85fr_1.15fr] lg:py-16 ${lineColor}`}>
          <div>
            <p className={`text-xs font-semibold uppercase tracking-[0.22em] ${kickerText}`}>Fluxo de uso</p>
            <h2 className={`mt-3 max-w-xl text-3xl font-semibold tracking-[-0.04em] sm:text-4xl ${mainText}`}>
              Da consulta rápida ao manejo informado.
            </h2>
          </div>
          <div className="grid gap-7 sm:grid-cols-3">
            <ProcessStep
              accentText={accentText}
              lineColor={lineColor}
              mainText={mainText}
              mutedText={mutedText}
              number="01"
              title="Encontrar"
              text="Localize uma planta ou sintoma."
            />
            <ProcessStep
              accentText={accentText}
              lineColor={lineColor}
              mainText={mainText}
              mutedText={mutedText}
              number="02"
              title="Entender"
              text="Veja funções, nutrientes e relações."
            />
            <ProcessStep
              accentText={accentText}
              lineColor={lineColor}
              mainText={mainText}
              mutedText={mutedText}
              number="03"
              title="Decidir"
              text="Use os dados para orientar o manejo."
            />
          </div>
        </section>

        <section className={`border-t py-12 lg:py-16 ${lineColor}`}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-[0.22em] ${kickerText}`}>Equipe</p>
              <h2 className={`mt-2 text-3xl font-semibold tracking-[-0.04em] ${mainText}`}>Integrantes do grupo</h2>
            </div>
            <p className={`max-w-xl text-sm leading-6 ${mutedText}`}>
              Nomes, vínculos institucionais e contatos dos responsáveis pelo desenvolvimento e organização do SAF
              Explorer.
            </p>
          </div>

          <div className="mt-8 grid gap-x-10 gap-y-7 md:grid-cols-2">
            {groupMembers.map((member) => (
              <MemberCard
                key={member.name}
                {...member}
                accentText={accentText}
                lineColor={lineColor}
                mainText={mainText}
                mutedText={mutedText}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function HomeAction({
  accentText,
  href,
  isDark,
  label,
}: {
  accentText: string;
  href: string;
  isDark: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={`group flex items-center justify-between border-b py-3 text-sm font-semibold transition hover:translate-x-1 ${
        isDark ? "border-white/20 hover:border-white/60" : "border-[#233528]/22 hover:border-[#233528]/60"
      } ${accentText}`}
    >
      {label}
      <span aria-hidden="true">-&gt;</span>
    </Link>
  );
}

function MobileNavLink({ href, label, onClick }: { href: string; label: string; onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="block border-t border-current/15 px-3 py-3 transition hover:bg-current/10">
      {label}
    </Link>
  );
}

function HomeModule({
  accentText,
  eyebrow,
  href,
  kickerText,
  mainText,
  mutedText,
  text,
  title,
}: {
  accentText: string;
  eyebrow: string;
  href: string;
  kickerText: string;
  mainText: string;
  mutedText: string;
  text: string;
  title: string;
}) {
  return (
    <Link href={href} className="group block">
      <p className={`text-xs font-semibold uppercase tracking-[0.22em] ${kickerText}`}>{eyebrow}</p>
      <h2 className={`mt-4 text-2xl font-semibold tracking-[-0.03em] ${mainText}`}>{title}</h2>
      <p className={`mt-3 text-sm leading-7 ${mutedText}`}>{text}</p>
      <span className={`mt-6 inline-flex border-b pb-1 text-sm font-semibold transition group-hover:translate-x-1 ${accentText}`}>
        Acessar
      </span>
    </Link>
  );
}

function ProcessStep({
  accentText,
  lineColor,
  mainText,
  mutedText,
  number,
  text,
  title,
}: {
  accentText: string;
  lineColor: string;
  mainText: string;
  mutedText: string;
  number: string;
  text: string;
  title: string;
}) {
  return (
    <div className={`border-t pt-4 ${lineColor}`}>
      <p className={`text-xs font-black ${accentText}`}>{number}</p>
      <h3 className={`mt-8 text-lg font-semibold ${mainText}`}>{title}</h3>
      <p className={`mt-2 text-sm leading-6 ${mutedText}`}>{text}</p>
    </div>
  );
}

function MemberCard({
  accentText,
  affiliation,
  email,
  lineColor,
  mainText,
  mutedText,
  name,
}: {
  accentText: string;
  affiliation: string;
  email: string;
  lineColor: string;
  mainText: string;
  mutedText: string;
  name: string;
}) {
  return (
    <article className={`border-t pt-4 ${lineColor}`}>
      <p className={`text-lg font-semibold ${mainText}`}>{name}</p>
      <p className={`mt-2 text-sm leading-6 ${mutedText}`}>{affiliation}</p>
      {email ? (
        <a href={`mailto:${email}`} className={`mt-3 inline-flex border-b pb-1 text-sm font-semibold transition ${accentText}`}>
          {email}
        </a>
      ) : (
        <p className={`mt-3 text-sm font-semibold ${mutedText}`}>Email a informar</p>
      )}
    </article>
  );
}
