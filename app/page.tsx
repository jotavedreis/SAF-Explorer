import Link from "next/link";

export default function Home() {
  return (
    <main className="relative isolate min-h-dvh overflow-hidden bg-[#f5f0e7] px-4 py-5 text-[#18261f] sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(120,174,76,0.2),_transparent_35%),radial-gradient(circle_at_80%_15%,_rgba(223,177,96,0.18),_transparent_28%),linear-gradient(180deg,_#f9f7f2_0%,_#f5f0e7_52%,_#edf1e8_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(24,38,31,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(24,38,31,0.04)_1px,transparent_1px)] bg-[size:56px_56px] opacity-25" />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <nav className="global-panel flex flex-col gap-4 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-lime-500 via-emerald-500 to-teal-700 text-sm font-black text-white shadow-lg shadow-emerald-900/20">
              SAF
            </span>
            <span>
              <span className="block text-sm font-bold text-[#1f3127]">SAF Explorer</span>
              <span className="block text-xs text-[#657268]">Catálogo agroflorestal</span>
            </span>
          </Link>

          <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center">
            <Link
              href="/especies"
              className="rounded-full px-3 py-2 text-center text-sm font-semibold text-[#334a39] transition hover:bg-[#edf4e5]"
            >
              Plantas
            </Link>
            <Link
              href="/solo"
              className="rounded-full px-3 py-2 text-center text-sm font-semibold text-[#334a39] transition hover:bg-[#edf4e5]"
            >
              Solo
            </Link>
            <Link
              href="/admin"
              className="rounded-full bg-[#27412f] px-3 py-2 text-center text-sm font-semibold text-white transition hover:bg-[#1b2e22]"
            >
              Admin
            </Link>
          </div>
        </nav>

        <section className="grid gap-5 lg:grid-cols-[1.12fr_0.88fr] lg:items-stretch">
          <div className="global-panel flex flex-col justify-center p-5 sm:p-8 lg:min-h-[33rem] lg:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6f7f6b] sm:tracking-[0.32em]">
              Ferramenta digital para sistemas agroflorestais
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-[#1d2d24] sm:text-5xl lg:text-6xl">
              Organize plantas, funções ecológicas e leitura de solo em um só lugar.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#516156] sm:text-lg sm:leading-8">
              Consulte espécies agroflorestais, relações entre plantas, nutrientes, disponibilidade por pH e sintomas
              nutricionais com uma experiência clara para campo, estudo e gestão.
            </p>

            <div className="mt-7 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
              <Link
                href="/especies"
                className="rounded-full bg-[#27412f] px-6 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-emerald-950/10 transition hover:bg-[#1b2e22]"
              >
                Explorar plantas
              </Link>
              <Link
                href="/solo"
                className="rounded-full border border-[#cfd8c7] bg-white/85 px-6 py-3 text-center text-sm font-semibold text-[#27412f] transition hover:bg-[#f7faf3]"
              >
                Ver química do solo
              </Link>
            </div>
          </div>

          <aside className="grid gap-4">
            <div className="global-card overflow-hidden">
              <div className="bg-[linear-gradient(135deg,_#27412f,_#5d7b1f)] p-5 text-white sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-lime-100">Visão geral</p>
                <p className="mt-4 text-5xl font-black">SAF</p>
                <p className="mt-2 max-w-sm text-sm leading-6 text-lime-50/90">
                  Uma base viva para conectar biodiversidade, manejo e fertilidade do solo.
                </p>
              </div>
              <div className="grid gap-3 p-4 sm:grid-cols-3 sm:p-5 lg:grid-cols-1">
                <MetricCard label="Catálogo" value="Base" text="Espécies organizadas para consulta pública." />
                <MetricCard label="Manejo" value="pH" text="Leitura visual da disponibilidade de nutrientes." />
                <MetricCard label="Relações" value="Rede" text="Associações entre plantas para planejar melhor." />
              </div>
            </div>
          </aside>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <HomeModule
            href="/especies"
            eyebrow="Catálogo"
            title="Espécies agroflorestais"
            text="Pesquise por nome, filtre por função e abra detalhes com categoria, explicação e relações."
          />
          <HomeModule
            href="/solo"
            eyebrow="Solo"
            title="Nutrientes e pH"
            text="Compare disponibilidade, fontes naturais e sintomas de deficiência em um painel visual."
          />
          <HomeModule
            href="/admin"
            eyebrow="Gestão"
            title="Área administrativa"
            text="Atualize plantas, categorias, funções, relações e dados do solo em uma interface organizada."
          />
        </section>

        <section className="global-panel mb-5 p-5 sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6f7f6b]">Fluxo de uso</p>
              <h2 className="mt-2 text-2xl font-semibold text-[#1f3127] sm:text-3xl">
                Da consulta rápida ao manejo informado.
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <ProcessStep number="01" title="Encontrar" text="Localize uma planta ou sintoma." />
              <ProcessStep number="02" title="Entender" text="Veja funções, nutrientes e relações." />
              <ProcessStep number="03" title="Decidir" text="Use os dados para orientar o manejo." />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function MetricCard({ label, text, value }: { label: string; text: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#f8faf5] p-4">
      <p className="text-2xl font-bold text-[#1f3127]">{value}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#738072]">{label}</p>
      <p className="mt-2 text-sm leading-6 text-[#657268]">{text}</p>
    </div>
  );
}

function HomeModule({
  eyebrow,
  href,
  text,
  title,
}: {
  eyebrow: string;
  href: string;
  text: string;
  title: string;
}) {
  return (
    <Link
      href={href}
      className="global-card group block p-5 transition hover:-translate-y-0.5 hover:bg-[#edf4e5] hover:shadow-[0_24px_60px_rgba(40,52,38,0.12)] sm:p-6"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#738072]">{eyebrow}</p>
      <h2 className="mt-3 text-xl font-semibold text-[#1f3127]">{title}</h2>
      <p className="mt-2 text-sm leading-7 text-[#657268]">{text}</p>
      <span className="mt-5 inline-flex text-sm font-semibold text-[#36543d] transition group-hover:translate-x-1">
        Acessar
      </span>
    </Link>
  );
}

function ProcessStep({ number, text, title }: { number: string; text: string; title: string }) {
  return (
    <div className="rounded-2xl border border-[#dfe5d9] bg-white/85 p-4">
      <p className="text-xs font-black text-[#5d7b1f]">{number}</p>
      <h3 className="mt-2 font-semibold text-[#1f3127]">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-[#657268]">{text}</p>
    </div>
  );
}
