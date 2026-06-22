"use client";

import { useState } from "react";
import { AdminModal } from "./admin-modal";
import { PlantForm } from "./plant-form";

type CategoryOption = {
  id: number;
  nome: string;
};

type CreatePlantButtonProps = {
  categories: CategoryOption[];
};

export function CreatePlantButton({ categories }: CreatePlantButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="bg-[#12251a] px-5 py-2 text-sm font-semibold text-[#f3f1e8] transition hover:bg-[#223a2a]"
      >
        Criar nova planta
      </button>

      {isOpen ? (
        <AdminModal
          description="Preencha os dados principais para publicar uma nova espécie no catálogo."
          onClose={() => setIsOpen(false)}
          title="Criar nova planta"
        >
          <PlantForm categories={categories} />
        </AdminModal>
      ) : null}
    </>
  );
}
