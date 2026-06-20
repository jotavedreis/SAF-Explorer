import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminDataForms } from "./admin-data-forms";
import { CreatePlantButton } from "./create-plant-button";
import { LogoutButton } from "./logout-button";
import { PlantRow } from "./plant-row";

export const dynamic = "force-dynamic";

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
};

type NutrientRow = {
  id: number;
  simbolo: string;
  nome: string;
};

type PhPointRow = {
  id: number;
  ph_valor: number;
};

type VisualSymptomRow = {
  id: number;
  descricao: string;
};

export default async function AdminPage() {
  const supabase = createAdminClient();

  const [
    speciesResult,
    categoriesResult,
    functionsResult,
    speciesFunctionsResult,
    relationTypesResult,
    nutrientsResult,
    phPointsResult,
    symptomsResult,
  ] = await Promise.all([
    supabase
      .from("species")
      .select("id, nome_popular, nome_cientifico, categoria_id, foto_url, explicacao")
      .order("nome_popular", { ascending: true }),
    supabase.from("categoria").select("id, nome").order("nome", { ascending: true }),
    supabase.from("funcao").select("id, nome").order("nome", { ascending: true }),
    supabase.from("species_functions").select("species_id, funcao_id"),
    supabase.from("tipo_relacao").select("id, nome, nome_reverso").order("nome", { ascending: true }),
    supabase.from("nutriente").select("id, simbolo, nome").order("id", { ascending: true }),
    supabase.from("ph_ponto").select("id, ph_valor").order("ph_valor", { ascending: true }),
    supabase.from("sintoma_visual").select("id, descricao").order("descricao", { ascending: true }),
  ]);

  const plants: SpeciesRow[] = speciesResult.data ?? [];
  const categories: CategoryRow[] = categoriesResult.data ?? [];
  const functions: FunctionRow[] = functionsResult.data ?? [];
  const speciesFunctions: SpeciesFunctionRow[] = speciesFunctionsResult.data ?? [];
  const relationTypes: RelationTypeRow[] = relationTypesResult.data ?? [];
  const nutrients: NutrientRow[] = nutrientsResult.data ?? [];
  const phPoints: PhPointRow[] = phPointsResult.data ?? [];
  const symptoms: VisualSymptomRow[] = symptomsResult.data ?? [];
  const categoryMap = new Map(categories.map((category) => [category.id, category.nome]));
  const functionMap = new Map(functions.map((funcao) => [funcao.id, funcao.nome]));
  const speciesFunctionMap = speciesFunctions.reduce<Map<number, FunctionRow[]>>((acc, item) => {
    const functionName = functionMap.get(item.funcao_id);

    if (!functionName) {
      return acc;
    }

    acc.set(item.species_id, [...(acc.get(item.species_id) ?? []), { id: item.funcao_id, nome: functionName }]);
    return acc;
  }, new Map());
  const hasLoadError = Boolean(
    speciesResult.error ||
      categoriesResult.error ||
      functionsResult.error ||
      speciesFunctionsResult.error ||
      relationTypesResult.error ||
      nutrientsResult.error ||
      phPointsResult.error ||
      symptomsResult.error
  );

  const categoryCount = plants.reduce<Map<number, number>>((acc, plant) => {
    acc.set(plant.categoria_id, (acc.get(plant.categoria_id) ?? 0) + 1);
    return acc;
  }, new Map());

  const topCategories = Array.from(categoryCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#eef3e8] px-3 py-4 text-[#1b2b21] sm:px-6 sm:py-6 lg:px-8">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-5 sm:gap-6">
        <header className="rounded-[24px] border border-[#d7dfcf] bg-white/90 p-4 shadow-[0_18px_60px_rgba(30,48,38,0.08)] backdrop-blur sm:sticky sm:top-4 sm:z-40 sm:rounded-[32px] sm:p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3 sm:items-center sm:gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-lime-500 via-emerald-500 to-teal-700 text-sm font-black text-white shadow-lg shadow-emerald-900/20 sm:h-14 sm:w-14">
                SAF
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#738072] sm:tracking-[0.28em]">
                  Área administrativa
                </p>
                <h1 className="mt-1 text-2xl font-semibold text-[#1f3127] sm:text-3xl">
                  Gerenciamento de espécies
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-[#5a685e]">
                  Cadastre, revise e remova espécies com uma interface clara, objetiva e profissional.
                </p>
              </div>
            </div>

            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
              <Link
                href="/especies"
                className="rounded-full border border-[#d7dfcf] bg-[#f7faf3] px-4 py-2 text-center text-sm font-medium text-[#294032] transition hover:bg-[#edf4e5]"
              >
                Voltar ao site
              </Link>
              <LogoutButton />
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-[22px] border border-[#dae2d0] bg-white p-4 shadow-sm sm:rounded-[28px] sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6d796f]">
              Total de espécies
            </p>
            <p className="mt-3 text-4xl font-semibold text-[#1e3026]">{plants.length}</p>
            <p className="mt-2 text-sm text-[#637268]">Registros disponíveis no catálogo.</p>
          </article>

          <article className="rounded-[22px] border border-[#dae2d0] bg-white p-4 shadow-sm sm:rounded-[28px] sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6d796f]">
              Último cadastro
            </p>
            <p className="mt-3 text-lg font-semibold text-[#1e3026]">
              {plants[0] ? plants[0].nome_popular : "Nenhum cadastro ainda"}
            </p>
            <p className="mt-2 text-sm text-[#637268]">
              {plants[0] ? plants[0].nome_cientifico ?? "Sem nome científico" : "O primeiro item será exibido aqui."}
            </p>
          </article>

          <article className="rounded-[22px] border border-[#dae2d0] bg-white p-4 shadow-sm sm:rounded-[28px] sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6d796f]">
              Categorias em uso
            </p>
            <p className="mt-3 text-sm text-[#415046]">
              {topCategories.length > 0
                ? topCategories.map(([categoryId, count]) => `${categoryMap.get(categoryId) ?? categoryId} (${count})`).join(" · ")
                : "Sem dados"}
            </p>
                <p className="mt-2 text-sm text-[#637268]">
                  Distribuição resumida dos registros cadastrados.
                </p>
          </article>
        </section>

        <section className="grid gap-6">
          <div className="space-y-5 sm:space-y-6">
            <section className="rounded-[24px] border border-[#dae2d0] bg-white p-4 shadow-sm sm:rounded-[30px] sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#738072]">
                    Novo cadastro
                  </p>
                  <h2 className="mt-1 text-xl font-semibold text-[#1f3127]">Criar nova planta</h2>
                  <p className="mt-1 text-sm text-[#657268]">
                    Abra uma janela organizada para preencher e publicar uma nova espécie no catálogo.
                  </p>
                </div>
                <CreatePlantButton categories={categories} />
              </div>
            </section>

            <AdminDataForms
              categories={categories}
              functions={functions}
              nutrients={nutrients}
              phPoints={phPoints}
              relationTypes={relationTypes}
              species={plants.map((plant) => ({
                id: plant.id,
                nome_popular: plant.nome_popular,
              }))}
              symptoms={symptoms}
            />

            <section className="rounded-[24px] border border-[#dae2d0] bg-white p-4 shadow-sm sm:rounded-[30px] sm:p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-[#1f3127]">Plantas cadastradas</h2>
                  <p className="text-sm text-[#657268]">
                    Visualização completa das espécies publicadas no catálogo.
                  </p>
                </div>
                <span className="rounded-full bg-[#edf4e2] px-3 py-1 text-xs font-semibold text-[#5e7247]">
                  {plants.length} itens
                </span>
              </div>

              {hasLoadError ? (
                <p className="mt-4 rounded-2xl bg-amber-100 px-4 py-3 text-sm text-amber-900">
                  Não foi possível carregar a lista. Verifique se as tabelas species e categoria já existem no Supabase.
                </p>
              ) : null}

              {plants.length === 0 ? (
                <div className="mt-5 rounded-[24px] border border-dashed border-[#d8e0d1] bg-[#f8faf5] px-5 py-8 text-center">
                  <p className="text-sm font-medium text-[#526255]">Nenhuma espécie cadastrada ainda.</p>
                  <p className="mt-2 text-sm text-[#738076]">
                    Use o formulário ao lado para publicar o primeiro registro.
                  </p>
                </div>
              ) : (
                <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {plants.map((plant) => (
                    <PlantRow
                      key={plant.id}
                      categories={categories}
                      categoryName={categoryMap.get(plant.categoria_id) ?? String(plant.categoria_id)}
                      functions={speciesFunctionMap.get(plant.id) ?? []}
                      plant={plant}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}
