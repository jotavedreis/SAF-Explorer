import Link from "next/link";

export default function Home() {
  return (
    <main className="relative isolate flex min-h-screen items-center overflow-hidden bg-[#f5f0e7] px-4 py-12 text-[#18261f] sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(120,174,76,0.2),_transparent_35%),radial-gradient(circle_at_80%_15%,_rgba(223,177,96,0.18),_transparent_28%),linear-gradient(180deg,_#f9f7f2_0%,_#f5f0e7_52%,_#edf1e8_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(24,38,31,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(24,38,31,0.04)_1px,transparent_1px)] bg-[size:56px_56px] opacity-25" />

      <section className="mx-auto grid w-full max-w-5xl gap-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-lime-500 via-emerald-500 to-teal-700 text-lg font-black text-white shadow-lg shadow-emerald-900/20">
          SAF
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#6f7f6b]">
            Ferramenta digital para sistema agroflorestal
          </p>
          <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-[#1d2d24] sm:text-6xl">
            Consulte plantas, funções ecológicas e informações de fertilidade do solo.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#516156] sm:text-lg">
            O site reúne espécies agroflorestais, relações entre plantas, nutrientes do solo,
            disponibilidade por pH e diagnóstico visual de sintomas nutricionais.
          </p>
        </div>

        <div className="mx-auto flex flex-wrap justify-center gap-3">
          <Link
            href="/especies"
            className="rounded-full bg-[#27412f] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-950/10 transition hover:bg-[#1b2e22]"
          >
            Ver plantas
          </Link>
          <Link
            href="/solo"
            className="rounded-full border border-[#cfd8c7] bg-white/80 px-6 py-3 text-sm font-semibold text-[#27412f] transition hover:bg-[#f7faf3]"
          >
            Ver química do solo
          </Link>
        </div>
      </section>
    </main>
  );
}
