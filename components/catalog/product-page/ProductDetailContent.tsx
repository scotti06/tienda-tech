import type { StoreProduct } from "@/lib/store/types";

const FAQ_BY_CATEGORY: Record<string, { question: string; answer: string }[]> = {
  fundas: [
    {
      question: "¿Cómo sé si la funda es compatible con mi iPhone?",
      answer:
        "Seleccioná tu modelo en el selector de compatibilidad. Si tenés dudas, consultanos por WhatsApp con el modelo exacto de tu equipo.",
    },
    {
      question: "¿La funda incluye protección para la cámara?",
      answer:
        "Depende del modelo. Revisá la descripción del producto o consultanos para confirmar el diseño disponible.",
    },
  ],
  vidrios: [
    {
      question: "¿El vidrio templado incluye instalación?",
      answer:
        "Consultá en el local si contás con asistencia para colocación. Te recomendamos instalar en un ambiente limpio y sin polvo.",
    },
    {
      question: "¿Sirve para funda con borde elevado?",
      answer:
        "La compatibilidad varía según modelo. Escribinos indicando tu iPhone y tipo de funda que usás.",
    },
  ],
  carga: [
    {
      question: "¿Es cargador original Apple?",
      answer:
        "Trabajamos con cargadores originales Apple para iPhone. Consultá disponibilidad del modelo específico.",
    },
    {
      question: "¿Incluye cable?",
      answer:
        "Revisá la descripción del producto. Algunos modelos se venden solo con adaptador de pared.",
    },
  ],
  airpods: [
    {
      question: "¿Viene con garantía?",
      answer:
        "Consultá garantía y facturación al momento de la compra. Te asesoramos según el modelo elegido.",
    },
    {
      question: "¿Puedo probarlos en el local?",
      answer:
        "Coordiná tu visita por WhatsApp para confirmar stock y demo disponible.",
    },
  ],
};

const DEFAULT_FAQ = [
  {
    question: "¿Cómo consulto disponibilidad?",
    answer:
      "Seleccioná tu modelo de iPhone, agregá al carrito o escribinos por WhatsApp para confirmar stock al instante.",
  },
  {
    question: "¿Puedo retirar en el local?",
    answer:
      "Sí. Coordiná retiro o envío según tu zona al contactarnos.",
  },
];

type ProductDetailContentProps = {
  product: StoreProduct;
};

export function ProductDetailContent({ product }: ProductDetailContentProps) {
  const faqItems = FAQ_BY_CATEGORY[product.categoryId] ?? DEFAULT_FAQ;
  const specs = [
    { label: "Marca", value: product.brand ?? "Consultar" },
    { label: "SKU", value: product.sku ?? "—" },
    { label: "Categoría", value: product.category },
    ...(product.subcategory
      ? [{ label: "Subcategoría", value: product.subcategory }]
      : []),
  ];

  return (
    <div className="mt-12 space-y-10 border-t border-white/[0.06] pt-12">
      {product.description && (
        <section aria-labelledby="product-description-heading">
          <h2
            id="product-description-heading"
            className="text-xl font-semibold tracking-tight text-white"
          >
            Descripción
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--muted)] md:text-base">
            {product.description}
          </p>
        </section>
      )}

      <section aria-labelledby="product-specs-heading">
        <h2
          id="product-specs-heading"
          className="text-xl font-semibold tracking-tight text-white"
        >
          Especificaciones
        </h2>
        <dl className="mt-4 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]">
          {specs.map((spec, index) => (
            <div
              key={spec.label}
              className={`grid grid-cols-[140px_1fr] gap-4 px-4 py-3 text-sm ${
                index > 0 ? "border-t border-white/[0.06]" : ""
              }`}
            >
              <dt className="font-medium text-[var(--muted)]">{spec.label}</dt>
              <dd className="text-white">{spec.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="product-faq-heading">
        <h2
          id="product-faq-heading"
          className="text-xl font-semibold tracking-tight text-white"
        >
          Preguntas frecuentes
        </h2>
        <div className="mt-4 space-y-3">
          {faqItems.map((item) => (
            <details
              key={item.question}
              className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3"
            >
              <summary className="cursor-pointer list-none text-sm font-medium text-white [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-3">
                  {item.question}
                  <span className="text-[var(--muted)] transition-transform group-open:rotate-45">
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
