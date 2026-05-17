import type { Show } from "@/lib/db/schema";

const fields: { key: keyof Show; label: string }[] = [
  { key: "price", label: "Ticket price" },
  { key: "duration", label: "Duration" },
  { key: "interval", label: "Interval" },
  { key: "language", label: "Language" },
  { key: "venue", label: "Venue" },
  { key: "seatingNote", label: "Seating" },
];

export function ShowMetadata({ show }: { show: Show }) {
  const items = fields.filter((f) => show[f.key]);
  if (items.length === 0) return null;

  return (
    <aside className="rounded-lg border border-border bg-muted/40 p-6">
      <h2 className="mb-4 font-[family-name:var(--font-limelight)] text-xl">Show info</h2>
      <dl className="space-y-3 text-sm">
        {items.map(({ key, label }) => (
          <div key={key}>
            <dt className="font-medium text-muted-foreground">{label}</dt>
            <dd className="mt-0.5">{String(show[key])}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
