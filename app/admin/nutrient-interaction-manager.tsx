"use client";

import { useActionState, useEffect, useState, useSyncExternalStore, type FormEvent } from "react";
import {
  createNutrientInteractionAction,
  deleteNutrientInteractionAction,
  updateNutrientInteractionAction,
  type NutrientInteractionActionState,
} from "./actions";
import { AdminModal } from "./admin-modal";

type NutrientOption = {
  id: number;
  simbolo: string;
  nome: string;
};

type NutrientInteractionRow = {
  id: number;
  source_nutrient_id: number;
  target_nutrient_id: number;
  relation_type: string;
  mechanism: string;
  description: string | null;
  source_nutrient?: NutrientOption;
  target_nutrient?: NutrientOption;
};

type NutrientInteractionManagerProps = {
  interactions: NutrientInteractionRow[];
  nutrients: NutrientOption[];
};

type PendingEdit = {
  interactionId: number;
  sourceNutrientId: string;
  targetNutrientIds: string[];
  relationType: string;
  mechanism: string;
  description: string;
};

type NutrientInteractionDraft = {
  sourceNutrientId: string;
  targetNutrientIds: string[];
  relationType: string;
  mechanism: string;
  description: string;
};

const interactionDraftStorageKey = "saf:nutrient-interaction:create-draft";
const interactionDraftEvent = "saf-nutrient-interaction-draft-change";
const emptyInteractionDraft: NutrientInteractionDraft = {
  sourceNutrientId: "",
  targetNutrientIds: [],
  relationType: "",
  mechanism: "",
  description: "",
};

const relationTypes = [
  "Competição Catiônica",
  "Competição Aniônica",
  "Precipitação Química",
  "Inibição por pH",
  "Formação de Complexos",
  "Outro",
];

const mechanisms = [
  "Competição por sítios de absorção",
  "Formação de precipitados insolúveis",
  "Alteração da carga superficial",
  "Modificação da solubilidade",
  "Interferência na translocação",
  "Outro mecanismo",
];

const initialActionState: NutrientInteractionActionState = {
  status: "idle",
  message: "",
};

export function NutrientInteractionManager({ interactions, nutrients }: NutrientInteractionManagerProps) {
  const [createState, createFormAction, isCreating] = useActionState(
    createNutrientInteractionAction,
    initialActionState
  );
  const [updateState, updateFormAction, isUpdating] = useActionState(
    updateNutrientInteractionAction,
    initialActionState
  );
  const [deleteState, deleteFormAction, isDeleting] = useActionState(
    deleteNutrientInteractionAction,
    initialActionState
  );
  const [editingInteraction, setEditingInteraction] = useState<NutrientInteractionRow | null>(null);
  const [deletingInteraction, setDeletingInteraction] = useState<NutrientInteractionRow | null>(null);
  const [pendingEdit, setPendingEdit] = useState<PendingEdit | null>(null);
  const [submittedUpdateId, setSubmittedUpdateId] = useState<number | null>(null);
  const [submittedDeleteId, setSubmittedDeleteId] = useState<number | null>(null);
  const [isDiscardDraftOpen, setIsDiscardDraftOpen] = useState(false);
  const draftSnapshot = useSyncExternalStore(subscribeToInteractionDraft, readInteractionDraft, () => null);
  const createDraft = parseInteractionDraft(draftSnapshot);
  const feedback = deleteState.message || updateState.message || createState.message;

  useEffect(() => {
    if (createState.status === "success") {
      clearInteractionDraft();
    }
  }, [createState.status]);

  function updateCreateDraft(patch: Partial<NutrientInteractionDraft>) {
    saveInteractionDraft({ ...createDraft, ...patch });
  }

  return (
    <div className="nutrient-interaction-manager">
      <form action={createFormAction} className="grid gap-3">
        <NutrientSelect
          label="Nutriente em Excesso (Origem)"
          name="sourceNutrientId"
          nutrients={nutrients}
          value={createDraft.sourceNutrientId}
          onChange={(sourceNutrientId) => updateCreateDraft({ sourceNutrientId })}
        />
        <NutrientMultiSelect
          nutrients={nutrients}
          selectedIds={createDraft.targetNutrientIds.map(Number)}
          onChange={(targetNutrientIds) => updateCreateDraft({ targetNutrientIds })}
        />
        <OptionSelect
          label="Tipo de Relação / Mecanismo"
          name="relationType"
          options={relationTypes}
          value={createDraft.relationType}
          onChange={(relationType) => updateCreateDraft({ relationType })}
        />
        <OptionSelect
          label="Detalhamento do Mecanismo"
          name="mechanism"
          options={mechanisms}
          value={createDraft.mechanism}
          onChange={(mechanism) => updateCreateDraft({ mechanism })}
        />
        <label className="space-y-1 text-sm text-[#405046]">
          <span>Descrição / Observação Pedagógica</span>
          <textarea
            name="description"
            rows={3}
            value={createDraft.description}
            onChange={(event) => updateCreateDraft({ description: event.target.value })}
            className="w-full resize-y border border-[#243528]/18 bg-[#f7f8ef]/80 px-3 py-2 outline-none transition focus:border-[#263e2b] focus:ring-2 focus:ring-[#9bad8f]/40"
          />
        </label>
        {hasInteractionDraft(createDraft) ? (
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#738072]" role="status">
            <span>Rascunho salvo automaticamente.</span>
            <button type="button" onClick={() => setIsDiscardDraftOpen(true)} className="font-semibold text-[#7a2a2a] underline underline-offset-2">
              Descartar rascunho
            </button>
          </div>
        ) : null}
        <OperationMessage state={createState} />
        <button type="submit" disabled={isCreating} className="w-full bg-[#12251a] px-4 py-2 text-sm font-semibold text-[#f3f1e8] transition hover:bg-[#223a2a] disabled:cursor-wait disabled:opacity-60 sm:w-fit">
          {isCreating ? "Salvando..." : "Salvar interação"}
        </button>
      </form>

      <div className="admin-manageable-list mt-4 border border-[#243528]/12 bg-[#f4f5eb]/72 p-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#758178]">Interações cadastradas</p>
          <span className="admin-list-count bg-[#eef3e8] px-2 py-1 text-xs font-semibold text-[#263e2b]">{interactions.length}</span>
        </div>
        {feedback ? <p className="mt-3 text-sm text-[#405046]" role="status">{feedback}</p> : null}
        {interactions.length === 0 ? (
          <p className="mt-3 text-sm text-[#738076]">Nenhuma interação cadastrada.</p>
        ) : (
          <div className="mt-3 grid gap-2">
            {interactions.map((interaction) => (
              <div key={interaction.id} className="admin-list-item flex flex-col gap-3 border border-[#243528]/10 bg-[#eef3e8]/70 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#27382e]">
                    <span className="font-semibold">{formatNutrient(interaction.source_nutrient, interaction.source_nutrient_id)}</span>
                    {" > "}
                    <span className="font-semibold">{formatNutrient(interaction.target_nutrient, interaction.target_nutrient_id)}</span>
                  </p>
                  <p className="mt-1 text-xs text-[#657268]">{interaction.relation_type} · {interaction.mechanism}</p>
                  {interaction.description ? <p className="mt-1 text-xs leading-5 text-[#657268]">{interaction.description}</p> : null}
                </div>
                <div className="flex shrink-0 gap-2">
                  <button type="button" onClick={() => { setEditingInteraction(interaction); setPendingEdit(null); setSubmittedUpdateId(null); }} className="admin-edit-button bg-[#e8f1dc] px-3 py-1 text-xs font-semibold text-[#4d651f] transition hover:bg-[#dce8c8]">Editar</button>
                  <button type="button" onClick={() => { setDeletingInteraction(interaction); setSubmittedDeleteId(null); }} className="admin-remove-button bg-[#f0d9d9] px-3 py-1 text-xs font-semibold text-[#7a2a2a] transition hover:bg-[#e9c2c2]">Excluir</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingInteraction && !pendingEdit ? (
        <AdminModal
          title="Editar interação nutricional"
          description="Altere os dados da relação selecionada e confirme antes de salvar."
          onClose={() => setEditingInteraction(null)}
        >
          <form
            className="grid gap-3"
            onSubmit={(event: FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              setPendingEdit({
                interactionId: Number(formData.get("interactionId")),
                sourceNutrientId: String(formData.get("sourceNutrientId") ?? ""),
                targetNutrientIds: formData.getAll("targetNutrientIds").map(String),
                relationType: String(formData.get("relationType") ?? ""),
                mechanism: String(formData.get("mechanism") ?? ""),
                description: String(formData.get("description") ?? ""),
              });
              setSubmittedUpdateId(null);
            }}
          >
            <input type="hidden" name="interactionId" value={editingInteraction.id} />
            <NutrientSelect label="Nutriente em Excesso (Origem)" name="sourceNutrientId" nutrients={nutrients} value={String(editingInteraction.source_nutrient_id)} />
            <NutrientMultiSelect
              nutrients={nutrients}
              selectedIds={interactions
                .filter(
                  (interaction) =>
                    interaction.source_nutrient_id === editingInteraction.source_nutrient_id &&
                    interaction.mechanism === editingInteraction.mechanism &&
                    interaction.relation_type === editingInteraction.relation_type
                )
                .map((interaction) => interaction.target_nutrient_id)}
            />
            <OptionSelect label="Tipo de Relação / Mecanismo" name="relationType" options={relationTypes} value={editingInteraction.relation_type} />
            <OptionSelect label="Detalhamento do Mecanismo" name="mechanism" options={mechanisms} value={editingInteraction.mechanism} />
            <label className="space-y-1 text-sm text-[#405046]">
              <span>Descrição / Observação Pedagógica</span>
              <textarea name="description" defaultValue={editingInteraction.description ?? ""} rows={3} className="w-full resize-y border border-[#243528]/18 bg-[#f7f8ef]/80 px-3 py-2 outline-none transition focus:border-[#263e2b] focus:ring-2 focus:ring-[#9bad8f]/40" />
            </label>
            <OperationMessage state={updateState} />
            <div className="admin-danger-actions">
              <button type="submit" disabled={isUpdating} className="admin-danger-button disabled:cursor-wait disabled:opacity-60">Avançar para confirmação</button>
              <button type="button" onClick={() => setEditingInteraction(null)} className="admin-secondary-button">Cancelar</button>
            </div>
          </form>
        </AdminModal>
      ) : null}

      {pendingEdit ? (
        <AdminModal
          title="Confirmar alteração"
          description="Tem certeza de que deseja salvar as alterações desta interação nutricional?"
          onClose={() => setPendingEdit(null)}
        >
          {updateState.status === "success" && submittedUpdateId === pendingEdit.interactionId ? (
            <div className="grid gap-3">
              <OperationMessage state={updateState} />
              <button type="button" onClick={() => setPendingEdit(null)} className="admin-secondary-button">Fechar</button>
            </div>
          ) : (
            <form action={updateFormAction} onSubmit={() => setSubmittedUpdateId(pendingEdit.interactionId)} className="grid gap-3">
              <input type="hidden" name="interactionId" value={pendingEdit.interactionId} />
              <input type="hidden" name="sourceNutrientId" value={pendingEdit.sourceNutrientId} />
              {pendingEdit.targetNutrientIds.map((targetId) => <input key={targetId} type="hidden" name="targetNutrientIds" value={targetId} />)}
              <input type="hidden" name="relationType" value={pendingEdit.relationType} />
              <input type="hidden" name="mechanism" value={pendingEdit.mechanism} />
              <input type="hidden" name="description" value={pendingEdit.description} />
              <p className="text-sm leading-7 text-[var(--theme-muted)]">A alteração será aplicada ao registro selecionado e aos nutrientes de destino informados.</p>
              <OperationMessage state={updateState} />
              <div className="admin-danger-actions">
                <button type="submit" disabled={isUpdating} className="admin-danger-button disabled:cursor-wait disabled:opacity-60">{isUpdating ? "Salvando..." : "Confirmar alteração"}</button>
                <button type="button" onClick={() => setPendingEdit(null)} className="admin-secondary-button">Cancelar</button>
              </div>
            </form>
          )}
        </AdminModal>
      ) : null}

      {deletingInteraction ? (
        <AdminModal
          title="Excluir interação nutricional"
          description="Tem certeza de que deseja excluir esta relação? Esta ação não poderá ser desfeita."
          isDanger
          onClose={() => setDeletingInteraction(null)}
        >
          {deleteState.status === "success" && submittedDeleteId === deletingInteraction.id ? (
            <div className="grid gap-3">
              <OperationMessage state={deleteState} />
              <button type="button" onClick={() => setDeletingInteraction(null)} className="admin-secondary-button">Fechar</button>
            </div>
          ) : (
            <>
              <div className="admin-danger-box">
                <p className="font-semibold">Tem certeza de que deseja excluir esta relação?</p>
                <p className="mt-1">Esta ação não poderá ser desfeita e não removerá os nutrientes envolvidos.</p>
              </div>
              <form action={deleteFormAction} onSubmit={() => setSubmittedDeleteId(deletingInteraction.id)} className="admin-danger-actions">
                <input type="hidden" name="id" value={deletingInteraction.id} />
                <button type="submit" disabled={isDeleting} className="admin-danger-button disabled:cursor-wait disabled:opacity-60">{isDeleting ? "Excluindo..." : "Excluir"}</button>
                <button type="button" onClick={() => setDeletingInteraction(null)} className="admin-secondary-button">Cancelar</button>
              </form>
              <OperationMessage state={deleteState} />
            </>
          )}
        </AdminModal>
      ) : null}

      {isDiscardDraftOpen ? (
        <AdminModal
          title="Descartar rascunho"
          description="As informações preenchidas neste cadastro serão removidas deste navegador."
          isDanger
          onClose={() => setIsDiscardDraftOpen(false)}
        >
          <div className="admin-danger-box">
            <p className="font-semibold">Tem certeza de que deseja descartar o rascunho?</p>
            <p className="mt-1">Nenhuma relação salva no banco será alterada.</p>
          </div>
          <div className="admin-danger-actions">
            <button
              type="button"
              onClick={() => {
                clearInteractionDraft();
                setIsDiscardDraftOpen(false);
              }}
              className="admin-danger-button"
            >
              Descartar rascunho
            </button>
            <button type="button" onClick={() => setIsDiscardDraftOpen(false)} className="admin-secondary-button">
              Cancelar
            </button>
          </div>
        </AdminModal>
      ) : null}
    </div>
  );
}

function NutrientSelect({
  label,
  name,
  nutrients,
  onChange,
  value,
}: {
  label: string;
  name: string;
  nutrients: NutrientOption[];
  onChange?: (value: string) => void;
  value?: string;
}) {
  return (
    <label className="space-y-1 text-sm text-[#405046]">
      <span>{label}</span>
      <select
        name={name}
        required
        value={onChange ? value ?? "" : undefined}
        defaultValue={onChange ? undefined : value ?? ""}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
        className="w-full border border-[#243528]/18 bg-[#f7f8ef]/80 px-3 py-2 outline-none transition focus:border-[#263e2b] focus:ring-2 focus:ring-[#9bad8f]/40"
      >
        <option value="" disabled>Selecione</option>
        {nutrients.map((nutrient) => <option key={nutrient.id} value={nutrient.id}>{nutrient.nome} ({nutrient.simbolo})</option>)}
      </select>
    </label>
  );
}

function NutrientMultiSelect({
  nutrients,
  onChange,
  selectedIds = [],
}: {
  nutrients: NutrientOption[];
  onChange?: (values: string[]) => void;
  selectedIds?: number[];
}) {
  return (
    <fieldset className="space-y-2 text-sm text-[#405046]">
      <legend>Nutriente(s) Bloqueado(s) (Destino)</legend>
      <div className="grid max-h-52 gap-2 overflow-y-auto border border-[#243528]/18 bg-[#f7f8ef]/80 p-2 sm:grid-cols-2">
        {nutrients.map((nutrient) => (
          <label
            key={nutrient.id}
            className="flex min-w-0 cursor-pointer items-center gap-2 border border-transparent px-2 py-2 text-sm transition hover:border-[#9bad8f]/60 hover:bg-[#eef3e8] has-[:checked]:border-[#9bad8f] has-[:checked]:bg-[#e5efd4]"
          >
            <input
              type="checkbox"
              name="targetNutrientIds"
              value={nutrient.id}
              checked={onChange ? selectedIds.includes(nutrient.id) : undefined}
              defaultChecked={onChange ? undefined : selectedIds.includes(nutrient.id)}
              onChange={
                onChange
                  ? (event) => {
                      const nextValues = new Set(selectedIds.map(String));
                      if (event.target.checked) {
                        nextValues.add(String(nutrient.id));
                      } else {
                        nextValues.delete(String(nutrient.id));
                      }
                      onChange(Array.from(nextValues));
                    }
                  : undefined
              }
              className="h-4 w-4 shrink-0 accent-[#27412f]"
            />
            <span className="truncate" title={`${nutrient.nome} (${nutrient.simbolo})`}>
              {nutrient.nome} ({nutrient.simbolo})
            </span>
          </label>
        ))}
      </div>
      <p className="text-xs text-[#738072]">Marque um ou mais nutrientes afetados.</p>
    </fieldset>
  );
}

function OptionSelect({
  label,
  name,
  onChange,
  options,
  value,
}: {
  label: string;
  name: string;
  onChange?: (value: string) => void;
  options: string[];
  value?: string;
}) {
  return (
    <label className="space-y-1 text-sm text-[#405046]">
      <span>{label}</span>
      <select
        name={name}
        required
        value={onChange ? value ?? "" : undefined}
        defaultValue={onChange ? undefined : value ?? ""}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
        className="w-full border border-[#243528]/18 bg-[#f7f8ef]/80 px-3 py-2 outline-none transition focus:border-[#263e2b] focus:ring-2 focus:ring-[#9bad8f]/40"
      >
        <option value="" disabled>Selecione</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function OperationMessage({ state }: { state: NutrientInteractionActionState }) {
  if (state.status === "idle") return null;
  return <p role={state.status === "error" ? "alert" : "status"} className={state.status === "error" ? "bg-[#f6dddd] px-3 py-2 text-sm text-[#733131]" : "bg-[#e5efd4] px-3 py-2 text-sm text-[#45601e]"}>{state.message}</p>;
}

function formatNutrient(nutrient: NutrientOption | undefined, fallbackId: number) {
  return nutrient ? `${nutrient.nome} (${nutrient.simbolo})` : `Nutriente ${fallbackId}`;
}

function subscribeToInteractionDraft(callback: () => void) {
  window.addEventListener(interactionDraftEvent, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(interactionDraftEvent, callback);
    window.removeEventListener("storage", callback);
  };
}

function readInteractionDraft() {
  return window.localStorage.getItem(interactionDraftStorageKey);
}

function parseInteractionDraft(rawDraft: string | null): NutrientInteractionDraft {
  if (!rawDraft) {
    return emptyInteractionDraft;
  }

  try {
    const parsed = JSON.parse(rawDraft) as Partial<NutrientInteractionDraft>;
    return {
      sourceNutrientId: typeof parsed.sourceNutrientId === "string" ? parsed.sourceNutrientId : "",
      targetNutrientIds: Array.isArray(parsed.targetNutrientIds) ? parsed.targetNutrientIds.map(String) : [],
      relationType: typeof parsed.relationType === "string" ? parsed.relationType : "",
      mechanism: typeof parsed.mechanism === "string" ? parsed.mechanism : "",
      description: typeof parsed.description === "string" ? parsed.description : "",
    };
  } catch {
    return emptyInteractionDraft;
  }
}

function saveInteractionDraft(draft: NutrientInteractionDraft) {
  if (!hasInteractionDraft(draft)) {
    clearInteractionDraft();
    return;
  }

  window.localStorage.setItem(interactionDraftStorageKey, JSON.stringify(draft));
  window.dispatchEvent(new Event(interactionDraftEvent));
}

function clearInteractionDraft() {
  window.localStorage.removeItem(interactionDraftStorageKey);
  window.dispatchEvent(new Event(interactionDraftEvent));
}

function hasInteractionDraft(draft: NutrientInteractionDraft) {
  return Boolean(
    draft.sourceNutrientId ||
      draft.targetNutrientIds.length > 0 ||
      draft.relationType ||
      draft.mechanism ||
      draft.description.trim()
  );
}
