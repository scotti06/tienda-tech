import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/admin/session";
import { readStore, writeStore } from "@/lib/store/repository";

export async function GET() {
  try {
    await requireAdminSession();
    const store = await readStore();
    return NextResponse.json(store.notifications);
  } catch {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdminSession();
    const body = (await request.json()) as { id?: string; markAllRead?: boolean };
    const store = await readStore();

    if (body.markAllRead) {
      store.notifications = store.notifications.map((notification) => ({
        ...notification,
        read: true,
      }));
    } else if (body.id) {
      store.notifications = store.notifications.map((notification) =>
        notification.id === body.id
          ? { ...notification, read: true }
          : notification,
      );
    }

    await writeStore(store);
    revalidatePath("/admin");
    revalidatePath("/admin/notificaciones");

    return NextResponse.json(store.notifications);
  } catch {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
}
