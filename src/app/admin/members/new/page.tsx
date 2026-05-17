import { requireAdminPage } from "@/lib/admin/guard";
import { MemberForm } from "@/components/admin/member-form";

export default async function NewMemberPage() {
  await requireAdminPage();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">New member</h1>
      <MemberForm />
    </div>
  );
}
