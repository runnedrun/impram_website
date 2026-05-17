import Link from "next/link";
import { requireAdminPage } from "@/lib/admin/guard";
import { getAllMembersAdmin } from "@/lib/db/queries";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AdminMembersPage() {
  await requireAdminPage();
  const allMembers = await getAllMembersAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Members</h1>
        <Link href="/admin/members/new/" className={buttonVariants()}>
          New member
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {allMembers.map((member) => (
            <TableRow key={member.slug}>
              <TableCell>{member.name}</TableCell>
              <TableCell>{member.slug}</TableCell>
              <TableCell>
                <Link
                  href={`/admin/members/${member.slug}/`}
                  className="text-impram-link hover:underline"
                >
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
