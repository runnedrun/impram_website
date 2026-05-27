"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Member } from "@/lib/db/schema";
import type { ShowCastCredit } from "@/lib/show-content";
import { dedupeCastCredits } from "@/lib/show-content";

export function ShowCastPicker({
  members,
  initialCredits,
}: {
  members: Member[];
  initialCredits: ShowCastCredit[];
}) {
  const [credits, setCredits] = useState<ShowCastCredit[]>(() =>
    dedupeCastCredits(initialCredits),
  );

  function toggle(slug: string, checked: boolean) {
    setCredits((current) => {
      if (checked) {
        if (current.some((c) => c.memberSlug === slug)) return current;
        return [...current, { memberSlug: slug }];
      }
      return current.filter((c) => c.memberSlug !== slug);
    });
  }

  function setRole(slug: string, role: string) {
    setCredits((current) =>
      current.map((c) =>
        c.memberSlug === slug ? { ...c, role: role || undefined } : c,
      ),
    );
  }

  const selected = new Set(credits.map((c) => c.memberSlug));

  return (
    <div className="space-y-3">
      <Label>Cast and creative team</Label>
      <input type="hidden" name="castCredits" value={JSON.stringify(credits)} />
      <ul className="space-y-2 rounded-lg border border-border p-3">
        {members.map((member) => {
          const credit = credits.find((c) => c.memberSlug === member.slug);
          const checked = selected.has(member.slug);
          return (
            <li
              key={member.slug}
              className="flex flex-wrap items-center gap-3 border-b border-border/60 pb-2 last:border-0 last:pb-0"
            >
              <label className="flex min-w-[12rem] items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => toggle(member.slug, e.target.checked)}
                  className="size-4 rounded border"
                />
                <span>{member.name}</span>
              </label>
              {checked && (
                <Input
                  placeholder="Role (optional)"
                  value={credit?.role ?? ""}
                  onChange={(e) => setRole(member.slug, e.target.value)}
                  className="max-w-xs"
                />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
