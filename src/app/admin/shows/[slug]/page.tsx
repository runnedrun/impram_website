import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/admin/guard";
import { getAllMembersAdmin, getShowBySlugAdmin } from "@/lib/db/queries";
import { ShowForm } from "@/components/admin/show-form";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ saved?: string }>;
};

export default async function EditShowPage({ params, searchParams }: Props) {
  await requireAdminPage();
  const { slug } = await params;
  const { saved } = await searchParams;
  const [show, members] = await Promise.all([
    getShowBySlugAdmin(slug),
    getAllMembersAdmin(),
  ]);
  if (!show) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Edit: {show.title}</h1>
      <ShowForm show={show} members={members} saved={saved === "1"} />
    </div>
  );
}
