import { createBrowserClient } from '@supabase/ssr'

function getPublicEnv(name: string) {
  return process.env[name]?.trim() ?? "";
}

export function createClient() {
  const supabaseUrl = getPublicEnv("NEXT_PUBLIC_SUPABASE_URL");
  const supabaseAnonKey = getPublicEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("As variaveis publicas do Supabase nao foram configuradas.");
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )
}
