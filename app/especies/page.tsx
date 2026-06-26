import { createClient } from "@/lib/supabase/server";
import { HeaderActionsMenu } from "../header-actions-menu";
import { SpeciesGallery } from "./species-gallery";

type SpeciesRow = {
  id: number;
  nome_popular: string;
  nome_cientifico: string | null;
  categoria_id: number;
  grupo_funcional: string | null;
  foto_url: string | null;
  altura: string | null;
  espacamento_planta: string | null;
  tempo_producao: string | null;
  estabelecimento_planta: string | null;
  solo_planta: string | null;
  ph_planta: string | null;
  explicacao: string | null;
  ciclagem_sistema: string | null;
  fornece_planta: string | null;
  demanda_planta: string | null;
};

type CategoryRow = {
  id: number;
  nome: string;
};

type FunctionRow = {
  id: number;
  nome: string;
};

type SpeciesFunctionRow = {
  species_id: number;
  funcao_id: number;
};

type RelationTypeRow = {
  id: number;
  nome: string;
  nome_reverso: string;
  simetrica: boolean;
};

type SpeciesRelationRow = {
  id: number;
  from_species_id: number;
  to_species_id: number;
  tipo_relacao_id: number;
};

export default async function SpeciesCatalogPage() {
  const supabase = await createClient();

  const [
    speciesResult,
    categoriesResult,
    functionsResult,
    speciesFunctionsResult,
    relationTypesResult,
    relationsResult,
  ] = await Promise.all([
    supabase
      .from("species")
      .select("id, nome_popular, nome_cientifico, categoria_id, grupo_funcional, foto_url, altura, espacamento_planta, tempo_producao, estabelecimento_planta, solo_planta, ph_planta, explicacao, ciclagem_sistema, fornece_planta, demanda_planta")
      .order("nome_popular", { ascending: true })
      .limit(100),
    supabase.from("categoria").select("id, nome").order("nome", { ascending: true }),
    supabase.from("funcao").select("id, nome").order("nome", { ascending: true }),
    supabase.from("species_functions").select("species_id, funcao_id"),
    supabase.from("tipo_relacao").select("id, nome, nome_reverso, simetrica"),
    supabase.from("species_relations").select("id, from_species_id, to_species_id, tipo_relacao_id"),
  ]);

  const species: SpeciesRow[] = speciesResult.data ?? [];
  const categories: CategoryRow[] = categoriesResult.data ?? [];
  const functions: FunctionRow[] = functionsResult.data ?? [];
  const speciesFunctions: SpeciesFunctionRow[] = speciesFunctionsResult.data ?? [];
  const relationTypes: RelationTypeRow[] = relationTypesResult.data ?? [];
  const relations: SpeciesRelationRow[] = relationsResult.data ?? [];

  return (
    <div className="catalog-page">
      <main className="mx-auto w-full max-w-7xl">
        <header className="global-panel relative z-50 p-4 sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--theme-kicker)] sm:tracking-[0.3em]">
                Catálogo público
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--theme-ink)] sm:text-5xl">
                Plantas cadastradas no site
              </h1>
              <p className="mt-3 text-base leading-8 text-[var(--theme-muted)] sm:text-lg">
                Veja espécies, funções da planta, explicações simples e relações agroflorestais cadastradas.
              </p>
            </div>

            <div className="flex w-full justify-end sm:w-auto">
              <HeaderActionsMenu
                links={[
                  { href: "/", label: "Início" },
                  { href: "/solo", label: "Química do solo" },
                  { href: "/admin", label: "Admin" },
                ]}
              />
            </div>
          </div>
        </header>

        <SpeciesGallery
          categories={categories}
          functions={functions}
          relationTypes={relationTypes}
          relations={relations}
          species={species}
          speciesFunctions={speciesFunctions}
        />
      </main>
    </div>
  );
}
