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
    { label: "Funções", value: functions.length },
    { label: "Relações", value: relationTypes.length },
    { label: "Nutrientes", value: nutrients.length },
    { label: "Pontos pH", value: phPoints.length },
    { label: "Sintomas", value: symptoms.length },
  ];

  return (
    <section className="border border-[#243528]/16 bg-[#f4f5eb]/82 p-4 shadow-[0_18px_60px_rgba(17,27,21,0.08)] backdrop-blur-md sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#738072]">Dados do sistema</p>
          <h2 className="mt-1 text-xl font-semibold text-[#1f3127]">Cadastros complementares</h2>
          <p className="mt-1 text-sm text-[#657268]">
            Preencha as informações que alimentam filtros, relações, química do solo, pH e diagnóstico visual.
          </p>
        </div>
        <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-3 lg:min-w-[420px] lg:w-auto">
          {modules.map((module) => (
            <div
              key={module.label}
              className="admin-count-tile border border-[#243528]/12 bg-[#eef3e8]/70 px-3 py-2 text-center"
            >
              <p className="text-lg font-bold text-[#1f3127]">{module.value}</p>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#738072]">{module.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <AdminDetails
          accent="01"
          title="Categorias e funções"
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
              <SimpleNameForm action={createFunctionAction} label="Nova função" name="nome" placeholder="Ex.: Fixação de nitrogênio" />
              <ManageableList
                deleteAction={deleteFunctionAction}
                emptyText="Nenhuma função cadastrada."
                items={functions.map((item) => ({ id: item.id, label: item.nome }))}
                title="Funções cadastradas"
              />
            </div>
          </div>
        </AdminDetails>

        <AdminDetails accent="02" title="Tipos de relação" description="Textos direto e reverso para conectar espécies.">
          <form action={createRelationTypeAction} className="grid gap-3">
            <AdminInput label="Nome da relação" name="nome" placeholder="Fornece nitrogênio para" required />
            <AdminInput label="Nome reverso" name="nomeReverso" placeholder="Recebe nitrogênio de" required />
            <label className="flex items-center gap-2 text-sm text-[#405046]">
              <input name="simetrica" type="checkbox" className="accent-[#27412f]" />
              Relação simétrica
            </label>
            <SubmitButton label="Salvar tipo de relação" />
          </form>
          <ManageableList
            deleteAction={deleteRelationTypeAction}
            emptyText="Nenhum tipo de relação cadastrado."
            items={relationTypes.map((item) => ({ id: item.id, label: `${item.nome} / ${item.nome_reverso}` }))}
            title="Tipos cadastrados"
          />
        </AdminDetails>

        <AdminDetails accent="03" title="Funções das espécies" description="Associe uma planta a uma função.">
          <form action={createSpeciesFunctionAction} className="grid gap-3">
            <AdminSelect label="Espécie" name="speciesId" options={species.map(toOption)} />
            <AdminSelect label="Função" name="funcaoId" options={functions.map(toOption)} />
            <SubmitButton label="Vincular função" />
          </form>
        </AdminDetails>

        <AdminDetails accent="04" title="Relações entre espécies" description="Ex.: Gliricídia fornece nitrogênio para Açaí.">
          <form action={createSpeciesRelationAction} className="grid gap-3">
            <AdminSelect label="Espécie origem" name="fromSpeciesId" options={species.map(toOption)} />
            <AdminSelect label="Tipo de relação" name="tipoRelacaoId" options={relationTypes.map(toOption)} />
            <AdminSelect label="Espécie destino" name="toSpeciesId" options={species.map(toOption)} />
            <SubmitButton label="Criar relação" />
          </form>
        </AdminDetails>

        <AdminDetails accent="05" title="Nutrientes" description="Dados exibidos no módulo Química do Solo.">
          <form action={createNutrientAction} className="grid gap-3">
            <div className="grid gap-3 sm:grid-cols-[120px_1fr]">
              <AdminInput label="Simbolo" name="simbolo" placeholder="N" required />
              <AdminInput label="Nome" name="nome" placeholder="Nitrogênio" required />
            </div>
            <AdminTextarea label="Função na planta" name="funcaoNaPlanta" />
            <AdminTextarea label="Sintomas de deficiência" name="sintomasDeficiencia" />
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
            <AdminTextarea label="Descrição da acidez" name="descricaoAcidez" />
            <AdminTextarea label="Atividade biológica" name="atividadeBiologica" />
            <AdminTextarea label="Presença de alumínio" name="presencaAluminio" />
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
            <AdminTextarea label="Descrição qualitativa" name="descricao" />
            <SubmitButton label="Salvar disponibilidade" />
          </form>
        </AdminDetails>

        <AdminDetails accent="08" title="Diagnóstico visual" description="Sintomas observados e nutriente mais provável.">
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
    <details className="group overflow-hidden border border-[#243528]/14 bg-[#f8f8f1]/78 shadow-[0_12px_40px_rgba(17,27,21,0.06)]">
      <summary className="cursor-pointer list-none p-4 marker:hidden [&::-webkit-details-marker]:hidden">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#12251a] text-sm font-bold text-[#f3f1e8]">
              {accent}
            </span>
            <div>
              <h3 className="font-semibold text-[#1f3127]">{title}</h3>
            <p className="mt-1 text-sm leading-6 text-[#657268]">{description}</p>
            </div>
          </div>
          <span className="admin-details-toggle w-fit border border-[#243528]/12 bg-[#eef3e8]/70 px-3 py-1 text-xs font-semibold text-[#263e2b] group-open:bg-[#12251a] group-open:text-[#f3f1e8]">
            <span className="group-open:hidden">Abrir</span>
            <span className="hidden group-open:inline">Fechar</span>
          </span>
        </div>
      </summary>
      <div className="border-t border-[#243528]/12 p-4">{children}</div>
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
    <div className="admin-manageable-list mt-4 border border-[#243528]/12 bg-[#f4f5eb]/72 p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#758178]">{title}</p>
        <span className="admin-list-count bg-[#eef3e8] px-2 py-1 text-xs font-semibold text-[#263e2b]">
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
              className="admin-list-item flex flex-col gap-2 border border-[#243528]/10 bg-[#eef3e8]/70 px-3 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3"
            >
              <span className="break-words text-sm font-medium text-[#27382e]">{item.label}</span>
              <form action={deleteAction}>
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
        className="w-full border border-[#243528]/18 bg-[#f7f8ef]/80 px-3 py-2 outline-none transition focus:border-[#263e2b] focus:ring-2 focus:ring-[#9bad8f]/40"
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
        className="w-full resize-y border border-[#243528]/18 bg-[#f7f8ef]/80 px-3 py-2 outline-none transition focus:border-[#263e2b] focus:ring-2 focus:ring-[#9bad8f]/40"
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
        className="w-full border border-[#243528]/18 bg-[#f7f8ef]/80 px-3 py-2 outline-none transition focus:border-[#263e2b] focus:ring-2 focus:ring-[#9bad8f]/40"
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
      className="w-full bg-[#12251a] px-4 py-2 text-sm font-semibold text-[#f3f1e8] transition hover:bg-[#223a2a] sm:w-fit"
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
