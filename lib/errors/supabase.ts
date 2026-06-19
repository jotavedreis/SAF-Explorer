type SupabaseLikeError = {
  code?: string;
  message?: string;
};

export function getFriendlySupabaseErrorMessage(error: unknown) {
  const supabaseError = error as SupabaseLikeError | null;

  if (supabaseError?.code === "23503") {
    return "Não foi possível concluir a operação porque este registro já está sendo usado em outro lugar.";
  }

  if (supabaseError?.code === "23505") {
    return "Ja existe um registro com estes dados. Revise e tente novamente.";
  }

  if (supabaseError?.code === "42P01") {
    return "Tabela species nao encontrada. Crie a tabela 'species' no Supabase para ativar o cadastro.";
  }

  return "Ocorreu um erro inesperado. Tente novamente.";
}