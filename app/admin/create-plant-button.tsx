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
        className="rounded-full bg-[#27412f] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#1b2e22]"
      >
        Criar nova planta
      </button>

      {isOpen ? (
        <AdminModal
          description="Preencha os dados principais para publicar uma nova especie no catalogo."
          onClose={() => setIsOpen(false)}
          title="Criar nova planta"
        >
          <PlantForm categories={categories} />
        </AdminModal>
      ) : null}
    </>
  );
}
