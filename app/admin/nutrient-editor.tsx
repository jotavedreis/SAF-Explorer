"use client";

import { useState, useTransition } from "react";
import { updateNutrientAction, deleteNutrientAction } from "./actions";

type NutrientItem = {
  id: number;
  nome: string;
  simbolo: string;
  funcao_na_planta?: string;
  sintomas_deficiencia?: string;
  fontes_naturais?: string;
};

export function NutrientList({ nutrients }: { nutrients: NutrientItem[] }) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [pending, startTransition] = useTransition();

  function handleEdit(id: number) {
    setEditingId(editingId === id ? null : id);
  }

  return (
    <div className="admin-manageable-list mt-4 border border-[#243528]/12 bg-[#f4f5eb]/72 p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#758178]">Nutrientes cadastrados</p>
        <span className="admin-list-count bg-[#eef3e8] px-2 py-1 text-xs font-semibold text-[#263e2b]">
          {nutrients.length}
        </span>
      </div>

      {nutrients.length === 0 ? (
        <p className="mt-3 text-sm text-[#738076]">Nenhum nutriente cadastrado.</p>
      ) : (
        <div className="mt-3 grid gap-2">
          {nutrients.map((item) => (
            <div key={item.id}>
              {editingId === item.id ? (
                <NutrientEditForm
                  nutrient={item}
                  onCancel={() => setEditingId(null)}
                  onSubmit={() => {
                    startTransition(() => {
                      setEditingId(null);
                    });
                  }}
                  pending={pending}
                />
              ) : (
                <div className="admin-list-item flex flex-col gap-2 border border-[#243528]/10 bg-[#eef3e8]/70 px-3 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                  <span className="break-words text-sm font-medium text-[#27382e]">
                    {item.nome} ({item.simbolo})
                  </span>
                  <div className="flex gap-2 sm:w-auto">
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="flex-1 bg-[#d4e8d4] px-3 py-1 text-xs font-semibold text-[#2a5a2a] transition hover:bg-[#c2dfc2] sm:flex-none"
                    >
                      Editar
                    </button>
                    <form action={deleteNutrientAction} className="flex-1 sm:flex-none">
                      <input type="hidden" name="id" value={item.id} />
                      <button
                        type="submit"
                        className="w-full bg-[#f0d9d9] px-3 py-1 text-xs font-semibold text-[#7a2a2a] transition hover:bg-[#e9c2c2]"
                      >
                        Remover
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function NutrientEditForm({
  nutrient,
  onCancel,
  onSubmit,
  pending,
}: {
  nutrient: NutrientItem;
  onCancel: () => void;
  onSubmit: () => void;
  pending: boolean;
}) {
  const [nome, setNome] = useState(nutrient.nome);
  const [simbolo, setSimbolo] = useState(nutrient.simbolo);
  const [funcaoNaPlanta, setFuncaoNaPlanta] = useState(nutrient.funcao_na_planta || "");
  const [sintomasDeficiencia, setSintomasDeficiencia] = useState(nutrient.sintomas_deficiencia || "");
  const [fontesNaturais, setFontesNaturais] = useState(nutrient.fontes_naturais || "");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    onSubmit();
    updateNutrientAction(fd);
  }

  return (
    <form onSubmit={handleSubmit} className="border border-[#243528]/10 bg-[#fafaf8]/80 px-3 py-3">
      <div className="grid gap-3 sm:grid-cols-[120px_1fr]">
        <div>
          <label className="space-y-1 text-sm text-[#405046]">
            <span>Símbolo</span>
            <input
              name="simbolo"
              value={simbolo}
              onChange={(e) => setSimbolo(e.target.value)}
              className="w-full border border-[#243528]/18 bg-[#f7f8ef]/80 px-3 py-2 outline-none transition focus:border-[#263e2b] focus:ring-2 focus:ring-[#9bad8f]/40"
              required
            />
          </label>
        </div>
        <div>
          <label className="space-y-1 text-sm text-[#405046]">
            <span>Nome</span>
            <input
              name="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full border border-[#243528]/18 bg-[#f7f8ef]/80 px-3 py-2 outline-none transition focus:border-[#263e2b] focus:ring-2 focus:ring-[#9bad8f]/40"
              required
            />
          </label>
        </div>
      </div>

      <div className="mt-3 grid gap-3">
        <label className="space-y-1 text-sm text-[#405046]">
          <span>Função na planta</span>
          <textarea
            name="funcaoNaPlanta"
            value={funcaoNaPlanta}
            onChange={(e) => setFuncaoNaPlanta(e.target.value)}
            rows={2}
            className="w-full resize-y border border-[#243528]/18 bg-[#f7f8ef]/80 px-3 py-2 outline-none transition focus:border-[#263e2b] focus:ring-2 focus:ring-[#9bad8f]/40"
          />
        </label>

        <label className="space-y-1 text-sm text-[#405046]">
          <span>Sintomas de deficiência</span>
          <textarea
            name="sintomasDeficiencia"
            value={sintomasDeficiencia}
            onChange={(e) => setSintomasDeficiencia(e.target.value)}
            rows={2}
            className="w-full resize-y border border-[#243528]/18 bg-[#f7f8ef]/80 px-3 py-2 outline-none transition focus:border-[#263e2b] focus:ring-2 focus:ring-[#9bad8f]/40"
          />
        </label>

        <label className="space-y-1 text-sm text-[#405046]">
          <span>Fontes naturais</span>
          <textarea
            name="fontesNaturais"
            value={fontesNaturais}
            onChange={(e) => setFontesNaturais(e.target.value)}
            rows={2}
            className="w-full resize-y border border-[#243528]/18 bg-[#f7f8ef]/80 px-3 py-2 outline-none transition focus:border-[#263e2b] focus:ring-2 focus:ring-[#9bad8f]/40"
          />
        </label>
      </div>

      <input type="hidden" name="id" value={nutrient.id} />

      <div className="mt-3 flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="flex-1 bg-[#12251a] px-4 py-2 text-sm font-semibold text-[#f3f1e8] transition hover:bg-[#223a2a] disabled:opacity-60 sm:flex-none"
        >
          Salvar
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={pending}
          className="flex-1 bg-[#e8e8e0] px-4 py-2 text-sm font-semibold text-[#405046] transition hover:bg-[#d8d8d0] disabled:opacity-60 sm:flex-none"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
