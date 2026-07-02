import "server-only";

import { MercadoPagoConfig, Preference } from "mercadopago";

let preferenceClient: Preference | undefined;

/** Safe token metadata for logs — never log the full secret. */
export function getMpAccessTokenDebugInfo() {
  const accessToken = process.env.MP_ACCESS_TOKEN?.trim();

  if (!accessToken) {
    return {
      configured: false as const,
      length: 0,
      prefix: null,
      suffix: null,
    };
  }

  return {
    configured: true as const,
    length: accessToken.length,
    prefix: accessToken.slice(0, 8),
    suffix: accessToken.slice(-6),
    isTestToken: accessToken.startsWith("TEST-"),
    isProdToken: accessToken.startsWith("APP_USR-"),
  };
}

/** Mercado Pago SDK throws parsed API JSON bodies, not Error instances. */
export function serializeMercadoPagoError(error: unknown): string {
  if (error instanceof Error) {
    return JSON.stringify(
      {
        type: "Error",
        name: error.name,
        message: error.message,
        stack: error.stack,
        cause: error.cause,
      },
      null,
      2,
    );
  }

  if (typeof error === "object" && error !== null) {
    const record = error as Record<string, unknown>;
    return JSON.stringify(
      {
        type: "MercadoPagoApiError",
        status: record.status ?? record.api_response,
        message: record.message,
        error: record.error,
        cause: record.cause,
        errors: record.errors,
        raw: record,
      },
      null,
      2,
    );
  }

  return String(error);
}

/** Production site URL for MP back_urls — only when explicitly configured with HTTPS. */
export function getMercadoPagoSiteUrl(): string | null {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configured?.startsWith("https://")) {
    return null;
  }
  return configured.replace(/\/$/, "");
}

export function buildMercadoPagoRedirectOptions(orderNumber: string, siteUrl: string) {
  const successUrl = `${siteUrl}/carrito/success?order_number=${encodeURIComponent(orderNumber)}`;

  return {
    back_urls: {
      success: successUrl,
      failure: `${siteUrl}/carrito/checkout`,
      pending: `${siteUrl}/carrito/checkout`,
    },
    auto_return: "approved" as const,
  };
}

export function getMercadoPagoPreferenceClient(): Preference {
  const accessToken = process.env.MP_ACCESS_TOKEN?.trim();

  if (!accessToken) {
    throw new Error("Missing MP_ACCESS_TOKEN.");
  }

  if (!preferenceClient) {
    const client = new MercadoPagoConfig({ accessToken });
    preferenceClient = new Preference(client);
  }

  return preferenceClient;
}
