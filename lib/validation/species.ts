import { z } from "zod";

export const createSpeciesSchema = z.object({
  nomePopular: z.string().trim().min(2, "Informe um nome popular valido."),
  nomeCientifico: z.string().trim().min(2, "Informe um nome cientifico valido."),
  categoriaId: z.coerce.number().int().positive("Selecione uma categoria valida."),
  fotoUrl: z.string().trim().url("Informe uma URL valida para a foto.").optional().or(z.literal("")),
  explicacao: z
    .string()
    .trim()
    .min(10, "A explicacao precisa ter pelo menos 10 caracteres.")
    .max(4000, "A explicacao deve ter no maximo 4000 caracteres."),
});

export type CreateSpeciesInput = z.infer<typeof createSpeciesSchema>;