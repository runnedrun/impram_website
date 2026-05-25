import Link from "next/link";
import { requireAdminPage } from "@/lib/admin/guard";
import { getAllShowsAdmin } from "@/lib/db/queries";
import { ShowsAdminList } from "@/components/admin/shows-admin-list";
import { buttonVariants } from "@/components/ui/button";

export default async function AdminShowsPage() {
  await requireAdminPage();
  const allShows = await getAllShowsAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Shows</h1>
        <Link href="/admin/shows/new/" className={buttonVariants()}>
          New show
        </Link>
      </div>
      <ShowsAdminList shows={allShows} />
    </div>
  );
}
