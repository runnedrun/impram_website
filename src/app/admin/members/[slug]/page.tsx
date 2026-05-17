import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/admin/guard";
import { getMemberBySlugAdmin } from "@/lib/db/queries";
import { MemberForm } from "@/components/admin/member-form";

type Props = { params: Promise<{ slug: string }> };

export default async function EditMemberPage({ params }: Props) {
  await requireAdminPage();
  const { slug } = await params;
  const member = await getMemberBySlugAdmin(slug);
  if (!member) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Edit: {member.name}</h1>
      <MemberForm member={member} />
    </div>
  );
}
