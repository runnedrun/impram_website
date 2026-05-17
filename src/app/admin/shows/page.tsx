import Link from "next/link";
import { requireAdminPage } from "@/lib/admin/guard";
import { getAllShowsAdmin } from "@/lib/db/queries";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Homepage</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {allShows.map((show) => (
            <TableRow key={show.slug}>
              <TableCell>{show.title}</TableCell>
              <TableCell>{show.status}</TableCell>
              <TableCell>{show.featuredOnHome ? "Yes" : "No"}</TableCell>
              <TableCell>
                <Link href={`/admin/shows/${show.slug}/`} className="text-impram-link hover:underline">
                  Edit
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
