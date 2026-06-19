import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SpeciesGallery } from "./species-gallery";

type SpeciesRow = {
  id: number;
  nome_popular: string;
  nome_cientifico: string | null;
  categoria_id: number;
  foto_url: string | null;
  explicacao: string | null;
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
      .select("id, nome_popular, nome_cientifico, categoria_id, foto_url, explicacao")
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
        <header className="global-panel p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#6d7d66]">
                Catalogo publico
              </p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[#1d2d24] sm:text-5xl">
                Plantas cadastradas no site
              </h1>
              <p className="mt-3 text-base leading-8 text-[#516156] sm:text-lg">
                Veja especies, funcoes da planta, explicacoes simples e relacoes agroflorestais cadastradas.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link href="/solo" className="inline-flex rounded-full border border-[#d7dfcf] bg-[#f7faf3] px-4 py-2 text-sm font-semibold text-[#294032] transition hover:bg-[#edf4e5]">
                Quimica do solo
              </Link>
              <Link href="/" className="inline-flex rounded-full bg-[#5d7b1f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#4d6819]">
                Inicio
              </Link>
              <Link href="/admin" className="inline-flex rounded-full bg-[#5d7b1f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#4d6819]">
                Admin
              </Link>
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
