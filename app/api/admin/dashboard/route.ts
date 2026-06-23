import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/session";
import { getDashboardStats } from "@/lib/store/repository";

export async function GET() {
  try {
    await requireAdminSession();
    return NextResponse.json(getDashboardStats());
  } catch {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
}
