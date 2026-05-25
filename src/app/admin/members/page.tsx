import Link from "next/link";
import { requireAdminPage } from "@/lib/admin/guard";
import { getAllMembersAdmin } from "@/lib/db/queries";
import { MembersAdminList } from "@/components/admin/members-admin-list";
import { buttonVariants } from "@/components/ui/button";

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
      <MembersAdminList members={allMembers} />
    </div>
  );
}
