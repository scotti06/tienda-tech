type IconProps = { className?: string };

export function MercadoPagoIcon({ className = "h-8 w-8" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
      <rect width="48" height="48" rx="12" fill="#009EE3" />
      <path
        d="M14 28c0-4.5 3.5-8 8-8h4c4.5 0 8 3.5 8 8v2H14v-2z"
        fill="#fff"
        opacity="0.95"
      />
      <circle cx="24" cy="20" r="5" fill="#fff" />
    </svg>
  );
}

export function CardPaymentIcon({ className = "h-8 w-8" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden
    >
      <rect
        width="48"
        height="48"
        rx="12"
        fill="url(#cardGradient)"
      />
      <rect x="10" y="16" width="28" height="18" rx="3" fill="#fff" opacity="0.95" />
      <rect x="10" y="21" width="28" height="4" fill="#9D4EDD" />
      <rect x="14" y="28" width="10" height="2" rx="1" fill="#00B4D8" />
      <defs>
        <linearGradient id="cardGradient" x1="0" y1="0" x2="48" y2="48">
          <stop stopColor="#9D4EDD" />
          <stop offset="1" stopColor="#00B4D8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function TransferIcon({ className = "h-8 w-8" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
      <rect width="48" height="48" rx="12" fill="#1a2030" stroke="#00B4D8" strokeWidth="1.5" />
      <path
        d="M16 24h16M28 20l4 4-4 4M20 20l-4 4 4 4"
        stroke="#00B4D8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PaymentIcon({
  method,
  className,
}: {
  method: "mercadopago" | "card" | "transfer";
  className?: string;
}) {
  if (method === "mercadopago") return <MercadoPagoIcon className={className} />;
  if (method === "card") return <CardPaymentIcon className={className} />;
  return <TransferIcon className={className} />;
}
