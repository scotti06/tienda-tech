import "server-only";

import fs from "node:fs/promises";
import path from "node:path";
import { getServerClient } from "@/lib/supabase/server";

const DEFAULT_BUCKET = "products";

function getStorageBucket(): string {
  return process.env.SUPABASE_STORAGE_BUCKET?.trim() || DEFAULT_BUCKET;
}

function getSafeExtension(filename: string, mimeType?: string): string {
  const fromName = path.extname(filename).toLowerCase();
  if (/^\.(png|jpe?g|webp|gif)$/.test(fromName)) {
    return fromName;
  }

  if (mimeType === "image/png") return ".png";
  if (mimeType === "image/jpeg") return ".jpg";
  if (mimeType === "image/webp") return ".webp";
  if (mimeType === "image/gif") return ".gif";

  return ".png";
}

function isSupabaseNetworkError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return (
    message.includes("fetch failed") ||
    message.includes("network") ||
    message.includes("econnrefused") ||
    message.includes("enotfound")
  );
}

async function uploadProductImageToLocalPublic(file: File): Promise<string> {
  const safeExtension = getSafeExtension(file.name, file.type);
  const filename = `variant-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${safeExtension}`;
  const uploadsDir = path.join(process.cwd(), "public", "uploads", "variants");
  await fs.mkdir(uploadsDir, { recursive: true });

  const bytes = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(uploadsDir, filename), bytes);

  return `/uploads/variants/${filename}`;
}

async function uploadProductImageToSupabase(file: File): Promise<string> {
  const supabase = getServerClient();
  const bucket = getStorageBucket();
  const safeExtension = getSafeExtension(file.name, file.type);
  const objectPath = `uploads/variant-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${safeExtension}`;
  const bytes = await file.arrayBuffer();
  const contentType = file.type || "image/png";

  const { error } = await supabase.storage.from(bucket).upload(objectPath, bytes, {
    contentType,
    upsert: false,
  });

  if (error) {
    const message = error.message.toLowerCase();

    if (
      message.includes("bucket not found") ||
      message.includes("does not exist")
    ) {
      throw new Error(
        "El bucket de Supabase Storage «products» no existe. Ejecutá la migración 006_storage_products_bucket.sql en Supabase.",
      );
    }

    throw new Error(`uploadProductImageToStorage: ${error.message}`);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
  return data.publicUrl;
}

export async function uploadProductImageToStorage(file: File): Promise<string> {
  if (process.env.LOCAL_UPLOADS === "true") {
    return uploadProductImageToLocalPublic(file);
  }

  try {
    return await uploadProductImageToSupabase(file);
  } catch (error) {
    // In production never fall back to local disk — those files won't exist on Vercel.
    if (process.env.NODE_ENV === "development") {
      if (
        isSupabaseNetworkError(error) ||
        (error instanceof Error &&
          error.message.includes("bucket de Supabase Storage"))
      ) {
        console.warn(
          "[uploadProductImageToStorage] Supabase unavailable, saving locally:",
          error instanceof Error ? error.message : error,
        );
        return uploadProductImageToLocalPublic(file);
      }
    }

    throw error;
  }
}
