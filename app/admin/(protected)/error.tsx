"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

type AdminErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AdminProtectedError({ error, reset }: AdminErrorProps) {
  const isConnectionError =
    error.message.includes("fetch failed") ||
    error.message.includes("no se pudo conectar con Supabase");

  useEffect(() => {
    console.error("[admin]", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg items-center px-4 py-12">
      <div className="w-full rounded-3xl border border-red-500/20 bg-red-500/5 p-8">
        <p className="text-[11px] font-semibold tracking-[0.24em] text-red-200 uppercase">
          Modo Anfitrión
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-white">
          {isConnectionError
            ? "Sin conexión a Supabase"
            : "No se pudo cargar el panel"}
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {isConnectionError
            ? "La tienda no puede leer la base de datos en este momento. Esto no está relacionado con las imágenes del producto."
            : "Ocurrió un error inesperado al cargar esta sección."}
        </p>

        {isConnectionError && (
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-white/90">
            <li>Verificá tu conexión a internet.</li>
            <li>
              Entrá a{" "}
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--brand-cyan)] underline-offset-2 hover:underline"
              >
                supabase.com/dashboard
              </a>{" "}
              y confirmá que el proyecto esté activo (no pausado).
            </li>
            <li>
              Reiniciá el servidor local: detené <code>npm run dev</code> y
              volvelo a ejecutar.
            </li>
            <li>
              Revisá que <code>.env.local</code> tenga{" "}
              <code>NEXT_PUBLIC_SUPABASE_URL</code> y{" "}
              <code>SUPABASE_SERVICE_ROLE_KEY</code>.
            </li>
          </ol>
        )}

        <p className="mt-4 rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3 text-xs text-red-100/90">
          {error.message}
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button type="button" variant="primary" size="lg" onClick={reset}>
            Reintentar
          </Button>
          <Button href="/admin/productos" variant="secondary" size="lg">
            Volver a productos
          </Button>
        </div>
      </div>
    </div>
  );
}
