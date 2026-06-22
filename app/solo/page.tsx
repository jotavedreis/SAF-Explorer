import { createClient } from "@/lib/supabase/server";
import { HeaderActionsMenu } from "../header-actions-menu";
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
    supabase.from("ph_disponibilidade").select("ph_ponto_id, nutriente_id, disponibilidade_pct, descricao"),
    supabase.from("sintoma_visual").select("id, descricao, nutriente_id").order("descricao", { ascending: true }),
  ]);

  const nutrients: NutrientRow[] = nutrientsResult.data ?? [];
  const phPoints: PhPointRow[] = phPointsResult.data ?? [];
  const availability: PhAvailabilityRow[] = availabilityResult.data ?? [];
  const symptoms: VisualSymptomRow[] = symptomsResult.data ?? [];

  return (
    <div className="catalog-page">
      <main className="mx-auto w-full max-w-7xl">
        <header className="global-panel relative z-50 p-4 sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--theme-kicker)] sm:tracking-[0.3em]">
                Química do solo
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--theme-ink)] sm:text-5xl">
                Nutrientes, pH e diagnóstico visual
              </h1>
              <p className="mt-3 text-base leading-8 text-[var(--theme-muted)] sm:text-lg">
                Consulte funções dos nutrientes, disponibilidade por pH e sintomas associados a deficiências.
              </p>
            </div>

            <div className="flex w-full justify-end sm:w-auto">
              <HeaderActionsMenu
                links={[
                  { href: "/", label: "Início" },
                  { href: "/especies", label: "Ver plantas" },
                  { href: "/admin", label: "Admin" },
                ]}
              />
            </div>
          </div>
        </header>

        <SoilDashboard availability={availability} nutrients={nutrients} phPoints={phPoints} symptoms={symptoms} />
      </main>
    </div>
  );
}
