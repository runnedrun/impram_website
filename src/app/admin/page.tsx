import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getAllMembersAdmin, getAllShowsAdmin } from "@/lib/db/queries";
import { getSession } from "@/lib/session";
import { AdminLoginForm } from "@/components/admin/login-form";

export default async function AdminPage() {
  const session = await getSession();
  if (!session.isAdmin) {
    return <AdminLoginForm />;
  }

  const [allShows, allMembers] = await Promise.all([
    getAllShowsAdmin(),
    getAllMembersAdmin(),
  ]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Shows</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-3xl font-bold">{allShows.length}</p>
            <div className="flex gap-2">
              <Link href="/admin/shows/" className={buttonVariants()}>
                Manage
              </Link>
              <Link
                href="/admin/shows/new/"
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                Add show
              </Link>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Members</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-3xl font-bold">{allMembers.length}</p>
            <div className="flex gap-2">
              <Link href="/admin/members/" className={buttonVariants()}>
                Manage
              </Link>
              <Link
                href="/admin/members/new/"
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                Add member
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
