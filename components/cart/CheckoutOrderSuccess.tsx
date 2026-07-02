import { Button } from "@/components/ui/Button";

type CheckoutOrderSuccessProps = {
  orderNumber: string;
  description?: string;
};

export function CheckoutOrderSuccess({
  orderNumber,
  description = "Tu pedido fue registrado correctamente. Te contactaremos para coordinar el pago y la entrega.",
}: CheckoutOrderSuccessProps) {
  return (
    <main className="pb-24">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 px-6 py-12 text-center md:px-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-3xl">
            ✓
          </div>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight text-white">
            ¡Compra realizada con éxito!
          </h1>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Tu pedido{" "}
            <span className="font-semibold text-white">{orderNumber}</span>{" "}
            {description}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button href="/tienda" variant="primary" size="lg">
              Seguir comprando
            </Button>
            <Button href="/" variant="secondary" size="lg">
              Volver al inicio
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
