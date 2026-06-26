import { createAdminClient } from "@/lib/supabase/admin";
import { AdminActionsMenu } from "./admin-actions-menu";
import { AdminDataForms } from "./admin-data-forms";
import { CreatePlantButton } from "./create-plant-button";
import { PlantRow } from "./plant-row";

export const dynamic = "force-dynamic";

const backgroundImage = "/images/palmeira-planta.jpg";

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
      .select("id, nome_popular, nome_cientifico, categoria_id, grupo_funcional, foto_url, altura, espacamento_planta, tempo_producao, estabelecimento_planta, solo_planta, ph_planta, explicacao, ciclagem_sistema, fornece_planta, demanda_planta")
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
    <div className="admin-theme-page relative z-[100] min-h-screen overflow-hidden bg-[#eef0e5] px-3 py-4 text-[#111b15] sm:px-6 sm:py-6 lg:px-8">
      <img
        src={backgroundImage}
        alt=""
        className="fixed inset-0 h-full w-full scale-110 object-cover opacity-25 blur-md"
      />
      <div className="admin-bg-overlay pointer-events-none fixed inset-0 bg-[linear-gradient(90deg,rgba(238,240,229,0.92),rgba(238,240,229,0.74),rgba(238,240,229,0.94)),linear-gradient(180deg,rgba(238,240,229,0.2),#eef0e5_72%)]" />
      <div className="admin-bg-grid pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(32,50,38,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(32,50,38,0.045)_1px,transparent_1px)] bg-[size:72px_72px] opacity-50" />

      <main className="relative mx-auto flex w-full max-w-7xl flex-col gap-5 sm:gap-6">
        <header className="admin-shell-panel relative z-50 border border-[#243528]/18 bg-[#f4f5eb]/82 p-4 shadow-[0_22px_70px_rgba(17,27,21,0.12)] backdrop-blur-md sm:p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-[#12251a] text-sm font-black text-[#e7f2cf] shadow-[0_18px_45px_rgba(18,37,26,0.2)] sm:h-14 sm:w-14">
                SAF
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#24362a]/58">
                  Área administrativa
                </p>
                <h1 className="mt-1 text-3xl font-semibold tracking-[-0.04em] text-[#111b15] sm:text-4xl">
                  Gerenciamento de espécies
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-[#1b2a20]/68">
                  Cadastre, revise e remova espécies com uma interface clara, objetiva e profissional.
                </p>
              </div>
            </div>

            <div className="flex w-full justify-end sm:w-auto z-[100]">
              <AdminActionsMenu />
            </div>
          </div>
        </header>

        <section className="grid gap-3 md:grid-cols-3">
          <AdminMetric
            label="Total de espécies"
            value={String(plants.length)}
            text="Registros disponíveis no catálogo."
          />
          <AdminMetric
            label="Último cadastro"
            value={plants[0] ? plants[0].nome_popular : "Nenhum cadastro ainda"}
            text={plants[0] ? plants[0].nome_cientifico ?? "Sem nome científico" : "O primeiro item será exibido aqui."}
            valueSize="text-lg"
          />
          <AdminMetric
            label="Categorias em uso"
            value={
              topCategories.length > 0
                ? topCategories.map(([categoryId, count]) => `${categoryMap.get(categoryId) ?? categoryId} (${count})`).join(" / ")
                : "Sem dados"
            }
            text="Distribuição resumida dos registros cadastrados."
            valueSize="text-sm"
          />
        </section>

        <section className="grid gap-6">
          <div className="space-y-5 sm:space-y-6">
            <section className="border border-[#243528]/16 bg-[#f4f5eb]/82 p-4 shadow-[0_18px_60px_rgba(17,27,21,0.08)] backdrop-blur-md sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#24362a]/58">
                    Novo cadastro
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-[#111b15]">Criar nova planta</h2>
                  <p className="mt-1 text-sm text-[#1b2a20]/68">
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

            <section className="border border-[#243528]/16 bg-[#f4f5eb]/82 p-4 shadow-[0_18px_60px_rgba(17,27,21,0.08)] backdrop-blur-md sm:p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#111b15]">Plantas cadastradas</h2>
                  <p className="text-sm text-[#1b2a20]/68">
                    Visualização completa das espécies publicadas no catálogo.
                  </p>
                </div>
                <span className="admin-count-badge w-fit border border-[#243528]/14 bg-[#eef3e8]/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#263e2b]">
                  {plants.length} itens
                </span>
              </div>

              {hasLoadError ? (
                <p className="mt-4 border border-amber-300/50 bg-amber-100/80 px-4 py-3 text-sm text-amber-950">
                  Não foi possível carregar a lista. Verifique se as tabelas species e categoria já existem no Supabase.
                </p>
              ) : null}

              {plants.length === 0 ? (
                <div className="admin-empty-state mt-5 border border-dashed border-[#243528]/20 bg-[#eef3e8]/70 px-5 py-8 text-center">
                  <p className="text-sm font-medium text-[#26362b]">Nenhuma espécie cadastrada ainda.</p>
                  <p className="mt-2 text-sm text-[#1b2a20]/58">
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

function AdminMetric({
  label,
  text,
  value,
  valueSize = "text-4xl",
}: {
  label: string;
  text: string;
  value: string;
  valueSize?: string;
}) {
  return (
    <article className="border border-[#243528]/16 bg-[#f4f5eb]/82 p-4 shadow-[0_18px_60px_rgba(17,27,21,0.08)] backdrop-blur-md sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#24362a]/58">{label}</p>
      <p className={`mt-4 font-semibold leading-tight tracking-[-0.03em] text-[#111b15] ${valueSize}`}>{value}</p>
      <p className="mt-2 text-sm leading-6 text-[#1b2a20]/68">{text}</p>
    </article>
  );
}
