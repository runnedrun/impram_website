"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { Member } from "@/lib/db/schema";
import { reorderMembers, sortMembersAlphabetically } from "@/lib/admin/actions";
import { SortableAdminList } from "@/components/admin/sortable-admin-list";
import { Button } from "@/components/ui/button";

export function MembersAdminList({ members }: { members: Member[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleSortAlphabetically() {
    startTransition(async () => {
      await sortMembersAlphabetically();
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleSortAlphabetically}
          disabled={pending || members.length === 0}
        >
          {pending ? "Sorting…" : "Sort A–Z by first name"}
        </Button>
      </div>
      <SortableAdminList
        items={members.map((member) => ({
          slug: member.slug,
          primary: member.name,
          secondary: member.role,
          editHref: `/admin/members/${member.slug}/`,
        }))}
        onReorder={reorderMembers}
      />
    </div>
  );
}
