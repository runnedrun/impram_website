"use client";

import type { Member } from "@/lib/db/schema";
import { reorderMembers } from "@/lib/admin/actions";
import { SortableAdminList } from "@/components/admin/sortable-admin-list";

export function MembersAdminList({ members }: { members: Member[] }) {
  return (
    <SortableAdminList
      items={members.map((member) => ({
        slug: member.slug,
        primary: member.name,
        secondary: member.role,
        editHref: `/admin/members/${member.slug}/`,
      }))}
      onReorder={reorderMembers}
    />
  );
}
