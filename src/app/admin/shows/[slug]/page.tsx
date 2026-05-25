import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/admin/guard";
import { getAllMembersAdmin, getShowBySlugAdmin } from "@/lib/db/queries";
import { ShowForm } from "@/components/admin/show-form";

type Props = { params: Promise<{ slug: string }> };

export default async function EditShowPage({ params }: Props) {
  await requireAdminPage();
  const { slug } = await params;
  const [show, members] = await Promise.all([
    getShowBySlugAdmin(slug),
    getAllMembersAdmin(),
  ]);
  if (!show) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Edit: {show.title}</h1>
      <ShowForm show={show} members={members} />
    </div>
  );
}
