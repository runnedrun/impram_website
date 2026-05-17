"use client";

import { useRouter } from "next/navigation";

export function AdminLogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout/", { method: "POST" });
    router.push("/admin/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      className="text-muted-foreground hover:text-foreground"
    >
      Log out
    </button>
  );
}
