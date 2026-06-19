import {
  createCategoryAction,
  createFunctionAction,
  createNutrientAction,
  createPhAvailabilityAction,
  createPhPointAction,
  createRelationTypeAction,
  createSpeciesFunctionAction,
  createSpeciesRelationAction,
  createVisualSymptomAction,
  deleteCategoryAction,
  deleteFunctionAction,
  deleteNutrientAction,
  deletePhPointAction,
  deleteRelationTypeAction,
  deleteVisualSymptomAction,
} from "./actions";

type SpeciesOption = {
  id: number;
  nome_popular: string;
};

type CategoryOption = {
  id: number;
  nome: string;
};

type FunctionOption = {
  id: number;
  nome: string;
};

type RelationTypeOption = {
  id: number;
  nome: string;
  nome_reverso: string;
};

type NutrientOption = {
  id: number;
  simbolo: string;
  nome: string;
};

type PhPointOption = {
  id: number;
  ph_valor: number;
};

type VisualSymptomOption = {
  id: number;
  descricao: string;
};

type AdminDataFormsProps = {
  categories: CategoryOption[];
  functions: FunctionOption[];
  nutrients: NutrientOption[];
  phPoints: PhPointOption[];
  relationTypes: RelationTypeOption[];
  species: SpeciesOption[];
  symptoms: VisualSymptomOption[];
};

export function AdminDataForms({
  categories,
  functions,
  nutrients,
  phPoints,
  relationTypes,
  species,
  symptoms,
}: AdminDataFormsProps) {
  const modules = [
    { label: "Categorias", value: categories.length },
    { label: "Funcoes", value: functions.length },
    { label: "Relacoes", value: relationTypes.length },
    { label: "Nutrientes", value: nutrients.length },
    { label: "Pontos pH", value: phPoints.length },
    { label: "Sintomas", value: symptoms.length },
  ];

  return (
    <section className="rounded-[30px] border border-[#dae2d0] bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#738072]">Dados do sistema</p>
          <h2 className="mt-1 text-xl font-semibold text-[#1f3127]">Cadastros complementares</h2>
          <p className="mt-1 text-sm text-[#657268]">
            Preencha as informacoes que alimentam filtros, relacoes, quimica do solo, pH e diagnostico visual.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:min-w-[420px]">
          {modules.map((module) => (
            <div key={module.label} className="rounded-2xl bg-[#f8faf5] px-3 py-2 text-center">
              <p className="text-lg font-bold text-[#1f3127]">{module.value}</p>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#738072]">{module.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <AdminDetails
          accent="01"
          title="Categorias e funcoes"
          description="Listas usadas no cadastro das plantas e nos filtros publicos."
        >
          <div className="grid gap-4 xl:grid-cols-2">
            <div>
              <SimpleNameForm action={createCategoryAction} label="Nova categoria" name="nome" placeholder="Ex.: Arvore frutifera" />
              <ManageableList
                deleteAction={deleteCategoryAction}
                emptyText="Nenhuma categoria cadastrada."
                items={categories.map((item) => ({ id: item.id, label: item.nome }))}
                title="Categorias cadastradas"
              />
            </div>
            <div>
              <SimpleNameForm action={createFunctionAction} label="Nova funcao" name="nome" placeholder="Ex.: Fixacao de nitrogenio" />
              <ManageableList
                deleteAction={deleteFunctionAction}
                emptyText="Nenhuma funcao cadastrada."
                items={functions.map((item) => ({ id: item.id, label: item.nome }))}
                title="Funcoes cadastradas"
              />
            </div>
          </div>
        </AdminDetails>

        <AdminDetails accent="02" title="Tipos de relacao" description="Textos direto e reverso para conectar especies.">
          <form action={createRelationTypeAction} className="grid gap-3">
            <AdminInput label="Nome da relacao" name="nome" placeholder="Fornece nitrogenio para" required />
            <AdminInput label="Nome reverso" name="nomeReverso" placeholder="Recebe nitrogenio de" required />
            <label className="flex items-center gap-2 text-sm text-[#405046]">
              <input name="simetrica" type="checkbox" className="accent-[#27412f]" />
              Relacao simetrica
            </label>
            <SubmitButton label="Salvar tipo de relacao" />
          </form>
          <ManageableList
            deleteAction={deleteRelationTypeAction}
            emptyText="Nenhum tipo de relacao cadastrado."
            items={relationTypes.map((item) => ({ id: item.id, label: `${item.nome} / ${item.nome_reverso}` }))}
            title="Tipos cadastrados"
          />
        </AdminDetails>

        <AdminDetails accent="03" title="Funcoes das especies" description="Associe uma planta a uma funcao.">
          <form action={createSpeciesFunctionAction} className="grid gap-3">
            <AdminSelect label="Especie" name="speciesId" options={species.map(toOption)} />
            <AdminSelect label="Funcao" name="funcaoId" options={functions.map(toOption)} />
            <SubmitButton label="Vincular funcao" />
          </form>
        </AdminDetails>

        <AdminDetails accent="04" title="Relacoes entre especies" description="Ex.: Gliricidia fornece nitrogenio para Acai.">
          <form action={createSpeciesRelationAction} className="grid gap-3">
            <AdminSelect label="Especie origem" name="fromSpeciesId" options={species.map(toOption)} />
            <AdminSelect label="Tipo de relacao" name="tipoRelacaoId" options={relationTypes.map(toOption)} />
            <AdminSelect label="Especie destino" name="toSpeciesId" options={species.map(toOption)} />
            <SubmitButton label="Criar relacao" />
          </form>
        </AdminDetails>

        <AdminDetails accent="05" title="Nutrientes" description="Dados exibidos no modulo Quimica do Solo.">
          <form action={createNutrientAction} className="grid gap-3">
            <div className="grid gap-3 sm:grid-cols-[120px_1fr]">
              <AdminInput label="Simbolo" name="simbolo" placeholder="N" required />
              <AdminInput label="Nome" name="nome" placeholder="Nitrogenio" required />
            </div>
            <AdminTextarea label="Funcao na planta" name="funcaoNaPlanta" />
            <AdminTextarea label="Sintomas de deficiencia" name="sintomasDeficiencia" />
            <AdminTextarea label="Fontes naturais" name="fontesNaturais" />
            <SubmitButton label="Salvar nutriente" />
          </form>
          <ManageableList
            deleteAction={deleteNutrientAction}
            emptyText="Nenhum nutriente cadastrado."
            items={nutrients.map((item) => ({ id: item.id, label: `${item.nome} (${item.simbolo})` }))}
            title="Nutrientes cadastrados"
          />
        </AdminDetails>

        <AdminDetails accent="06" title="Pontos de pH" description="Referencias para a barra interativa de fertilidade.">
          <form action={createPhPointAction} className="grid gap-3">
            <AdminInput label="Valor de pH" name="phValor" placeholder="6.0" required type="number" step="0.05" />
            <AdminTextarea label="Descricao da acidez" name="descricaoAcidez" />
            <AdminTextarea label="Atividade biologica" name="atividadeBiologica" />
            <AdminTextarea label="Presenca de aluminio" name="presencaAluminio" />
            <SubmitButton label="Salvar ponto de pH" />
          </form>
          <ManageableList
            deleteAction={deletePhPointAction}
            emptyText="Nenhum ponto de pH cadastrado."
            items={phPoints.map((item) => ({
              id: item.id,
              label: `pH ${Number(item.ph_valor).toFixed(2).replace(".", ",")}`,
            }))}
            title="Pontos cadastrados"
          />
        </AdminDetails>

        <AdminDetails accent="07" title="Disponibilidade por pH" description="Percentual de cada nutriente em cada ponto de pH.">
          <form action={createPhAvailabilityAction} className="grid gap-3">
            <AdminSelect
              label="Ponto de pH"
              name="phPontoId"
              options={phPoints.map((item) => ({
                id: item.id,
                nome: `pH ${Number(item.ph_valor).toFixed(2).replace(".", ",")}`,
              }))}
            />
            <AdminSelect label="Nutriente" name="nutrienteId" options={nutrients.map(toOption)} />
            <AdminInput label="Disponibilidade (%)" name="disponibilidadePct" placeholder="85" required type="number" />
            <AdminTextarea label="Descricao qualitativa" name="descricao" />
            <SubmitButton label="Salvar disponibilidade" />
          </form>
        </AdminDetails>

        <AdminDetails accent="08" title="Diagnostico visual" description="Sintomas observados e nutriente mais provavel.">
          <form action={createVisualSymptomAction} className="grid gap-3">
            <AdminInput label="Sintoma" name="descricao" placeholder="Folhas amareladas" required />
            <AdminSelect label="Nutriente associado" name="nutrienteId" options={nutrients.map(toOption)} />
            <SubmitButton label="Salvar sintoma" />
          </form>
          <ManageableList
            deleteAction={deleteVisualSymptomAction}
            emptyText="Nenhum sintoma cadastrado."
            items={symptoms.map((item) => ({ id: item.id, label: item.descricao }))}
            title="Sintomas cadastrados"
          />
        </AdminDetails>
      </div>
    </section>
  );
}

function AdminDetails({
  accent,
  children,
  description,
  title,
}: {
  accent: string;
  children: React.ReactNode;
  description: string;
  title: string;
}) {
  return (
    <details className="group overflow-hidden rounded-[24px] border border-[#dfe8d5] bg-[#fbfcf8] shadow-sm">
      <summary className="cursor-pointer list-none p-4 marker:hidden [&::-webkit-details-marker]:hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="flex gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#27412f] text-sm font-bold text-white">
              {accent}
            </span>
            <div>
              <h3 className="font-semibold text-[#1f3127]">{title}</h3>
            <p className="mt-1 text-sm leading-6 text-[#657268]">{description}</p>
            </div>
          </div>
          <span className="rounded-full bg-[#edf4e2] px-3 py-1 text-xs font-semibold text-[#607149] group-open:bg-[#27412f] group-open:text-white">
            <span className="group-open:hidden">Abrir</span>
            <span className="hidden group-open:inline">Fechar</span>
          </span>
        </div>
      </summary>
      <div className="border-t border-[#e5eddd] p-4">{children}</div>
    </details>
  );
}

function ManageableList({
  deleteAction,
  emptyText,
  items,
  title,
}: {
  deleteAction: (formData: FormData) => void | Promise<void>;
  emptyText: string;
  items: Array<{ id: number; label: string }>;
  title: string;
}) {
  return (
    <div className="mt-4 rounded-2xl border border-[#e1e8da] bg-white p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#758178]">{title}</p>
        <span className="rounded-full bg-[#f0f5e9] px-2 py-1 text-xs font-semibold text-[#607149]">
          {items.length}
        </span>
      </div>

      {items.length === 0 ? (
        <p className="mt-3 text-sm text-[#738076]">{emptyText}</p>
      ) : (
        <div className="mt-3 grid gap-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 rounded-xl bg-[#f8faf5] px-3 py-2"
            >
              <span className="text-sm font-medium text-[#27382e]">{item.label}</span>
              <form action={deleteAction}>
                <input type="hidden" name="id" value={item.id} />
                <button
                  type="submit"
                  className="rounded-full bg-[#f0d9d9] px-3 py-1 text-xs font-semibold text-[#7a2a2a] transition hover:bg-[#e9c2c2]"
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

function SimpleNameForm({
  action,
  label,
  name,
  placeholder,
}: {
  action: (formData: FormData) => void | Promise<void>;
  label: string;
  name: string;
  placeholder: string;
}) {
  return (
    <form action={action} className="mb-3 grid gap-3">
      <AdminInput label={label} name={name} placeholder={placeholder} required />
      <SubmitButton label="Salvar" />
    </form>
  );
}

function AdminInput({
  label,
  name,
  placeholder,
  required = false,
  step,
  type = "text",
}: {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  step?: string;
  type?: string;
}) {
  return (
    <label className="space-y-1 text-sm text-[#405046]">
      <span>{label}</span>
      <input
        name={name}
        placeholder={placeholder}
        required={required}
        step={step}
        type={type}
        className="w-full rounded-xl border border-[#d4dcc8] bg-white px-3 py-2 outline-none transition focus:border-[#97b178] focus:ring-2 focus:ring-[#c6d7ae]"
      />
    </label>
  );
}

function AdminTextarea({ label, name }: { label: string; name: string }) {
  return (
    <label className="space-y-1 text-sm text-[#405046]">
      <span>{label}</span>
      <textarea
        name={name}
        rows={3}
        className="w-full resize-y rounded-xl border border-[#d4dcc8] bg-white px-3 py-2 outline-none transition focus:border-[#97b178] focus:ring-2 focus:ring-[#c6d7ae]"
      />
    </label>
  );
}

function AdminSelect({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: Array<{ id: number; nome: string }>;
}) {
  return (
    <label className="space-y-1 text-sm text-[#405046]">
      <span>{label}</span>
      <select
        name={name}
        required
        className="w-full rounded-xl border border-[#d4dcc8] bg-white px-3 py-2 outline-none transition focus:border-[#97b178] focus:ring-2 focus:ring-[#c6d7ae]"
      >
        <option value="" disabled>
          Selecione
        </option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.nome}
          </option>
        ))}
      </select>
    </label>
  );
}

function SubmitButton({ label }: { label: string }) {
  return (
    <button
      type="submit"
      className="w-fit rounded-full bg-[#27412f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1b2e22]"
    >
      {label}
    </button>
  );
}

function toOption(item: { id: number; nome?: string; nome_popular?: string }) {
  return {
    id: item.id,
    nome: item.nome ?? item.nome_popular ?? String(item.id),
  };
}
