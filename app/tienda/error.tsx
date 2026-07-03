"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

type TiendaErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function TiendaError({ error, reset }: TiendaErrorProps) {
  useEffect(() => {
    console.error("[tienda] Error al cargar el catálogo:", error);
  }, [error]);

  return (
    <main className="min-h-[60vh] pb-20">
      <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-white/[0.08] glass-card px-6 py-10 md:px-10 md:py-12">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-[var(--brand-cyan)] uppercase">
            Tienda
          </p>
          <h1 className="mt-3 text-xl font-semibold text-white md:text-2xl">
            No pudimos cargar el catálogo
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
            Puede ser un problema temporal de conexión. Intentá de nuevo en unos
            segundos.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button type="button" variant="primary" size="md" onClick={reset}>
              Reintentar
            </Button>
            <Button href="/" variant="secondary" size="md">
              Volver al inicio
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
