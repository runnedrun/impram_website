import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/session";
import { uploadImage } from "@/lib/upload";

export async function POST(request: Request) {
  await requireAdmin();
  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }
  const url = await uploadImage(file);
  return NextResponse.json({ url });
}
