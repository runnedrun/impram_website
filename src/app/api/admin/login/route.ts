import { NextResponse } from "next/server";
import { getSession, verifyAdminPassword } from "@/lib/session";

export async function POST(request: Request) {
  const { password } = (await request.json()) as { password?: string };
  if (!password || !verifyAdminPassword(password)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }
  const session = await getSession();
  session.isAdmin = true;
  await session.save();
  return NextResponse.json({ ok: true });
}
