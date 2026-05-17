import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export async function requireAdminPage() {
  const session = await getSession();
  if (!session.isAdmin) {
    redirect("/admin/");
  }
}
