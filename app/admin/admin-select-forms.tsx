"use client";

import { useRef, useState, useTransition } from "react";
import {
  createPhAvailabilityAction,
  createSpeciesFunctionAction,
  createSpeciesRelationAction,
  createVisualSymptomAction,
  deleteVisualSymptomAction,
} from "./actions";

// ---------------------------------------------------------------------------
// Shared primitives (client-side copies, same styling as the server versions)
// ---------------------------------------------------------------------------

function AdminInput({
  label,
  name,
  placeholder,
  required = false,
  step,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  step?: string;
  type?: string;
  value?: string;
  onChange?: (v: string) => void;
}) {
  const controlled = value !== undefined && onChange !== undefined;
  return (
    <label className="space-y-1 text-sm text-[#405046]">
      <span>{label}</span>
      <input
        name={name}
        placeholder={placeholder}
        required={required}
        step={step}
        type={type}
        {...(controlled
          ? { value, onChange: (e) => onChange(e.target.value) }
          : {})}
        className="w-full border border-[#243528]/18 bg-[#f7f8ef]/80 px-3 py-2 outline-none transition focus:border-[#263e2b] focus:ring-2 focus:ring-[#9bad8f]/40"
      />
    </label>
  );
}

function AdminTextarea({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value?: string;
  onChange?: (v: string) => void;
}) {
  const controlled = value !== undefined && onChange !== undefined;
  return (
    <label className="space-y-1 text-sm text-[#405046]">
      <span>{label}</span>
      <textarea
        name={name}
        rows={3}
        {...(controlled
          ? { value, onChange: (e) => onChange(e.target.value) }
          : {})}
        className="w-full resize-y border border-[#243528]/18 bg-[#f7f8ef]/80 px-3 py-2 outline-none transition focus:border-[#263e2b] focus:ring-2 focus:ring-[#9bad8f]/40"
      />
    </label>
  );
}

function PersistentSelect({
  label,
  name,
  options,
  value,
  onChange,
}: {
  label: string;
  name: string;
  options: Array<{ id: number; nome?: string; nome_popular?: string }>;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="space-y-1 text-sm text-[#405046]">
      <span>{label}</span>
      <select
        name={name}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-[#243528]/18 bg-[#f7f8ef]/80 px-3 py-2 outline-none transition focus:border-[#263e2b] focus:ring-2 focus:ring-[#9bad8f]/40"
      >
        <option value="" disabled>
          Selecione
        </option>
        {options.map((option) => {
          const label = option.nome ?? option.nome_popular ?? String(option.id);
          return (
            <option key={option.id} value={String(option.id)}>
              {label}
            </option>
          );
        })}
      </select>
    </label>
  );
}

function SubmitButton({ label, pending }: { label: string; pending?: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-[#12251a] px-4 py-2 text-sm font-semibold text-[#f3f1e8] transition hover:bg-[#223a2a] disabled:opacity-60 sm:w-fit"
    >
      {label}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Bloco 03 — Funções das espécies
// ---------------------------------------------------------------------------

type SelectOption = { id: number; nome?: string; nome_popular?: string };

export function SpeciesFunctionForm({
  species,
  functions,
}: {
  species: SelectOption[];
  functions: SelectOption[];
}) {
  const [speciesId, setSpeciesId] = useState("");
  const [funcaoId, setFuncaoId] = useState("");
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      await createSpeciesFunctionAction(fd);
      // selections are preserved — state stays as-is
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
      <PersistentSelect
        label="Espécie"
        name="speciesId"
        options={species}
        value={speciesId}
        onChange={setSpeciesId}
      />
      <PersistentSelect
        label="Função"
        name="funcaoId"
        options={functions}
        value={funcaoId}
        onChange={setFuncaoId}
      />
      <SubmitButton label="Vincular função" pending={pending} />
    </form>
  );
}

// ---------------------------------------------------------------------------
// Bloco 04 — Relações entre espécies
// ---------------------------------------------------------------------------

export function SpeciesRelationForm({
  species,
  relationTypes,
}: {
  species: SelectOption[];
  relationTypes: SelectOption[];
}) {
  const [fromSpeciesId, setFromSpeciesId] = useState("");
  const [tipoRelacaoId, setTipoRelacaoId] = useState("");
  const [toSpeciesId, setToSpeciesId] = useState("");
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      await createSpeciesRelationAction(fd);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
      <PersistentSelect
        label="Espécie origem"
        name="fromSpeciesId"
        options={species}
        value={fromSpeciesId}
        onChange={setFromSpeciesId}
      />
      <PersistentSelect
        label="Tipo de relação"
        name="tipoRelacaoId"
        options={relationTypes}
        value={tipoRelacaoId}
        onChange={setTipoRelacaoId}
      />
      <PersistentSelect
        label="Espécie destino"
        name="toSpeciesId"
        options={species}
        value={toSpeciesId}
        onChange={setToSpeciesId}
      />
      <SubmitButton label="Criar relação" pending={pending} />
    </form>
  );
}

// ---------------------------------------------------------------------------
// Bloco 07 — Disponibilidade por pH
// ---------------------------------------------------------------------------

type PhPointOption = { id: number; ph_valor: number };

export function PhAvailabilityForm({
  phPoints,
  nutrients,
}: {
  phPoints: PhPointOption[];
  nutrients: SelectOption[];
}) {
  const phOptions = phPoints.map((item) => ({
    id: item.id,
    nome: `pH ${Number(item.ph_valor).toFixed(2).replace(".", ",")}`,
  }));

  const [pending, startTransition] = useTransition();

  // Formulário 1: Ponto único
  const [phPontoId, setPhPontoId] = useState("");
  const [nutrienteId, setNutrienteId] = useState("");
  const [disponibilidade, setDisponibilidade] = useState("");
  const [descricao, setDescricao] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      await createPhAvailabilityAction(fd);
      setDisponibilidade("");
      setDescricao("");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
        <PersistentSelect
          label="Ponto de pH"
          name="phPontoId"
          options={phOptions}
          value={phPontoId}
          onChange={setPhPontoId}
        />
        <PersistentSelect
          label="Nutriente"
          name="nutrienteId"
          options={nutrients}
          value={nutrienteId}
          onChange={setNutrienteId}
        />
        <AdminInput
          label="Disponibilidade (%)"
          name="disponibilidadePct"
          placeholder="85"
          required
          type="number"
          value={disponibilidade}
          onChange={setDisponibilidade}
        />
        <AdminTextarea
          label="Descrição qualitativa"
          name="descricao"
          value={descricao}
          onChange={setDescricao}
        />
        <SubmitButton label="Salvar disponibilidade" pending={pending} />
      </form>
  );
}

// ---------------------------------------------------------------------------
// Bloco 08 — Diagnóstico visual
// ---------------------------------------------------------------------------

type VisualSymptomOption = { id: number; descricao: string };

export function VisualSymptomForm({
  nutrients,
  symptoms,
}: {
  nutrients: SelectOption[];
  symptoms: VisualSymptomOption[];
}) {
  const [nutrienteId, setNutrienteId] = useState("");
  const [descricao, setDescricao] = useState("");
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      await createVisualSymptomAction(fd);
      setDescricao(""); // clear text input, keep nutrient selection
    });
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="grid gap-3">
        <AdminInput
          label="Sintoma"
          name="descricao"
          placeholder="Folhas amareladas"
          required
          value={descricao}
          onChange={setDescricao}
        />
        <PersistentSelect
          label="Nutriente associado"
          name="nutrienteId"
          options={nutrients}
          value={nutrienteId}
          onChange={setNutrienteId}
        />
        <SubmitButton label="Salvar sintoma" pending={pending} />
      </form>
      <SymptomList symptoms={symptoms} />
    </>
  );
}

function SymptomList({ symptoms }: { symptoms: VisualSymptomOption[] }) {
  return (
    <div className="admin-manageable-list mt-4 border border-[#243528]/12 bg-[#f4f5eb]/72 p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#758178]">Sintomas cadastrados</p>
        <span className="admin-list-count bg-[#eef3e8] px-2 py-1 text-xs font-semibold text-[#263e2b]">
          {symptoms.length}
        </span>
      </div>
      {symptoms.length === 0 ? (
        <p className="mt-3 text-sm text-[#738076]">Nenhum sintoma cadastrado.</p>
      ) : (
        <div className="mt-3 grid gap-2">
          {symptoms.map((item) => (
            <div
              key={item.id}
              className="admin-list-item flex flex-col gap-2 border border-[#243528]/10 bg-[#eef3e8]/70 px-3 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3"
            >
              <span className="break-words text-sm font-medium text-[#27382e]">{item.descricao}</span>
              <form action={deleteVisualSymptomAction}>
                <input type="hidden" name="id" value={item.id} />
                <button
                  type="submit"
                  className="admin-remove-button w-full bg-[#f0d9d9] px-3 py-1 text-xs font-semibold text-[#7a2a2a] transition hover:bg-[#e9c2c2] sm:w-auto"
                >
                  Remover
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
