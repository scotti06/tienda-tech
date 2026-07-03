import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/admin/session";
import { getStoreProductById } from "@/lib/store/repository";
import {
  getProductVariants,
  syncProductVariants,
  type ProductVariantInput,
} from "@/lib/store/product-variants";
import { isSiliconeCaseProduct } from "@/lib/store/silicone-case-product";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function revalidateProductPaths() {
  revalidatePath("/producto/[slug]", "page");
  revalidatePath("/tienda");
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    await requireAdminSession();
    const { id } = await context.params;
    const product = await getStoreProductById(id);

    if (!product) {
      return NextResponse.json({ error: "Producto no encontrado." }, { status: 404 });
    }

    if (!isSiliconeCaseProduct(product)) {
      return NextResponse.json({ variants: [] });
    }

    const variants = await getProductVariants(id);
    return NextResponse.json({ variants });
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

    if (!isSiliconeCaseProduct(product)) {
      return NextResponse.json(
        { error: "Este producto no admite variantes de color." },
        { status: 400 },
      );
    }

    const body = (await request.json()) as { variants?: ProductVariantInput[] };
    const variants = await syncProductVariants(id, body.variants ?? []);
    revalidateProductPaths();

    return NextResponse.json({ variants });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudieron guardar las variantes.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
