import { createBrowserClient } from '@supabase/ssr'

function getPublicEnv(name: string) {
  return process.env[name]?.trim() ?? "";
}

export function createClient() {
  return createBrowserClient(
    getPublicEnv("NEXT_PUBLIC_SUPABASE_URL"),
    getPublicEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  )
}
