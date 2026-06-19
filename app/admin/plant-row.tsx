"use client";

import { useState } from "react";
import { AdminModal } from "./admin-modal";
import { deleteSpeciesAction } from "./actions";
import { PlantForm } from "./plant-form";

type CategoryOption = {
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
  plant: SpeciesRow;
};

type OpenModal = "edit" | "delete" | null;

export function PlantRow({ categories, categoryName, plant }: PlantRowProps) {
  const [openModal, setOpenModal] = useState<OpenModal>(null);

  function toggleModal(modal: Exclude<OpenModal, null>) {
    setOpenModal((currentModal) => (currentModal === modal ? null : modal));
  }

  return (
    <>
      <tr className="align-top">
        <td className="px-4 py-4">
          <p className="font-semibold text-[#203226]">{plant.nome_popular}</p>
          <p className="text-sm text-[#4f5f54]">{plant.nome_cientifico ?? "Sem nome cientifico"}</p>
        </td>
        <td className="px-4 py-4">
          <span className="inline-flex rounded-full bg-[#ecf3e2] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#607149]">
            {categoryName}
          </span>
          {plant.foto_url ? <p className="mt-2 text-xs text-[#64726a]">Foto cadastrada</p> : null}
        </td>
        <td className="px-4 py-4">
          <div className="flex flex-wrap gap-2">
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
              Excluir
            </button>
          </div>
        </td>
      </tr>

      {openModal === "edit" ? (
        <AdminModal
          description="Confira os dados atuais e altere as informacoes da planta."
          onClose={() => setOpenModal(null)}
          title={`Editar ${plant.nome_popular}`}
        >
          <PlantSummary categoryName={categoryName} plant={plant} title="Informacoes da planta" />
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
          title={`Excluir ${plant.nome_popular}`}
        >
          <PlantSummary categoryName={categoryName} plant={plant} title="Planta selecionada" />
          <div className="admin-danger-box">
            <p className="font-semibold">Tem certeza que deseja excluir esta planta?</p>
            <p className="mt-1">
              Essa acao remove o registro do catalogo. Se quiser manter os dados, cancele esta janela.
            </p>
          </div>
          <form action={deleteSpeciesAction} className="admin-danger-actions">
            <input type="hidden" name="id" value={plant.id} />
            <button type="submit" className="admin-danger-button">
              Sim, excluir planta
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
