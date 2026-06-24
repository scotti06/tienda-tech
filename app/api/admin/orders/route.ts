import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/session";
import { readStore } from "@/lib/store/repository";

export async function GET() {
  try {
    await requireAdminSession();
    const store = readStore();
    return NextResponse.json(store.orders);
  } catch {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
}
