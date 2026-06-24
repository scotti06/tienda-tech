import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/admin/session";
import { categoryCatalog } from "@/lib/catalog";
import {
  ensureUniqueSlug,
  generateProductId,
  readStore,
  slugify,
  writeStore,
} from "@/lib/store/repository";
import type { StoreProduct } from "@/lib/store/types";

function revalidateCatalogPaths() {
  revalidatePath("/");
  revalidatePath("/tienda");
  revalidatePath("/carrito");
  revalidatePath("/fundas");
  revalidatePath("/templados");
  revalidatePath("/cargadores");
  revalidatePath("/airpods");
  revalidatePath("/producto/[slug]", "page");
}

function resolveCategoryFields(categoryId: string) {
  const category = categoryCatalog.find((item) => item.id === categoryId);
  if (!category) return null;
  return {
    categoryId: category.id,
    category: category.productCategory,
  };
}

export async function GET() {
  try {
    await requireAdminSession();
    const store = readStore();
    return NextResponse.json(store.products);
  } catch {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdminSession();
    const body = (await request.json()) as Partial<StoreProduct>;
    const store = readStore();

    const categoryFields = resolveCategoryFields(body.categoryId ?? "");
    if (!categoryFields) {
      return NextResponse.json(
        { error: "Seleccioná una categoría válida." },
        { status: 400 },
      );
    }

    const name = body.name?.trim();
    if (!name) {
      return NextResponse.json(
        { error: "El nombre es obligatorio." },
        { status: 400 },
      );
    }

    const images =
      body.images?.filter(Boolean) ??
      (body.image ? [body.image] : ["/products/funda-iphone.webp"]);
    const baseSlug = slugify(body.slug?.trim() || name);
    const id = generateProductId(store);
    const now = new Date().toISOString();

    const product: StoreProduct = {
      id,
      slug: ensureUniqueSlug(store, baseSlug),
      name,
      ...categoryFields,
      subcategory: body.subcategory?.trim() || categoryFields.category,
      description: body.description?.trim() || "",
      price: Number(body.price) || 0,
      originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
      cashPrice: body.cashPrice ? Number(body.cashPrice) : undefined,
      stock: Number.isFinite(Number(body.stock)) ? Number(body.stock) : 0,
      sku: body.sku?.trim() || `TS-${id.padStart(4, "0")}`,
      brand: body.brand?.trim() || "Techstylebv",
      badge: body.badge?.trim() || undefined,
      accent:
        body.accent ||
        "bg-[radial-gradient(ellipse_at_50%_0%,#1a2e28_0%,#0a0c10_70%)]",
      image: images[0],
      images,
      imageFrame: body.imageFrame ?? { width: 300, height: 300 },
      imageFrameFill: body.imageFrameFill,
      rating: body.rating ?? 0,
      freeShipping: Boolean(body.freeShipping),
      installments: body.installments?.trim() || undefined,
      updatedAt: now,
    };

    store.products.unshift(product);
    writeStore(store);
    revalidateCatalogPaths();

    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
}
