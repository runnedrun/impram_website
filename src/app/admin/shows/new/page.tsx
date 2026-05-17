import { requireAdminPage } from "@/lib/admin/guard";
import { ShowForm } from "@/components/admin/show-form";

export default async function NewShowPage() {
  await requireAdminPage();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">New show</h1>
      <ShowForm />
    </div>
  );
}
