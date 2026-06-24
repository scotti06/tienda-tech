import type { CartItem } from "@/lib/cart";

export type PaymentMethod = "mercadopago" | "card" | "transfer";

export type ShippingMethod = "pickup" | "standard" | "express";

export type CheckoutFormData = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  shippingNotes: string;
  shippingMethod: ShippingMethod | "";
  paymentMethod: PaymentMethod | "";
};

export const CHECKOUT_STEPS = [
  { id: 1, label: "Datos del cliente" },
  { id: 2, label: "Dirección de envío" },
  { id: 3, label: "Método de envío" },
  { id: 4, label: "Medio de pago" },
  { id: 5, label: "Confirmación" },
] as const;

export type CheckoutStepId = (typeof CHECKOUT_STEPS)[number]["id"];

export const PAYMENT_METHODS: {
  id: PaymentMethod;
  label: string;
  description: string;
}[] = [
  {
    id: "mercadopago",
    label: "Mercado Pago",
    description: "Pagá con tu cuenta o billetera de Mercado Pago.",
  },
  {
    id: "card",
    label: "Tarjetas de Crédito y Débito",
    description: "Visa, Mastercard, American Express y más.",
  },
  {
    id: "transfer",
    label: "Transferencia Bancaria",
    description: "Te enviamos los datos para transferir.",
  },
];

export const SHIPPING_METHODS: {
  id: ShippingMethod;
  label: string;
  description: string;
  baseCost: number;
}[] = [
  {
    id: "pickup",
    label: "Retiro en local",
    description: "Coordiná día y horario para retirar tu pedido.",
    baseCost: 0,
  },
  {
    id: "standard",
    label: "Envío estándar",
    description: "Entrega en 3 a 5 días hábiles.",
    baseCost: 3500,
  },
  {
    id: "express",
    label: "Envío express",
    description: "Entrega en 24 a 48 horas hábiles.",
    baseCost: 5500,
  },
];

export const FREE_SHIPPING_THRESHOLD = 80000;

export function getInitialCheckoutForm(): CheckoutFormData {
  return {
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    street: "",
    city: "",
    province: "",
    postalCode: "",
    shippingNotes: "",
    shippingMethod: "",
    paymentMethod: "",
  };
}

export function getShippingCost(
  method: ShippingMethod | "",
  subtotal: number,
): number {
  if (!method) return 0;
  if (method === "pickup") return 0;
  if (method === "standard") {
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 3500;
  }
  return 5500;
}

export function getPaymentMethodLabel(method: PaymentMethod | ""): string {
  return PAYMENT_METHODS.find((item) => item.id === method)?.label ?? "—";
}

export function getShippingMethodLabel(method: ShippingMethod | ""): string {
  return SHIPPING_METHODS.find((item) => item.id === method)?.label ?? "—";
}

export function validateCheckoutStep(
  step: CheckoutStepId,
  form: CheckoutFormData,
): string | null {
  switch (step) {
    case 1:
      if (!form.customerName.trim()) return "Ingresá tu nombre completo.";
      if (!form.customerEmail.trim()) return "Ingresá tu email.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail.trim())) {
        return "Ingresá un email válido.";
      }
      if (!form.customerPhone.trim()) return "Ingresá tu teléfono.";
      return null;
    case 2:
      if (!form.street.trim()) return "Ingresá la calle y número.";
      if (!form.city.trim()) return "Ingresá la ciudad.";
      if (!form.province.trim()) return "Ingresá la provincia.";
      if (!form.postalCode.trim()) return "Ingresá el código postal.";
      return null;
    case 3:
      if (!form.shippingMethod) return "Seleccioná un método de envío.";
      return null;
    case 4:
      if (!form.paymentMethod) return "Seleccioná un medio de pago.";
      return null;
    case 5:
      return (
        validateCheckoutStep(1, form) ??
        validateCheckoutStep(2, form) ??
        validateCheckoutStep(3, form) ??
        validateCheckoutStep(4, form)
      );
    default:
      return null;
  }
}

export type CheckoutOrderPayload = {
  items: CartItem[];
  form: CheckoutFormData;
  subtotal: number;
  shippingCost: number;
  total: number;
};

export function buildCheckoutPayload(
  items: CartItem[],
  form: CheckoutFormData,
): CheckoutOrderPayload | { error: string } {
  const validationError = validateCheckoutStep(5, form);
  if (validationError) return { error: validationError };
  if (!items.length) return { error: "El carrito está vacío." };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shippingCost = getShippingCost(form.shippingMethod, subtotal);
  const total = subtotal + shippingCost;

  return {
    items,
    form,
    subtotal,
    shippingCost,
    total,
  };
}
