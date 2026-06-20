"use client";

import { useActionState, useMemo, useState } from "react";
import {
  createSpeciesAction,
  type CreateSpeciesActionState,
  updateSpeciesAction,
} from "./actions";

type CategoryOption = {
  id: number;
  nome: string;
};

const initialCreateSpeciesState: CreateSpeciesActionState = {
  status: "idle",
  message: "",
};

type PlantFormProps = {
  categories: CategoryOption[];
  species?: {
    id: number;
    nome_popular: string;
    nome_cientifico: string | null;
    categoria_id: number;
    foto_url: string | null;
    explicacao: string | null;
  };
};

export function PlantForm({ categories, species }: PlantFormProps) {
  const initialValues = useMemo(
    () => ({
      categoriaId: species?.categoria_id ? String(species.categoria_id) : "",
      explicacao: species?.explicacao ?? "",
      fotoUrl: species?.foto_url ?? "",
      nomeCientifico: species?.nome_cientifico ?? "",
      nomePopular: species?.nome_popular ?? "",
    }),
    [species]
  );
  const [state, formAction, isPending] = useActionState(
    species ? updateSpeciesAction : createSpeciesAction,
    {
      ...initialCreateSpeciesState,
      fields: initialValues,
    }
  );
  const [formValues, setFormValues] = useState(initialValues);
  const isEditing = Boolean(species);

  function updateField(field: keyof typeof formValues, value: string) {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
  }

  return (
    <form action={formAction} className="space-y-4 rounded-[22px] border border-[#dae2d0] bg-white p-4 shadow-sm sm:rounded-3xl sm:p-5">
      <div>
        <h2 className="text-xl font-semibold text-[#1f3127]">
          {isEditing ? "Editar espécie" : "Cadastrar espécie"}
        </h2>
        <p className="mt-1 text-sm text-[#657268]">
          {isEditing
            ? "Atualize os dados da espécie selecionada e salve as alterações."
            : "Preencha os dados principais da espécie para publicar no catálogo."}
        </p>
      </div>

      {species ? <input type="hidden" name="speciesId" value={species.id} /> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1 text-sm text-[#405046]">
          <span>Nome popular</span>
          <input
            name="nomePopular"
            required
            className="w-full rounded-xl border border-[#d4dcc8] bg-[#f9fbf6] px-3 py-2 outline-none transition focus:border-[#97b178] focus:ring-2 focus:ring-[#c6d7ae]"
            placeholder="Ex.: Ipê-amarelo"
            value={formValues.nomePopular}
            onChange={(event) => updateField("nomePopular", event.target.value)}
          />
        </label>

        <label className="space-y-1 text-sm text-[#405046]">
          <span>Nome cientifico</span>
          <input
            name="nomeCientifico"
            required
            className="w-full rounded-xl border border-[#d4dcc8] bg-[#f9fbf6] px-3 py-2 outline-none transition focus:border-[#97b178] focus:ring-2 focus:ring-[#c6d7ae]"
            placeholder="Ex.: Handroanthus albus"
            value={formValues.nomeCientifico}
            onChange={(event) => updateField("nomeCientifico", event.target.value)}
          />
        </label>

        <label className="space-y-1 text-sm text-[#405046] md:col-span-2">
          <span>Categoria</span>
          <select
            name="categoriaId"
            required
            value={formValues.categoriaId}
            onChange={(event) => updateField("categoriaId", event.target.value)}
            className="w-full rounded-xl border border-[#d4dcc8] bg-[#f9fbf6] px-3 py-2 outline-none transition focus:border-[#97b178] focus:ring-2 focus:ring-[#c6d7ae]"
          >
            <option value="" disabled>
              Selecione uma categoria
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.nome}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-sm text-[#405046] md:col-span-2">
          <span>Foto da planta</span>
          {species?.foto_url ? (
            <div className="rounded-2xl border border-[#dde5d5] bg-[#f6faf2] p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#738072]">Foto atual</p>
              <img
                src={species.foto_url}
                alt={`Foto atual de ${species.nome_popular}`}
                className="mt-2 h-40 w-full rounded-xl object-cover"
              />
            </div>
          ) : null}
          <input
            name="fotoArquivo"
            type="file"
            accept="image/*"
            className="w-full rounded-xl border border-[#d4dcc8] bg-[#f9fbf6] px-3 py-2 outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-[#27412f] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#1b2e22] focus:border-[#97b178] focus:ring-2 focus:ring-[#c6d7ae]"
          />
          <span className="block text-xs text-[#6b776f]">
            Envie uma imagem para o sistema. Se não mandar arquivo, o link abaixo continua funcionando.
          </span>
          <input
            name="fotoUrl"
            type="url"
            className="w-full rounded-xl border border-[#d4dcc8] bg-[#f9fbf6] px-3 py-2 outline-none transition focus:border-[#97b178] focus:ring-2 focus:ring-[#c6d7ae]"
            placeholder="https://..."
            value={formValues.fotoUrl}
            onChange={(event) => updateField("fotoUrl", event.target.value)}
          />
        </label>

        <label className="space-y-1 text-sm text-[#405046] md:col-span-2">
          <span>Explicacao</span>
          <textarea
            name="explicacao"
            required
            rows={4}
            className="w-full resize-y rounded-xl border border-[#d4dcc8] bg-[#f9fbf6] px-3 py-2 outline-none transition focus:border-[#97b178] focus:ring-2 focus:ring-[#c6d7ae]"
            placeholder="Caracteristicas, uso no paisagismo, exigencias e observacoes agronomicas."
            value={formValues.explicacao}
            onChange={(event) => updateField("explicacao", event.target.value)}
          />
        </label>
      </div>

      {state.message ? (
        <p
          className={`rounded-xl px-3 py-2 text-sm ${
            state.status === "success"
              ? "bg-emerald-100 text-emerald-900"
              : "bg-amber-100 text-amber-900"
          }`}
        >
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-[#27412f] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#1b2e22] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isPending ? "Salvando..." : isEditing ? "Salvar alterações" : "Salvar espécie"}
      </button>
    </form>
  );
}
