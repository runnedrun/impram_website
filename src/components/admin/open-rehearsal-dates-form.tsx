"use client";

import Link from "next/link";
import { useState } from "react";
import { saveOpenRehearsalDates } from "@/lib/admin/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { OpenRehearsalDate } from "@/lib/db/schema";

export function OpenRehearsalDatesForm({ dates }: { dates: OpenRehearsalDate[] }) {
  const [rows, setRows] = useState(
    dates.length > 0 ? dates.map((d) => d.label) : [""],
  );

  function addRow() {
    setRows((current) => [...current, ""]);
  }

  function removeRow(index: number) {
    setRows((current) => current.filter((_, i) => i !== index));
  }

  function updateRow(index: number, value: string) {
    setRows((current) => current.map((row, i) => (i === index ? value : row)));
  }

  return (
    <form action={saveOpenRehearsalDates} className="space-y-6">
      <div className="space-y-2">
        <Label>Upcoming open sessions</Label>
        <p className="text-sm text-muted-foreground">
          One date per line, shown under &quot;Upcoming open sessions:&quot; on the Join us page.
          Example: Wednesday, February 25th
        </p>
      </div>

      <ul className="space-y-3">
        {rows.map((label, index) => (
          <li key={index} className="flex gap-2">
            <Input
              value={label}
              onChange={(e) => updateRow(index, e.target.value)}
              placeholder="Wednesday, February 25th"
              aria-label={`Open session date ${index + 1}`}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => removeRow(index)}
              disabled={rows.length === 1 && label === ""}
            >
              Remove
            </Button>
          </li>
        ))}
      </ul>

      <Button type="button" variant="outline" onClick={addRow}>
        Add date
      </Button>

      <input type="hidden" name="dates" value={JSON.stringify(rows)} />

      <div className="flex flex-wrap gap-3 border-t pt-6">
        <Button type="submit">Save dates</Button>
        <Link href="/join-us/" target="_blank" className={buttonVariants({ variant: "outline" })}>
          Preview Join us page
        </Link>
      </div>
    </form>
  );
}
