"use client";

import Image from "next/image";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  name?: string;
  value: string;
  onChange: (url: string) => void;
  hiddenName?: string;
  hiddenValue?: string;
  previewClassName?: string;
  aspectClassName?: string;
};

export function ImageUploadField({
  label,
  name,
  value,
  onChange,
  hiddenName,
  hiddenValue,
  previewClassName,
  aspectClassName = "aspect-video",
}: Props) {
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload/", {
        method: "POST",
        body: fd,
        credentials: "same-origin",
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = (await res.json()) as { url?: string };
      if (!data.url) throw new Error("Upload failed");
      onChange(data.url);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      {value ? (
        <div
          className={cn(
            "relative w-full max-w-md overflow-hidden rounded-lg border border-border bg-muted",
            aspectClassName,
            previewClassName,
          )}
        >
          <Image
            src={value}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
            unoptimized={value.startsWith("data:")}
          />
        </div>
      ) : (
        <div
          className={cn(
            "flex w-full max-w-md items-center justify-center rounded-lg border border-dashed border-border bg-muted/50 text-sm text-muted-foreground",
            aspectClassName,
          )}
        >
          No image yet
        </div>
      )}
      <Input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
      />
      {uploading && (
        <p className="text-sm text-muted-foreground">Uploading…</p>
      )}
      {name && <input type="hidden" name={name} value={value} readOnly />}
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Image URL"
      />
      {hiddenName && (
        <input type="hidden" name={hiddenName} value={hiddenValue ?? value} readOnly />
      )}
    </div>
  );
}
