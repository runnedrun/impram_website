"use client";

import type { Show } from "@/lib/db/schema";
import { reorderShows } from "@/lib/admin/actions";
import { SortableAdminList } from "@/components/admin/sortable-admin-list";

export function ShowsAdminList({ shows }: { shows: Show[] }) {
  return (
    <SortableAdminList
      items={shows.map((show) => ({
        slug: show.slug,
        primary: show.title,
        secondary: show.status === "current" ? "Currently playing" : "Previous",
        tertiary: show.featuredOnHome ? "On homepage" : undefined,
        editHref: `/admin/shows/${show.slug}/`,
      }))}
      onReorder={reorderShows}
    />
  );
}
