import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/admin/guard";
import { getShowBySlugAdmin } from "@/lib/db/queries";
import { ShowForm } from "@/components/admin/show-form";

type Props = { params: Promise<{ slug: string }> };

export default async function EditShowPage({ params }: Props) {
  await requireAdminPage();
  const { slug } = await params;
  const show = await getShowBySlugAdmin(slug);
  if (!show) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Edit: {show.title}</h1>
      <ShowForm show={show} />
    </div>
  );
}
