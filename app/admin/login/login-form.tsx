"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    let supabase: ReturnType<typeof createClient>;

    try {
      supabase = createClient();
    } catch {
      setIsLoading(false);
      setErrorMessage("Supabase nao esta configurado no ambiente de deploy.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      setErrorMessage("Nao foi possivel entrar. Verifique e-mail e senha.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-[30px] border border-white/10 bg-white/95 p-6 text-[#132117] shadow-[0_30px_80px_rgba(0,0,0,0.3)] backdrop-blur"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#70816f]">
          Entrar no painel
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-[#1c2e24]">
          Login do administrador
        </h2>
        <p className="mt-2 text-sm leading-7 text-[#5b6960]">
          Use sua conta autorizada para acessar o gerenciamento das plantas.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        <label className="block space-y-1 text-sm text-[#415046]">
          <span>E-mail</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="w-full rounded-2xl border border-[#d8e0d2] bg-[#f8faf5] px-4 py-3 outline-none transition focus:border-[#95af74] focus:ring-2 focus:ring-[#cfe0b8]"
            placeholder="admin@empresa.com"
          />
        </label>

        <label className="block space-y-1 text-sm text-[#415046]">
          <span>Senha</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="w-full rounded-2xl border border-[#d8e0d2] bg-[#f8faf5] px-4 py-3 outline-none transition focus:border-[#95af74] focus:ring-2 focus:ring-[#cfe0b8]"
            placeholder="Digite sua senha"
          />
        </label>
      </div>

      {errorMessage ? (
        <p className="mt-4 rounded-2xl bg-rose-100 px-4 py-3 text-sm text-rose-900">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isLoading}
        className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#1f3327] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#16261d] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Entrando..." : "Acessar painel"}
      </button>

      <p className="mt-4 text-center text-xs leading-6 text-[#70816f]">
        Acesso destinado apenas à equipe administrativa.
      </p>
    </form>
  );
}
