import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

function getPublicEnv(name: string) {
  return process.env[name]?.trim() ?? "";
}

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    getPublicEnv("NEXT_PUBLIC_SUPABASE_URL"),
    getPublicEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
