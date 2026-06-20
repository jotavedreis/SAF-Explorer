"use client";

import { useState } from "react";
import { AdminModal } from "./admin-modal";
import { deleteSpeciesAction } from "./actions";
import { PlantForm } from "./plant-form";

type CategoryOption = {
  id: number;
  nome: string;
};

type FunctionOption = {
  id: number;
  nome: string;
};

type SpeciesRow = {
  id: number;
  nome_popular: string;
  nome_cientifico: string | null;
  categoria_id: number;
  foto_url: string | null;
  explicacao: string | null;
};

type PlantRowProps = {
  categories: CategoryOption[];
  categoryName: string;
  functions: FunctionOption[];
  plant: SpeciesRow;
};

type OpenModal = "edit" | "delete" | null;

export function PlantRow({ categories, categoryName, functions, plant }: PlantRowProps) {
  const [openModal, setOpenModal] = useState<OpenModal>(null);

  function toggleModal(modal: Exclude<OpenModal, null>) {
    setOpenModal((currentModal) => (currentModal === modal ? null : modal));
  }

  return (
    <>
      <article className="group overflow-hidden rounded-[22px] border border-[#dfe6d9] bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(46,66,45,0.1)] sm:rounded-[28px]">
        <div className="h-40 bg-[linear-gradient(135deg,_#9bb36f,_#5f7d2a)] sm:h-44">
          {plant.foto_url ? (
            <img
              src={plant.foto_url}
              alt={`Foto de ${plant.nome_popular}`}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-semibold uppercase tracking-[0.18em] text-white/85">
              Sem foto
            </div>
          )}
        </div>

        <div className="space-y-4 p-4 sm:p-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6f7f6b]">
              {categoryName}
            </p>
            <h3 className="mt-2 text-xl font-semibold text-[#1f3127] sm:text-2xl">{plant.nome_popular}</h3>
            <p className="text-sm italic text-[#607066]">{plant.nome_cientifico ?? "Sem nome cientifico"}</p>
          </div>

          <FunctionBadges functions={functions} />

          <div className="flex flex-wrap gap-2 border-t border-[#edf1e7] pt-4">
            <button
              type="button"
              onClick={() => toggleModal("edit")}
              className="rounded-full bg-[#e8f1dc] px-3 py-1 text-xs font-semibold text-[#4d651f] transition hover:bg-[#dce8c8]"
            >
              Editar
            </button>
            <button
              type="button"
              onClick={() => toggleModal("delete")}
              className="rounded-full bg-[#f0d9d9] px-3 py-1 text-xs font-semibold text-[#7a2a2a] transition hover:bg-[#e9c2c2]"
            >
              Remover
            </button>
          </div>
        </div>
      </article>

      {openModal === "edit" ? (
        <AdminModal
          description="Confira os dados atuais e altere as informações da planta."
          onClose={() => setOpenModal(null)}
          title={`Editar ${plant.nome_popular}`}
        >
          <PlantSummary categoryName={categoryName} plant={plant} title="Informações da planta" />
          <div className="mt-5">
            <PlantForm categories={categories} species={plant} />
          </div>
        </AdminModal>
      ) : null}

      {openModal === "delete" ? (
        <AdminModal
          description="Confira os dados antes de confirmar a exclusao."
          isDanger
          onClose={() => setOpenModal(null)}
          title={`Remover ${plant.nome_popular}`}
        >
          <PlantSummary categoryName={categoryName} plant={plant} title="Planta selecionada" />
          <div className="admin-danger-box">
            <p className="font-semibold">Tem certeza que deseja remover esta planta?</p>
            <p className="mt-1">
              Essa ação remove o registro do catálogo. Se quiser manter os dados, cancele esta janela.
            </p>
          </div>
          <form action={deleteSpeciesAction} className="admin-danger-actions">
            <input type="hidden" name="id" value={plant.id} />
            <button type="submit" className="admin-danger-button">
              Sim, remover planta
            </button>
            <button type="button" onClick={() => setOpenModal(null)} className="admin-secondary-button">
              Cancelar
            </button>
          </form>
        </AdminModal>
      ) : null}
    </>
  );
}

function FunctionBadges({ functions }: { functions: FunctionOption[] }) {
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

function PlantSummary({
  categoryName,
  plant,
  title,
}: {
  categoryName: string;
  plant: SpeciesRow;
  title: string;
}) {
  return (
    <div className="admin-summary">
      {plant.foto_url ? (
        <div className="admin-summary-media">
          <img src={plant.foto_url} alt={`Foto de ${plant.nome_popular}`} />
        </div>
      ) : (
        <div className="admin-summary-media">Sem foto</div>
      )}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#738072]">{title}</p>
        <h3 className="mt-2 text-2xl font-semibold text-[#1f3127]">{plant.nome_popular}</h3>
        <p className="mt-1 text-sm text-[#516157]">{plant.nome_cientifico ?? "Sem nome cientifico"}</p>
        <p className="admin-summary-category">{categoryName}</p>
        <p className="mt-4 text-sm leading-6 text-[#536158]">
          {plant.explicacao ?? "Sem explicacao cadastrada."}
        </p>
      </div>
    </div>
  );
}
