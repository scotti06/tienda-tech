"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    setLoading(false);

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "No se pudo iniciar sesión.");
      return;
    }

    const next = searchParams.get("next") || "/admin";
    router.push(next);
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center px-4 py-12">
      <div className="w-full rounded-3xl border border-white/[0.08] bg-white/[0.03] p-8">
        <p className="text-[11px] font-semibold tracking-[0.24em] text-[var(--brand-cyan)] uppercase">
          Modo Anfitrión
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white">
          Panel administrativo
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Ingresá con tu usuario y contraseña para gestionar la tienda.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-white">Usuario</span>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-xl border border-white/[0.12] bg-[#111118] px-4 py-3 text-sm text-white outline-none focus:border-[var(--brand-cyan)]"
              autoComplete="username"
              required
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-white">Contraseña</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-white/[0.12] bg-[#111118] px-4 py-3 text-sm text-white outline-none focus:border-[var(--brand-cyan)]"
              autoComplete="current-password"
              required
            />
          </label>

          {error && (
            <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Ingresar al panel"}
          </Button>
        </form>
      </div>
    </div>
  );
}
