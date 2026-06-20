"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getFriendlySupabaseErrorMessage } from "@/lib/errors/supabase";
import { createAdminClient } from "@/lib/supabase/admin";
import { bigIntIdSchema, createSpeciesSchema } from "@/lib/validation";

export type CreateSpeciesActionState = {
  status: "idle" | "success" | "error";
  message: string;
  fields?: SpeciesFormFields;
};

type SpeciesFormFields = {
  categoriaId: string;
  explicacao: string;
  fotoUrl: string;
  nomeCientifico: string;
  nomePopular: string;
};

const simpleNameSchema = z.object({
  nome: z.string().trim().min(2, "Informe um nome valido."),
});

const relationTypeSchema = z.object({
  nome: z.string().trim().min(2, "Informe o nome da relação."),
  nomeReverso: z.string().trim().min(2, "Informe o nome reverso da relação."),
  simetrica: z.coerce.boolean().default(false),
});

const speciesFunctionSchema = z.object({
  speciesId: bigIntIdSchema,
  funcaoId: bigIntIdSchema,
});

const speciesRelationSchema = z.object({
  fromSpeciesId: bigIntIdSchema,
  toSpeciesId: bigIntIdSchema,
  tipoRelacaoId: bigIntIdSchema,
}).refine((data) => data.fromSpeciesId !== data.toSpeciesId, {
  message: "Escolha duas espécies diferentes.",
});

const nutrientSchema = z.object({
  simbolo: z.string().trim().min(1, "Informe o simbolo."),
  nome: z.string().trim().min(2, "Informe o nome."),
  funcaoNaPlanta: z.string().trim().optional(),
  sintomasDeficiencia: z.string().trim().optional(),
  fontesNaturais: z.string().trim().optional(),
});

const phPointSchema = z.object({
  phValor: z.coerce.number().min(0).max(14),
  descricaoAcidez: z.string().trim().optional(),
  atividadeBiologica: z.string().trim().optional(),
  presencaAluminio: z.string().trim().optional(),
});

const phAvailabilitySchema = z.object({
  phPontoId: bigIntIdSchema,
  nutrienteId: bigIntIdSchema,
  disponibilidadePct: z.coerce.number().min(0).max(100),
  descricao: z.string().trim().optional(),
});

const visualSymptomSchema = z.object({
  descricao: z.string().trim().min(2, "Informe o sintoma."),
  nutrienteId: bigIntIdSchema,
});

export async function createSpeciesAction(
  _previousState: CreateSpeciesActionState,
  formData: FormData
): Promise<CreateSpeciesActionState> {
  const fields = parseSpeciesFormData(formData);
  const parsed = createSpeciesSchema.safeParse(fields);

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Dados invalidos.",
      fields,
    };
  }

  const supabase = createAdminClient();
  const fotoUrl = await resolveSpeciesPhotoUrl(supabase, formData);

  if (fotoUrl instanceof Error) {
    return {
      status: "error",
      message: fotoUrl.message,
      fields,
    };
  }

  const { error } = await supabase.from("species").insert({
    nome_popular: parsed.data.nomePopular,
    nome_cientifico: parsed.data.nomeCientifico,
    categoria_id: parsed.data.categoriaId,
    foto_url: resolvePhotoValue(fotoUrl, parsed.data.fotoUrl),
    explicacao: parsed.data.explicacao,
  });

  if (error) {
    return {
      status: "error",
      message: getFriendlySupabaseErrorMessage(error),
      fields,
    };
  }

  revalidatePath("/admin");

  return {
    status: "success",
    message: "Especie cadastrada com sucesso.",
  };
}

export async function updateSpeciesAction(
  _previousState: CreateSpeciesActionState,
  formData: FormData
): Promise<CreateSpeciesActionState> {
  const fields = parseSpeciesFormData(formData);
  const speciesId = bigIntIdSchema.safeParse(formData.get("speciesId"));

  if (!speciesId.success) {
    return {
      status: "error",
      message: "Não foi possível identificar a espécie para edição.",
      fields,
    };
  }

  const parsed = createSpeciesSchema.safeParse(fields);

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Dados invalidos.",
      fields,
    };
  }

  const supabase = createAdminClient();
  const fotoUrl = await resolveSpeciesPhotoUrl(supabase, formData);

  if (fotoUrl instanceof Error) {
    return {
      status: "error",
      message: fotoUrl.message,
      fields,
    };
  }

  const { error } = await supabase
    .from("species")
    .update({
      nome_popular: parsed.data.nomePopular,
      nome_cientifico: parsed.data.nomeCientifico,
      categoria_id: parsed.data.categoriaId,
      foto_url: resolvePhotoValue(fotoUrl, parsed.data.fotoUrl),
      explicacao: parsed.data.explicacao,
    })
    .eq("id", speciesId.data);

  if (error) {
    return {
      status: "error",
      message: getFriendlySupabaseErrorMessage(error),
      fields,
    };
  }

  revalidatePath("/admin");

  return {
    status: "success",
    message: "Especie atualizada com sucesso.",
  };
}

export async function deleteSpeciesAction(formData: FormData) {
  const parsedId = bigIntIdSchema.safeParse(formData.get("id"));

  if (!parsedId.success) {
    return;
  }

  const supabase = createAdminClient();
  await supabase.from("species").delete().eq("id", parsedId.data);
  revalidatePath("/admin");
}

export async function deleteCategoryAction(formData: FormData) {
  await deleteById("categoria", formData);
}

export async function deleteFunctionAction(formData: FormData) {
  await deleteById("funcao", formData);
  revalidatePath("/especies");
}

export async function deleteRelationTypeAction(formData: FormData) {
  await deleteById("tipo_relacao", formData);
  revalidatePath("/especies");
}

export async function deleteNutrientAction(formData: FormData) {
  await deleteById("nutriente", formData);
  revalidatePath("/solo");
}

export async function deletePhPointAction(formData: FormData) {
  await deleteById("ph_ponto", formData);
  revalidatePath("/solo");
}

export async function deleteVisualSymptomAction(formData: FormData) {
  await deleteById("sintoma_visual", formData);
  revalidatePath("/solo");
}

export async function createCategoryAction(formData: FormData) {
  await insertSimpleName("categoria", formData);
}

export async function createFunctionAction(formData: FormData) {
  await insertSimpleName("funcao", formData);
}

export async function createRelationTypeAction(formData: FormData) {
  const parsed = relationTypeSchema.safeParse({
    nome: formData.get("nome"),
    nomeReverso: formData.get("nomeReverso"),
    simetrica: formData.get("simetrica") === "on",
  });

  if (!parsed.success) {
    return;
  }

  const supabase = createAdminClient();
  await supabase.from("tipo_relacao").insert({
    nome: parsed.data.nome,
    nome_reverso: parsed.data.nomeReverso,
    simetrica: parsed.data.simetrica,
  });
  revalidatePath("/admin");
}

export async function createSpeciesFunctionAction(formData: FormData) {
  const parsed = speciesFunctionSchema.safeParse({
    speciesId: formData.get("speciesId"),
    funcaoId: formData.get("funcaoId"),
  });

  if (!parsed.success) {
    return;
  }

  const supabase = createAdminClient();
  await supabase.from("species_functions").upsert({
    species_id: parsed.data.speciesId,
    funcao_id: parsed.data.funcaoId,
  });
  revalidatePath("/admin");
}

export async function createSpeciesRelationAction(formData: FormData) {
  const parsed = speciesRelationSchema.safeParse({
    fromSpeciesId: formData.get("fromSpeciesId"),
    toSpeciesId: formData.get("toSpeciesId"),
    tipoRelacaoId: formData.get("tipoRelacaoId"),
  });

  if (!parsed.success) {
    return;
  }

  const supabase = createAdminClient();
  await supabase.from("species_relations").insert({
    from_species_id: parsed.data.fromSpeciesId,
    to_species_id: parsed.data.toSpeciesId,
    tipo_relacao_id: parsed.data.tipoRelacaoId,
  });
  revalidatePath("/admin");
}

export async function createNutrientAction(formData: FormData) {
  const parsed = nutrientSchema.safeParse({
    simbolo: formData.get("simbolo"),
    nome: formData.get("nome"),
    funcaoNaPlanta: formData.get("funcaoNaPlanta"),
    sintomasDeficiencia: formData.get("sintomasDeficiencia"),
    fontesNaturais: formData.get("fontesNaturais"),
  });

  if (!parsed.success) {
    return;
  }

  const supabase = createAdminClient();
  await supabase.from("nutriente").upsert(
    {
      simbolo: parsed.data.simbolo,
      nome: parsed.data.nome,
      funcao_na_planta: resolveOptionalText(parsed.data.funcaoNaPlanta),
      sintomas_deficiencia: resolveOptionalText(parsed.data.sintomasDeficiencia),
      fontes_naturais: resolveOptionalText(parsed.data.fontesNaturais),
    },
    { onConflict: "simbolo" }
  );
  revalidatePath("/admin");
  revalidatePath("/solo");
}

export async function createPhPointAction(formData: FormData) {
  const parsed = phPointSchema.safeParse({
    phValor: formData.get("phValor"),
    descricaoAcidez: formData.get("descricaoAcidez"),
    atividadeBiologica: formData.get("atividadeBiologica"),
    presencaAluminio: formData.get("presencaAluminio"),
  });

  if (!parsed.success) {
    return;
  }

  const supabase = createAdminClient();
  await supabase.from("ph_ponto").upsert(
    {
      ph_valor: parsed.data.phValor,
      descricao_acidez: resolveOptionalText(parsed.data.descricaoAcidez),
      atividade_biologica: resolveOptionalText(parsed.data.atividadeBiologica),
      presenca_aluminio: resolveOptionalText(parsed.data.presencaAluminio),
    },
    { onConflict: "ph_valor" }
  );
  revalidatePath("/admin");
  revalidatePath("/solo");
}

export async function createPhAvailabilityAction(formData: FormData) {
  const parsed = phAvailabilitySchema.safeParse({
    phPontoId: formData.get("phPontoId"),
    nutrienteId: formData.get("nutrienteId"),
    disponibilidadePct: formData.get("disponibilidadePct"),
    descricao: formData.get("descricao"),
  });

  if (!parsed.success) {
    return;
  }

  const supabase = createAdminClient();
  await supabase.from("ph_disponibilidade").upsert(
    {
      ph_ponto_id: parsed.data.phPontoId,
      nutriente_id: parsed.data.nutrienteId,
      disponibilidade_pct: parsed.data.disponibilidadePct,
      descricao: resolveOptionalText(parsed.data.descricao),
    },
    { onConflict: "ph_ponto_id,nutriente_id" }
  );
  revalidatePath("/admin");
  revalidatePath("/solo");
}

export async function createVisualSymptomAction(formData: FormData) {
  const parsed = visualSymptomSchema.safeParse({
    descricao: formData.get("descricao"),
    nutrienteId: formData.get("nutrienteId"),
  });

  if (!parsed.success) {
    return;
  }

  const supabase = createAdminClient();
  await supabase.from("sintoma_visual").upsert(
    {
      descricao: parsed.data.descricao,
      nutriente_id: parsed.data.nutrienteId,
    },
    { onConflict: "descricao" }
  );
  revalidatePath("/admin");
  revalidatePath("/solo");
}

async function resolveSpeciesPhotoUrl(supabase: ReturnType<typeof createAdminClient>, formData: FormData) {
  const photoFile = formData.get("fotoArquivo");

  if (!(photoFile instanceof File) || photoFile.size === 0) {
    return null;
  }

  const bucketName = "species-photos";
  const fileExtension = getFileExtension(photoFile.name, photoFile.type);
  const filePath = `${crypto.randomUUID()}-${Date.now()}${fileExtension}`;
  const fileBuffer = Buffer.from(await photoFile.arrayBuffer());

  const { error } = await supabase.storage.from(bucketName).upload(filePath, fileBuffer, {
    contentType: photoFile.type || "application/octet-stream",
    upsert: false,
  });

  if (error) {
    return new Error(
      "Não foi possível enviar a foto. Verifique se o bucket 'species-photos' existe e está público."
    );
  }

  const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);

  return data.publicUrl;
}

async function insertSimpleName(table: "categoria" | "funcao", formData: FormData) {
  const parsed = simpleNameSchema.safeParse({ nome: formData.get("nome") });

  if (!parsed.success) {
    return;
  }

  const supabase = createAdminClient();
  await supabase.from(table).insert({ nome: parsed.data.nome });
  revalidatePath("/admin");
}

async function deleteById(
  table: "categoria" | "funcao" | "tipo_relacao" | "nutriente" | "ph_ponto" | "sintoma_visual",
  formData: FormData
) {
  const parsedId = bigIntIdSchema.safeParse(formData.get("id"));

  if (!parsedId.success) {
    return;
  }

  const supabase = createAdminClient();
  await supabase.from(table).delete().eq("id", parsedId.data);
  revalidatePath("/admin");
}

function parseSpeciesFormData(formData: FormData): SpeciesFormFields {
  return {
    nomePopular: getStringFormValue(formData, "nomePopular"),
    nomeCientifico: getStringFormValue(formData, "nomeCientifico"),
    categoriaId: getStringFormValue(formData, "categoriaId"),
    fotoUrl: getStringFormValue(formData, "fotoUrl"),
    explicacao: getStringFormValue(formData, "explicacao"),
  };
}

function getStringFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function getFileExtension(fileName: string, contentType: string) {
  const extensionFromName = fileName.includes(".") ? `.${fileName.split(".").pop()}` : "";

  if (extensionFromName) {
    return extensionFromName;
  }

  if (contentType === "image/jpeg") {
    return ".jpg";
  }

  if (contentType === "image/png") {
    return ".png";
  }

  if (contentType === "image/webp") {
    return ".webp";
  }

  return "";
}

function resolvePhotoValue(uploadedPhotoUrl: string | null, typedPhotoUrl: unknown) {
  const candidate = uploadedPhotoUrl ?? (typeof typedPhotoUrl === "string" ? typedPhotoUrl.trim() : "");

  return candidate ? candidate : null;
}

function resolveOptionalText(value: string | undefined) {
  const candidate = value?.trim() ?? "";
  return candidate ? candidate : null;
}
