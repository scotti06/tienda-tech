import { formatPrice } from "@/lib/data";

type ProductTrustBarProps = {
  freeShipping?: boolean;
};

export function ProductTrustBar({ freeShipping }: ProductTrustBarProps) {
  const items = [
    {
      label: freeShipping ? "Envío gratis" : "Envío desde $80.000",
      detail: freeShipping ? "En este producto" : "Consultá tu zona",
    },
    {
      label: "Productos originales",
      detail: "Cargadores Apple certificados",
    },
    {
      label: "Asesoramiento",
      detail: "Te ayudamos a elegir",
    },
    {
      label: "Retiro o envío",
      detail: "Coordiná con el local",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-3 text-center"
        >
          <p className="text-xs font-semibold text-white">{item.label}</p>
          <p className="mt-1 text-[11px] leading-snug text-[var(--muted)]">
            {item.detail}
          </p>
        </div>
      ))}
    </div>
  );
}

export function ProductPaymentNote({ price }: { price: number }) {
  if (!price || price <= 0) return null;

  return (
    <p className="text-xs text-[var(--muted)]">
      Aceptamos transferencia y consultá medios de pago disponibles al finalizar
      tu compra.
    </p>
  );
}
