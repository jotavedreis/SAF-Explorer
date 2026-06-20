import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SoilDashboard } from "./soil-dashboard";

type NutrientRow = {
  id: number;
  simbolo: string;
  nome: string;
  funcao_na_planta: string | null;
  sintomas_deficiencia: string | null;
  fontes_naturais: string | null;
};

type PhPointRow = {
  id: number;
  ph_valor: number;
  descricao_acidez: string | null;
  atividade_biologica: string | null;
  presenca_aluminio: string | null;
};

type PhAvailabilityRow = {
  ph_ponto_id: number;
  nutriente_id: number;
  disponibilidade_pct: number;
  descricao: string | null;
};

type VisualSymptomRow = {
  id: number;
  descricao: string;
  nutriente_id: number;
};

export default async function SoilPage() {
  const supabase = await createClient();

  const [nutrientsResult, phPointsResult, availabilityResult, symptomsResult] = await Promise.all([
    supabase
      .from("nutriente")
      .select("id, simbolo, nome, funcao_na_planta, sintomas_deficiencia, fontes_naturais")
      .order("id", { ascending: true }),
    supabase
      .from("ph_ponto")
      .select("id, ph_valor, descricao_acidez, atividade_biologica, presenca_aluminio")
      .order("ph_valor", { ascending: true }),
    supabase
      .from("ph_disponibilidade")
      .select("ph_ponto_id, nutriente_id, disponibilidade_pct, descricao"),
    supabase.from("sintoma_visual").select("id, descricao, nutriente_id").order("descricao", { ascending: true }),
  ]);

  const nutrients: NutrientRow[] = nutrientsResult.data ?? [];
  const phPoints: PhPointRow[] = phPointsResult.data ?? [];
  const availability: PhAvailabilityRow[] = availabilityResult.data ?? [];
  const symptoms: VisualSymptomRow[] = symptomsResult.data ?? [];

  return (
    <div className="catalog-page">
      <main className="mx-auto w-full max-w-7xl">
        <header className="global-panel p-4 sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6d7d66] sm:tracking-[0.3em]">
                Química do solo
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#1d2d24] sm:text-5xl">
                Nutrientes, pH e diagnóstico visual
              </h1>
              <p className="mt-3 text-base leading-8 text-[#516156] sm:text-lg">
                Consulte funções dos nutrientes, disponibilidade por pH e sintomas associados a deficiências.
              </p>
            </div>

            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
              <Link href="/" className="inline-flex justify-center rounded-full border border-[#d7dfcf] bg-white/80 px-4 py-2 text-sm font-semibold text-[#294032] transition hover:bg-[#f7faf3]">
                Início
              </Link>
              <Link href="/especies" className="inline-flex justify-center rounded-full border border-[#d7dfcf] bg-[#f7faf3] px-4 py-2 text-sm font-semibold text-[#294032] transition hover:bg-[#edf4e5]">
                Ver plantas
              </Link>
              <Link href="/admin" className="inline-flex justify-center rounded-full bg-[#5d7b1f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#4d6819]">
                Admin
              </Link>
            </div>
          </div>
        </header>

        <SoilDashboard
          availability={availability}
          nutrients={nutrients}
          phPoints={phPoints}
          symptoms={symptoms}
        />
      </main>
    </div>
  );
}
