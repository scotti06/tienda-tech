import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/admin/session";
import { readStore, writeStore } from "@/lib/store/repository";
import type { OrderStatus } from "@/lib/store/types";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const validStatuses: OrderStatus[] = [
  "pendiente",
  "preparando",
  "enviado",
  "entregado",
];

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireAdminSession();
    const { id } = await context.params;
    const body = (await request.json()) as { status?: OrderStatus };
    const store = readStore();
    const index = store.orders.findIndex((order) => order.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Pedido no encontrado." }, { status: 404 });
    }

    if (!body.status || !validStatuses.includes(body.status)) {
      return NextResponse.json({ error: "Estado inválido." }, { status: 400 });
    }

    store.orders[index] = {
      ...store.orders[index],
      status: body.status,
    };

    writeStore(store);
    revalidatePath("/admin");
    revalidatePath("/admin/pedidos");

    return NextResponse.json(store.orders[index]);
  } catch {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
}
