import { z } from "zod";
import { bigIntIdSchema } from "./base";

const relationTypeOptions = [
  "Competição Catiônica",
  "Competição Aniônica",
  "Precipitação Química",
  "Inibição por pH",
  "Formação de Complexos",
  "Outro",
] as const;

const relationTypeSchema = z.enum(relationTypeOptions);

const mechanismOptions = [
  "Competição por sítios de absorção",
  "Formação de precipitados insolúveis",
  "Alteração da carga superficial",
  "Modificação da solubilidade",
  "Interferência na translocação",
  "Outro mecanismo",
] as const;

const mechanismSchema = z.enum(mechanismOptions);

export const createInteractionSchema = z.object({
  sourceNutrientId: bigIntIdSchema,
  targetNutrientIds: z
    .array(bigIntIdSchema)
    .min(1, "Selecione pelo menos um nutriente alvo.")
    .refine((targetIds) => new Set(targetIds).size === targetIds.length, "Não selecione o mesmo nutriente mais de uma vez."),
  relationType: relationTypeSchema,
  mechanism: mechanismSchema,
  description: z
    .string()
    .trim()
    .min(10, "A descrição precisa ter pelo menos 10 caracteres.")
    .max(2000, "A descrição deve ter no máximo 2000 caracteres.")
    .optional()
    .or(z.literal("")),
}).superRefine((value, context) => {
  if (value.targetNutrientIds.includes(value.sourceNutrientId)) {
    context.addIssue({
      code: "custom",
      path: ["targetNutrientIds"],
      message: "O nutriente em excesso não pode bloquear a si próprio.",
    });
  }
});

export type CreateInteractionInput = z.infer<typeof createInteractionSchema>;
