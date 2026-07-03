import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/session";
import { uploadProductImageToStorage } from "@/lib/supabase/product-storage";

export async function POST(request: Request) {
  try {
    await requireAdminSession();
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No se recibió ninguna imagen." },
        { status: 400 },
      );
    }

    const url = await uploadProductImageToStorage(file);
    return NextResponse.json({ url });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }
    const message =
      error instanceof Error ? error.message : "No se pudo subir la imagen.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
