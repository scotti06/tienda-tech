import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { requireAdminSession } from "@/lib/admin/session";

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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const extension = path.extname(file.name) || ".webp";
    const safeExtension = extension.replace(/[^a-zA-Z0-9.]/g, "") || ".webp";
    const filename = `upload-${Date.now()}${safeExtension}`;
    const uploadDir = path.join(process.cwd(), "public", "products", "uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({ url: `/products/uploads/${filename}` });
  } catch {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
}
