import { requireAdminPage } from "@/lib/admin/guard";
import { getAllMembersAdmin } from "@/lib/db/queries";
import { ShowForm } from "@/components/admin/show-form";

export default async function NewShowPage() {
  await requireAdminPage();
  const members = await getAllMembersAdmin();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">New show</h1>
      <ShowForm members={members} />
    </div>
  );
}
