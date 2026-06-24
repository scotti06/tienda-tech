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

type RouteContext = {
  params: Promise<{ id: string }>;
};

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

export async function GET(_request: Request, context: RouteContext) {
  try {
    await requireAdminSession();
    const { id } = await context.params;
    const product = readStore().products.find((item) => item.id === id);

    if (!product) {
      return NextResponse.json({ error: "Producto no encontrado." }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    await requireAdminSession();
    const { id } = await context.params;
    const body = (await request.json()) as Partial<StoreProduct>;
    const store = readStore();
    const index = store.products.findIndex((item) => item.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Producto no encontrado." }, { status: 404 });
    }

    const current = store.products[index];
    const categoryFields = resolveCategoryFields(
      body.categoryId ?? current.categoryId,
    );

    if (!categoryFields) {
      return NextResponse.json(
        { error: "Seleccioná una categoría válida." },
        { status: 400 },
      );
    }

    const name = body.name?.trim() || current.name;
    const images =
      body.images?.filter(Boolean) ??
      current.images ??
      (current.image ? [current.image] : []);
    const slug = ensureUniqueSlug(
      store,
      slugify(body.slug?.trim() || name),
      id,
    );

    const updated: StoreProduct = {
      ...current,
      ...body,
      ...categoryFields,
      id,
      name,
      slug,
      subcategory: body.subcategory?.trim() || current.subcategory,
      description: body.description?.trim() ?? current.description,
      price: Number(body.price ?? current.price),
      originalPrice:
        body.originalPrice !== undefined
          ? Number(body.originalPrice) || undefined
          : current.originalPrice,
      cashPrice:
        body.cashPrice !== undefined
          ? Number(body.cashPrice) || undefined
          : current.cashPrice,
      stock:
        body.stock !== undefined ? Number(body.stock) : current.stock ?? 0,
      sku: body.sku?.trim() || current.sku,
      brand: body.brand?.trim() || current.brand,
      images,
      image: images[0] ?? current.image,
      updatedAt: new Date().toISOString(),
    };

    store.products[index] = updated;
    writeStore(store);
    revalidateCatalogPaths();

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await requireAdminSession();
    const { id } = await context.params;
    const store = readStore();
    const nextProducts = store.products.filter((item) => item.id !== id);

    if (nextProducts.length === store.products.length) {
      return NextResponse.json({ error: "Producto no encontrado." }, { status: 404 });
    }

    store.products = nextProducts;
    writeStore(store);
    revalidateCatalogPaths();

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireAdminSession();
    const { id } = await context.params;
    const body = (await request.json()) as { action?: string; delta?: number };

    if (body.action === "duplicate") {
      const store = readStore();
      const source = store.products.find((item) => item.id === id);

      if (!source) {
        return NextResponse.json(
          { error: "Producto no encontrado." },
          { status: 404 },
        );
      }

      const newId = generateProductId(store);
      const duplicateSlug = ensureUniqueSlug(
        store,
        `${source.slug}-copia`,
      );

      const duplicate: StoreProduct = {
        ...source,
        id: newId,
        slug: duplicateSlug,
        name: `${source.name} (copia)`,
        sku: `${source.sku ?? "TS"}-COPY`,
        updatedAt: new Date().toISOString(),
      };

      store.products.unshift(duplicate);
      writeStore(store);
      revalidateCatalogPaths();
      return NextResponse.json(duplicate, { status: 201 });
    }

    if (body.action === "adjust-stock") {
      const delta = Number(body.delta);
      if (!Number.isFinite(delta) || delta === 0) {
        return NextResponse.json(
          { error: "Ajuste de stock inválido." },
          { status: 400 },
        );
      }

      const store = readStore();
      const index = store.products.findIndex((item) => item.id === id);

      if (index === -1) {
        return NextResponse.json(
          { error: "Producto no encontrado." },
          { status: 404 },
        );
      }

      const current = store.products[index];
      const nextStock = Math.max(0, (current.stock ?? 0) + delta);
      store.products[index] = {
        ...current,
        stock: nextStock,
        updatedAt: new Date().toISOString(),
      };

      writeStore(store);
      revalidateCatalogPaths();
      return NextResponse.json(store.products[index]);
    }

    return NextResponse.json({ error: "Acción no soportada." }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
}
