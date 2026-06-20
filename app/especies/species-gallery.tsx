"use client";

import { useMemo, useState } from "react";

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

type SpeciesGalleryProps = {
  categories: CategoryRow[];
  functions: FunctionRow[];
  relationTypes: RelationTypeRow[];
  relations: SpeciesRelationRow[];
  species: SpeciesRow[];
  speciesFunctions: SpeciesFunctionRow[];
};

export function SpeciesGallery({
  categories,
  functions,
  relationTypes,
  relations,
  species,
  speciesFunctions,
}: SpeciesGalleryProps) {
  const [selectedFunctionId, setSelectedFunctionId] = useState("all");
  const [selectedSpecies, setSelectedSpecies] = useState<SpeciesRow | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const categoryMap = useMemo(() => new Map(categories.map((category) => [category.id, category.nome])), [categories]);
  const functionMap = useMemo(() => new Map(functions.map((funcao) => [funcao.id, funcao.nome])), [functions]);
  const relationTypeMap = useMemo(
    () => new Map(relationTypes.map((relationType) => [relationType.id, relationType])),
    [relationTypes]
  );
  const speciesMap = useMemo(() => new Map(species.map((item) => [item.id, item])), [species]);

  const speciesFunctionMap = useMemo(() => {
    const map = new Map<number, FunctionRow[]>();

    for (const item of speciesFunctions) {
      const funcao = functionMap.get(item.funcao_id);
      if (!funcao) {
        continue;
      }

      map.set(item.species_id, [...(map.get(item.species_id) ?? []), { id: item.funcao_id, nome: funcao }]);
    }

    return map;
  }, [functionMap, speciesFunctions]);

  const filteredSpecies = species.filter((item) => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !normalizedSearch ||
      item.nome_popular.toLowerCase().includes(normalizedSearch) ||
      (item.nome_cientifico ?? "").toLowerCase().includes(normalizedSearch);
    const matchesFunction =
      selectedFunctionId === "all" ||
      speciesFunctionMap.get(item.id)?.some((funcao) => String(funcao.id) === selectedFunctionId);

    return matchesSearch && matchesFunction;
  });

  return (
    <>
      <section className="global-card mt-5 p-4 sm:mt-6 sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
          <label className="space-y-2 text-sm font-medium text-[#405046]">
            <span>Buscar por nome</span>
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Ex.: Açaí, Gliricídia, Ipê..."
              className="w-full rounded-2xl border border-[#d4dcc8] bg-[#f9fbf6] px-4 py-3 outline-none transition focus:border-[#97b178] focus:ring-2 focus:ring-[#c6d7ae]"
            />
          </label>

          <label className="space-y-2 text-sm font-medium text-[#405046]">
            <span>Filtrar por função</span>
            <select
              value={selectedFunctionId}
              onChange={(event) => setSelectedFunctionId(event.target.value)}
              className="w-full rounded-2xl border border-[#d4dcc8] bg-[#f9fbf6] px-4 py-3 outline-none transition focus:border-[#97b178] focus:ring-2 focus:ring-[#c6d7ae]"
            >
              <option value="all">Todas as funções</option>
              {functions.map((funcao) => (
                <option key={funcao.id} value={funcao.id}>
                  {funcao.nome}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="mt-5 grid gap-4 sm:mt-6 sm:grid-cols-2 xl:grid-cols-3">
        {filteredSpecies.length === 0 ? (
          <div className="col-span-full rounded-[28px] border border-dashed border-[#d5ddcd] bg-white/80 p-8 text-center">
            <p className="text-sm font-medium text-[#526255]">Nenhuma espécie encontrada.</p>
            <p className="mt-2 text-sm text-[#738076]">Tente buscar outro nome ou limpar o filtro de função.</p>
          </div>
        ) : (
          filteredSpecies.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedSpecies(item)}
              className="group overflow-hidden rounded-[22px] border border-[#dfe6d9] bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(46,66,45,0.1)] sm:rounded-[28px]"
            >
              <div className="h-40 bg-[linear-gradient(135deg,_#9bb36f,_#5f7d2a)] sm:h-44">
                {item.foto_url ? (
                  <img
                    src={item.foto_url}
                    alt={`Foto de ${item.nome_popular}`}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                  />
                ) : null}
              </div>
              <div className="space-y-3 p-4 sm:p-5">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6f7f6b]">
                    {categoryMap.get(item.categoria_id) ?? "Categoria"}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-[#1f3127] sm:text-2xl">{item.nome_popular}</h2>
                  <p className="text-sm italic text-[#607066]">{item.nome_cientifico ?? "Sem nome científico"}</p>
                </div>
                <FunctionBadges functions={speciesFunctionMap.get(item.id) ?? []} />
              </div>
            </button>
          ))
        )}
      </section>

      {selectedSpecies ? (
        <SpeciesDetailModal
          categoryName={categoryMap.get(selectedSpecies.categoria_id) ?? "Categoria"}
          functions={speciesFunctionMap.get(selectedSpecies.id) ?? []}
          onClose={() => setSelectedSpecies(null)}
          onSelectSpecies={setSelectedSpecies}
          relationTypeMap={relationTypeMap}
          relations={relations}
          selectedSpecies={selectedSpecies}
          speciesMap={speciesMap}
        />
      ) : null}
    </>
  );
}

function FunctionBadges({ functions }: { functions: FunctionRow[] }) {
  if (functions.length === 0) {
    return <p className="text-sm text-[#738076]">Sem funções cadastradas.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {functions.slice(0, 4).map((funcao) => (
        <span key={funcao.id} className="rounded-full bg-[#edf4e2] px-3 py-1 text-xs font-semibold text-[#607149]">
          {funcao.nome}
        </span>
      ))}
    </div>
  );
}

function SpeciesDetailModal({
  categoryName,
  functions,
  onClose,
  onSelectSpecies,
  relationTypeMap,
  relations,
  selectedSpecies,
  speciesMap,
}: {
  categoryName: string;
  functions: FunctionRow[];
  onClose: () => void;
  onSelectSpecies: (species: SpeciesRow) => void;
  relationTypeMap: Map<number, RelationTypeRow>;
  relations: SpeciesRelationRow[];
  selectedSpecies: SpeciesRow;
  speciesMap: Map<number, SpeciesRow>;
}) {
  const selectedRelations = relations
    .map((relation) => {
      const relationType = relationTypeMap.get(relation.tipo_relacao_id);
      if (!relationType) {
        return null;
      }

      if (relation.from_species_id === selectedSpecies.id) {
        const targetSpecies = speciesMap.get(relation.to_species_id);
        return targetSpecies ? { label: relationType.nome, species: targetSpecies } : null;
      }

      if (relation.to_species_id === selectedSpecies.id) {
        const targetSpecies = speciesMap.get(relation.from_species_id);
        return targetSpecies ? { label: relationType.nome_reverso, species: targetSpecies } : null;
      }

      return null;
    })
    .filter((relation): relation is { label: string; species: SpeciesRow } => Boolean(relation));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0c150f]/65 px-2 py-2 backdrop-blur-sm sm:px-4 sm:py-6"
      onClick={onClose}
    >
      <div
        className="max-h-[calc(100dvh-1rem)] w-full max-w-5xl overflow-y-auto rounded-[22px] border border-[#d9e4ce] bg-white shadow-[0_30px_90px_rgba(12,21,15,0.35)] sm:max-h-[90vh] sm:rounded-[32px]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-col gap-4 border-b border-[#e6ece0] p-4 sm:flex-row sm:items-start sm:justify-between sm:p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#738072] sm:tracking-[0.28em]">Detalhes da planta</p>
            <h2 className="mt-2 text-2xl font-semibold text-[#1f3127] sm:text-3xl">{selectedSpecies.nome_popular}</h2>
            <p className="mt-1 text-sm italic text-[#607066]">{selectedSpecies.nome_cientifico ?? "Sem nome científico"}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-full border border-[#d7dfcf] bg-[#f7faf3] px-4 py-2 text-sm font-medium text-[#294032] transition hover:bg-[#edf4e5] sm:w-auto"
          >
            Fechar
          </button>
        </div>

        <div className="grid gap-0 lg:grid-cols-[1fr_0.95fr]">
          <div className="bg-[#f8faf5] p-3 sm:p-6">
            {selectedSpecies.foto_url ? (
              <img
                src={selectedSpecies.foto_url}
                alt={`Foto completa de ${selectedSpecies.nome_popular}`}
                className="max-h-[22rem] w-full rounded-[20px] object-cover sm:max-h-[34rem] sm:rounded-[26px]"
              />
            ) : (
              <div className="flex min-h-[14rem] items-center justify-center rounded-[20px] border border-dashed border-[#d8e0d1] bg-white text-sm text-[#728076] sm:min-h-[20rem] sm:rounded-[26px]">
                Nenhuma foto cadastrada.
              </div>
            )}
          </div>

          <div className="space-y-4 p-4 sm:p-6">
            <InfoBox label="Categoria" value={categoryName} />
            <div className="rounded-2xl bg-[#f8faf5] px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#758178]">Funções da planta</p>
              <div className="mt-2">
                <FunctionBadges functions={functions} />
              </div>
            </div>
            <div className="rounded-2xl bg-[#f8faf5] px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#758178]">O que esta planta faz?</p>
              <p className="mt-1 max-h-64 overflow-y-auto leading-7 text-[#22342a]">
                {selectedSpecies.explicacao ?? "Sem descrição cadastrada."}
              </p>
            </div>
            <div className="rounded-2xl bg-[#f8faf5] px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#758178]">Relações com outras espécies</p>
              {selectedRelations.length === 0 ? (
                <p className="mt-2 text-sm text-[#657268]">Sem relações cadastradas.</p>
              ) : (
                <div className="mt-3 space-y-2">
                  {selectedRelations.map((relation) => (
                    <button
                      key={`${relation.label}-${relation.species.id}`}
                      type="button"
                      onClick={() => onSelectSpecies(relation.species)}
                      className="block w-full rounded-xl border border-[#dde5d5] bg-white px-3 py-2 text-left text-sm text-[#22342a] transition hover:bg-[#eef5e8]"
                    >
                      <span className="font-medium">{relation.label}</span>{" "}
                      <span className="text-[#607066]">{relation.species.nome_popular}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#f8faf5] px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#758178]">{label}</p>
      <p className="mt-1 font-medium text-[#22342a]">{value}</p>
    </div>
  );
}
