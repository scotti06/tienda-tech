import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/admin/session";
import { getStoreProductById } from "@/lib/store/repository";
import { isFundasProduct } from "@/lib/store/fundas-product";
import { isSiliconeCaseProduct } from "@/lib/store/silicone-case-product";
import {
  adjustProductModelStock,
  getProductModels,
  getProductModelsWithVariants,
  syncProductModels,
  type ProductModelInput,
} from "@/lib/store/product-models";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function revalidateProductPaths() {
  revalidatePath("/producto/[slug]", "page");
  revalidatePath("/tienda");
  revalidatePath("/fundas");
  revalidatePath("/fundas-magsafe");
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    await requireAdminSession();
    const { id } = await context.params;
    const product = await getStoreProductById(id);

    if (!product) {
      return NextResponse.json({ error: "Producto no encontrado." }, { status: 404 });
    }

    if (!isFundasProduct(product)) {
      return NextResponse.json({ models: [] });
    }

    const models = isSiliconeCaseProduct(product)
      ? await getProductModelsWithVariants(id)
      : await getProductModels(id);
    return NextResponse.json({ models });
  } catch {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    await requireAdminSession();
    const { id } = await context.params;
    const product = await getStoreProductById(id);

    if (!product) {
      return NextResponse.json({ error: "Producto no encontrado." }, { status: 404 });
    }

    if (!isFundasProduct(product)) {
      return NextResponse.json(
        { error: "Este producto no admite modelos de iPhone." },
        { status: 400 },
      );
    }

    const body = (await request.json()) as {
      models?: ProductModelInput[];
      syncVariantsPerModel?: boolean;
    };
    const result = await syncProductModels(id, body.models ?? [], {
      syncVariantsPerModel:
        body.syncVariantsPerModel ?? isSiliconeCaseProduct(product),
    });
    revalidateProductPaths();

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudieron guardar los modelos.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireAdminSession();
    const { id } = await context.params;
    const product = await getStoreProductById(id);

    if (!product) {
      return NextResponse.json({ error: "Producto no encontrado." }, { status: 404 });
    }

    if (!isFundasProduct(product)) {
      return NextResponse.json(
        { error: "Este producto no admite modelos de iPhone." },
        { status: 400 },
      );
    }

    const body = (await request.json()) as {
      action?: string;
      modelId?: string;
      delta?: number;
    };

    if (body.action !== "adjust-stock" || !body.modelId) {
      return NextResponse.json({ error: "Acción no soportada." }, { status: 400 });
    }

    const delta = Number(body.delta);
    if (!Number.isFinite(delta) || delta === 0) {
      return NextResponse.json(
        { error: "Ajuste de stock inválido." },
        { status: 400 },
      );
    }

    const result = await adjustProductModelStock(id, body.modelId, delta);
    revalidateProductPaths();

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo ajustar el stock del modelo.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
