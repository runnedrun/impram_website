import { put } from "@vercel/blob";
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";

export async function uploadImage(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split(".").pop() ?? "jpg";
  const filename = `${randomUUID()}.${ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`uploads/${filename}`, buffer, {
      access: "public",
      contentType: file.type || "image/jpeg",
    });
    return blob.url;
  }

  const dir = join(process.cwd(), "public", "uploads");
  mkdirSync(dir, { recursive: true });
  const path = join(dir, filename);
  writeFileSync(path, buffer);
  return `/uploads/${filename}`;
}
