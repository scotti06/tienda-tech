import { NextResponse } from "next/server";
import {
  buildMercadoPagoRedirectOptions,
  getMercadoPagoPreferenceClient,
  getMercadoPagoSiteUrl,
  getMpAccessTokenDebugInfo,
  serializeMercadoPagoError,
} from "@/lib/mp/server";

type PreferenceItemInput = {
  id: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
};

type CreatePreferenceBody = {
  orderNumber: string;
  total: number;
  items: PreferenceItemInput[];
  shippingCost?: number;
  payer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
};

function getBaseUrl(request: Request): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    return configured.replace(/\/$/, "");
  }

  const host = request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") ?? "http";

  if (host) {
    return `${protocol}://${host}`;
  }

  return "http://localhost:3000";
}

function toAbsoluteUrl(path: string | undefined, baseUrl: string): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

function isValidBody(body: unknown): body is CreatePreferenceBody {
  if (!body || typeof body !== "object") return false;

  const value = body as CreatePreferenceBody;

  return (
    typeof value.orderNumber === "string" &&
    value.orderNumber.trim().length > 0 &&
    typeof value.total === "number" &&
    value.total > 0 &&
    Array.isArray(value.items) &&
    value.items.length > 0 &&
    value.items.every(
      (item) =>
        typeof item.id === "string" &&
        typeof item.name === "string" &&
        typeof item.price === "number" &&
        item.price >= 0 &&
        typeof item.quantity === "number" &&
        item.quantity > 0,
    )
  );
}

export async function POST(request: Request) {
  const tokenInfo = getMpAccessTokenDebugInfo();

  try {
    if (!tokenInfo.configured) {
      console.error("[mp/create-preference] Missing MP_ACCESS_TOKEN.");
      return NextResponse.json(
        { error: "Mercado Pago no está configurado." },
        { status: 500 },
      );
    }

    console.error("[mp/create-preference] MP_ACCESS_TOKEN loaded:", tokenInfo);

    const body: unknown = await request.json();

    if (!isValidBody(body)) {
      return NextResponse.json(
        { error: "Datos de preferencia inválidos." },
        { status: 400 },
      );
    }

    const baseUrl = getBaseUrl(request);
    const siteUrl = getMercadoPagoSiteUrl();
    const preferenceItems = body.items.map((item) => ({
      id: item.id,
      title: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      currency_id: "ARS",
      picture_url: toAbsoluteUrl(item.image, baseUrl),
    }));

    const shippingCost = Number(body.shippingCost ?? 0);
    if (shippingCost > 0) {
      preferenceItems.push({
        id: "shipping",
        title: "Envío",
        quantity: 1,
        unit_price: shippingCost,
        currency_id: "ARS",
        picture_url: undefined,
      });
    }

    const itemsTotal = preferenceItems.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0,
    );

    if (Math.round(itemsTotal) !== Math.round(body.total)) {
      console.error("[mp/create-preference] Total mismatch:", {
        itemsTotal,
        total: body.total,
        orderNumber: body.orderNumber,
      });
      return NextResponse.json(
        { error: "El total del pedido no coincide con los ítems." },
        { status: 400 },
      );
    }

    const preference = getMercadoPagoPreferenceClient();

    const preferenceBody = {
      items: preferenceItems,
      external_reference: body.orderNumber,
      ...(siteUrl
        ? buildMercadoPagoRedirectOptions(body.orderNumber, siteUrl)
        : {}),
      payer: body.payer?.email
        ? {
            name: body.payer.name,
            email: body.payer.email,
            phone: body.payer.phone
              ? { number: body.payer.phone }
              : undefined,
          }
        : undefined,
    };

    console.error("[mp/create-preference] Creating preference:", {
      orderNumber: body.orderNumber,
      baseUrl,
      siteUrl,
      redirectEnabled: Boolean(siteUrl),
      itemCount: preferenceItems.length,
      total: body.total,
      payerEmail: body.payer?.email ?? null,
    });

    const response = await preference.create({
      body: preferenceBody,
    });

    if (!response.id) {
      console.error("[mp/create-preference] Preference created without id.");
      return NextResponse.json(
        { error: "No se pudo crear la preferencia de pago." },
        { status: 500 },
      );
    }

    const initPoint = response.init_point ?? response.sandbox_init_point;

    return NextResponse.json({
      preferenceId: response.id,
      initPoint,
    });
  } catch (error) {
    console.error(
      "[mp/create-preference] Mercado Pago SDK error:",
      serializeMercadoPagoError(error),
    );
    console.error("[mp/create-preference] Raw error object:", error);

    const mpMessage =
      typeof error === "object" &&
      error !== null &&
      "message" in error &&
      typeof (error as { message: unknown }).message === "string"
        ? (error as { message: string }).message
        : error instanceof Error
          ? error.message
          : "Unknown Mercado Pago error";

    return NextResponse.json(
      { error: "No se pudo crear la preferencia de pago.", detail: mpMessage },
      { status: 500 },
    );
  }
}
