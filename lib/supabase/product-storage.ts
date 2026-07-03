import "server-only";

import path from "node:path";
import { getServerClient } from "@/lib/supabase/server";

const DEFAULT_BUCKET = "products";

function getStorageBucket(): string {
  return process.env.SUPABASE_STORAGE_BUCKET?.trim() || DEFAULT_BUCKET;
}

function getSafeExtension(filename: string): string {
  const extension = path.extname(filename) || ".webp";
  const safe = extension.replace(/[^a-zA-Z0-9.]/g, "");
  return safe || ".webp";
}

export async function uploadProductImageToStorage(file: File): Promise<string> {
  const supabase = getServerClient();
  const bucket = getStorageBucket();
  const safeExtension = getSafeExtension(file.name);
  const objectPath = `uploads/variant-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${safeExtension}`;
  const bytes = await file.arrayBuffer();

  const { error } = await supabase.storage.from(bucket).upload(objectPath, bytes, {
    contentType: file.type || "image/webp",
    upsert: false,
  });

  if (error) {
    throw new Error(`uploadProductImageToStorage: ${error.message}`);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
  return data.publicUrl;
}
