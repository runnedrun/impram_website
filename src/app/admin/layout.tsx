import Link from "next/link";
import { getSession } from "@/lib/session";
import { AdminLogoutButton } from "@/components/admin/logout-button";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-muted/30">
      {session.isAdmin && (
        <nav className="border-b bg-background px-4 py-3">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-4 text-sm">
            <Link href="/admin/" className="font-semibold">
              Impram Admin
            </Link>
            <Link href="/admin/shows/" className="text-muted-foreground hover:text-foreground">
              Shows
            </Link>
            <Link href="/admin/members/" className="text-muted-foreground hover:text-foreground">
              Members
            </Link>
            <Link href="/admin/join-us/" className="text-muted-foreground hover:text-foreground">
              Join us
            </Link>
            <Link href="/" className="ml-auto text-impram-link hover:underline">
              View site
            </Link>
            <AdminLogoutButton />
          </div>
        </nav>
      )}
      <div className="mx-auto max-w-5xl px-4 py-8">{children}</div>
    </div>
  );
}
