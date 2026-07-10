"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

type VariantImageUploadProps = {
  image?: string | null;
  colorHex: string;
  onChange: (image: string | null) => void;
  compact?: boolean;
};

export function VariantImageUpload({
  image,
  colorHex,
  onChange,
  compact = false,
}: VariantImageUploadProps) {
  const inputId = useId();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const body = new FormData();
    body.append("file", file);

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body,
    });

    setUploading(false);
    event.target.value = "";

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      setError(data.error ?? "No se pudo subir la imagen.");
      return;
    }

    const data = (await response.json()) as { url: string };
    onChange(data.url);
  }

  const previewSize = compact ? "h-12 w-12" : "h-16 w-16";

  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      <div className="flex items-center gap-3">
        <div className="relative flex items-center gap-2">
          <span
            aria-hidden
            className={`${previewSize} shrink-0 rounded-full border-2 border-white/20`}
            style={{ backgroundColor: colorHex }}
          />
          {image ? (
            <div
              className={`relative ${previewSize} shrink-0 overflow-hidden rounded-xl border border-white/[0.12] bg-[#111118]`}
            >
              <Image
                src={image}
                alt=""
                fill
                className="object-contain p-1"
                sizes="64px"
              />
            </div>
          ) : (
            <div
              className={`${previewSize} flex shrink-0 items-center justify-center rounded-xl border border-dashed border-white/[0.12] bg-[#111118] text-[10px] text-[var(--muted)]`}
            >
              Sin foto
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <label
            htmlFor={inputId}
            className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-white/[0.12] px-3 py-2 text-xs font-medium text-white hover:bg-white/[0.05]"
          >
            {uploading ? "Subiendo..." : image ? "Reemplazar" : "Subir foto"}
            <input
              id={inputId}
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={handleUpload}
            />
          </label>
          {image && (
            <Button
              type="button"
              variant="ghost"
              size="compact"
              onClick={() => onChange(null)}
            >
              Quitar
            </Button>
          )}
        </div>
      </div>
      {error && <p className="text-xs text-red-200">{error}</p>}
    </div>
  );
}
