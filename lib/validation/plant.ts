import { z } from "zod";

export const plantCategorySchema = z.enum([
  "arvores",
  "arbustos",
  "palmeiras",
  "flores",
  "orquideas",
  "bromelias",
  "outras",
]);

export const createPlantSchema = z.object({
  popularName: z.string().trim().min(2, "Informe um nome popular valido."),
  scientificName: z.string().trim().min(2, "Informe um nome botanico valido."),
  category: plantCategorySchema,
  description: z
    .string()
    .trim()
    .min(10, "A descricao precisa ter pelo menos 10 caracteres.")
    .max(1000, "A descricao deve ter no maximo 1000 caracteres."),
});

export type CreatePlantInput = z.infer<typeof createPlantSchema>;