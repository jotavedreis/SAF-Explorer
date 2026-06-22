"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={
        className ??
        "w-full cursor-pointer bg-[#12251a] px-4 py-2 text-sm font-semibold text-[#f3f1e8] transition hover:bg-[#223a2a] sm:w-auto"
      }
    >
      Sair
    </button>
  );
}
