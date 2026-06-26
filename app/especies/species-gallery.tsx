"use client";

import { useMemo, useState } from "react";

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
          <label className="theme-label space-y-2">
            <span>Buscar por nome</span>
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Ex.: Acai, Gliricidia, Ipe..."
              className="theme-field"
            />
          </label>

          <label className="theme-label space-y-2">
            <span>Filtrar por funcao</span>
            <select
              value={selectedFunctionId}
              onChange={(event) => setSelectedFunctionId(event.target.value)}
              className="theme-field"
            >
              <option value="all">Todas as funcoes</option>
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
          <div className="theme-empty-state col-span-full p-8 text-center">
            <p className="theme-empty-title">Nenhuma especie encontrada.</p>
            <p className="theme-empty-text mt-2">Tente buscar outro nome ou limpar o filtro de funcao.</p>
          </div>
        ) : (
          filteredSpecies.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedSpecies(item)}
              className="species-card group"
            >
              <div className="species-card-media">
                {item.foto_url ? (
                  <img
                    src={item.foto_url}
                    alt={`Foto de ${item.nome_popular}`}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                  />
                ) : null}
              </div>
              <div className="species-card-body">
                <div>
                  <p className="theme-kicker">{categoryMap.get(item.categoria_id) ?? "Categoria"}</p>
                  <h2 className="species-card-title">{item.nome_popular}</h2>
                  <p className="theme-meta italic">{item.nome_cientifico ?? "Sem nome cientifico"}</p>
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
    return <p className="theme-meta text-sm">Sem funcoes cadastradas.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {functions.slice(0, 4).map((funcao) => (
        <span key={funcao.id} className="theme-badge">
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
    <div className="species-modal-backdrop" onClick={onClose}>
      <div className="species-modal" onClick={(event) => event.stopPropagation()}>
        <div className="species-modal-header">
          <div>
            <p className="theme-kicker">Detalhes da planta</p>
            <h2 className="species-modal-title">{selectedSpecies.nome_popular}</h2>
            <p className="theme-meta italic">{selectedSpecies.nome_cientifico ?? "Sem nome cientifico"}</p>
          </div>
          <button type="button" onClick={onClose} className="theme-secondary-button species-modal-close">
            Fechar
          </button>
        </div>

        <div className="species-modal-content">
          <div className="species-modal-media">
            {selectedSpecies.foto_url ? (
              <img
                src={selectedSpecies.foto_url}
                alt={`Foto completa de ${selectedSpecies.nome_popular}`}
                className="species-modal-image"
              />
            ) : (
              <div className="species-modal-box species-modal-empty-image">Nenhuma foto cadastrada.</div>
            )}
          </div>

          <div className="species-modal-info">
            <InfoBox label="Categoria" value={categoryName} />
            <div className="species-modal-box">
              <p className="theme-kicker func">Funções da planta </p>
              <div className="mt-2">
                <FunctionBadges functions={functions} />
              </div>
            </div>
            <div className="species-modal-box">
              <p className="theme-kicker">Altura​</p>
              <p className="species-modal-scroll-text">
                {selectedSpecies.altura ?? "Sem altura cadastrada."}
              </p>
            </div>
            <div className="species-modal-box">
              <p className="theme-kicker">Espaçamento​</p>
              <p className="species-modal-scroll-text">
                {selectedSpecies.espacamento_planta ?? "Sem espaçamento cadastrado."}
              </p>
            </div>
            <div className="species-modal-box">
              <p className="theme-kicker">Tempo de produção​</p>
              <p className="species-modal-scroll-text">
                {selectedSpecies.tempo_producao ?? "Sem tempo de produção cadastrado."}
              </p>
            </div>
            <div className="species-modal-box">
              <p className="theme-kicker">Estabelecimento</p>
              <p className="species-modal-scroll-text">
                {selectedSpecies.estabelecimento_planta ?? "Sem estabelecimento de produção cadastrado."}
              </p>
            </div>
            <div className="species-modal-box">
              <p className="theme-kicker">Solo​</p>
              <p className="species-modal-scroll-text">
                {selectedSpecies.solo_planta ?? "Sem solo cadastrado."}
              </p>
            </div>
            <div className="species-modal-box">
              <p className="theme-kicker">pH</p>
              <p className="species-modal-scroll-text">
                {selectedSpecies.ph_planta ?? "Sem pH cadastrado."}
              </p>
            </div>
            <div className="species-modal-box">
              <p className="theme-kicker">O que esta planta faz?​</p>
              <p className="species-modal-scroll-text">
                {selectedSpecies.explicacao ?? "Sem descricao cadastrada."}
              </p>
            </div>
            <div className="species-modal-box">
              <p className="theme-kicker">Ciclagem no Sistema​</p>
              <p className="species-modal-scroll-text">
                {selectedSpecies.ciclagem_sistema ?? "Sem ciclagem cadastrada."}
              </p>
            </div>
            <div className="species-modal-box">
              <p className="theme-kicker">O que esta planta fornece?</p>
              <p className="species-modal-scroll-text">
                {selectedSpecies.fornece_planta ?? "Sem informacao cadastrada."}
              </p>
            </div>
            <div className="species-modal-box">
              <p className="theme-kicker">Demanda​</p>
              <p className="species-modal-scroll-text">
                {selectedSpecies.demanda_planta ?? "Sem demanda cadastrada."}
              </p>
            </div>
            <div className="species-modal-box">
              <p className="theme-kicker">Relacoes com outras especies</p>
              {selectedRelations.length === 0 ? (
                <p className="theme-meta mt-2 text-sm">Sem relacoes cadastradas.</p>
              ) : (
                <div className="mt-3 space-y-2">
                  {selectedRelations.map((relation) => (
                    <button
                      key={`${relation.label}-${relation.species.id}`}
                      type="button"
                      onClick={() => onSelectSpecies(relation.species)}
                      className="species-relation-button"
                    >
                      <span className="font-medium">{relation.label}</span>{" "}
                      <span>{relation.species.nome_popular}</span>
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
    <div className="species-modal-box">
      <p className="theme-kicker">{label}</p>
      <p className="theme-strong-text mt-1">{value}</p>
    </div>
  );
}
