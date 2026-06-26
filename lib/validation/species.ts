import { z } from "zod";

export const createSpeciesSchema = z.object({
  nome_popular: z.string().trim().min(2, "Informe um nome popular valido."),
  nome_cientifico: z.string().trim().min(2, "Informe um nome cientifico valido."),
  categoria_id: z.coerce.number().int().positive("Selecione uma categoria valida."),
  foto_url: z.string().trim().url("Informe uma URL valida para a foto.").optional().or(z.literal("")),
  grupo_funcional: z
    .string()
    .trim()
    .min(10, "A grupo funcional precisa ter pelo menos 10 caracteres.")
    .max(4000, "A grupo funcional deve ter no maximo 4000 caracteres."),
  altura: z
    .string()
    .trim()
    .min(2, "A altura precisa ter pelo menos 2 caracteres.")
    .max(4000, "A altura deve ter no maximo 4000 caracteres."),
  espacamento_planta: z
    .string()
    .trim()
    .min(2, "O espacamento da planta precisa ter pelo menos 2 caracteres.")
    .max(4000, "O espacamento da planta deve ter no maximo 4000 caracteres."),
  tempo_producao: z
    .string()
    .trim()
    .min(2, "O campo 'Tempo até Produção' precisa ter pelo menos 2 caracteres.")
    .max(4000, "O campo 'Tempo até Produção' deve ter no maximo 4000 caracteres."),
  estabelecimento_planta: z
    .string()
    .trim()
    .min(2, "O campo 'Estabelecimento' precisa ter pelo menos 2 caracteres.")
    .max(4000, "O campo 'Estabelecimento' deve ter no maximo 4000 caracteres."),
  solo_planta: z
    .string()
    .trim()
    .min(2, "O campo 'Solo' precisa ter pelo menos 2 caracteres.")
    .max(4000, "O campo 'Solo' deve ter no maximo 4000 caracteres."),
  ph_planta: z
    .string()
    .trim()
    .min(2, "O campo 'Ph' precisa ter pelo menos 2 caracteres.")
    .max(4000, "O campo 'Ph' deve ter no maximo 4000 caracteres."),
  explicacao: z
    .string()
    .trim()
    .min(10, "As Características Agronômicas precisa ter pelo menos 10 caracteres.")
    .max(4000, "As Características Agronômicas   deve ter no maximo 4000 caracteres."),
  ciclagem_sistema: z
    .string()
    .trim()
    .min(10, "A Ciclagem do sistema precisa ter pelo menos 10 caracteres.")
    .max(4000, "A Ciclagem do sistema deve ter no maximo 4000 caracteres."),
  fornece_planta: z
    .string()
    .trim()
    .min(10, "O campo 'Fornece' precisa ter pelo menos 10 caracteres.")
    .max(4000, "O campo 'Fornece' deve ter no maximo 4000 caracteres."),  
  demanda_planta: z
    .string()
    .trim()
    .min(10, "A Demanda da planta precisa ter pelo menos 10 caracteres.")
    .max(4000, "A Demanda da planta deve ter no maximo 4000 caracteres."),
});

export type CreateSpeciesInput = z.infer<typeof createSpeciesSchema>;