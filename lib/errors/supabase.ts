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
    return "A tabela necessária não foi encontrada no Supabase. Execute o schema/migration do projeto e tente novamente.";
  }

  return supabaseError?.message ? `Não foi possível concluir a operação: ${supabaseError.message}` : "Ocorreu um erro inesperado. Tente novamente.";
}