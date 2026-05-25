import type { Show } from "@/lib/db/schema";
import { sectionTitleClass } from "@/lib/typography";

const fields: { key: keyof Show; label: string }[] = [
  { key: "price", label: "Ticket price" },
  { key: "duration", label: "Duration" },
  { key: "interval", label: "Interval" },
  { key: "language", label: "Language" },
  { key: "venue", label: "Venue" },
  { key: "seatingNote", label: "Seating" },
];

export function ShowMetadata({
  show,
  extraItems,
}: {
  show: Show;
  extraItems?: { label: string; value: string }[];
}) {
  const dbItems = fields
    .filter((f) => show[f.key])
    .map(({ key, label }) => ({ label, value: String(show[key]) }));
  const items = [...dbItems, ...(extraItems ?? [])];
  if (items.length === 0) return null;

  return (
    <aside className="rounded-2xl border border-border/60 bg-muted/30 p-6 shadow-sm lg:sticky lg:top-28 lg:self-start">
      <h2 className={`mb-4 ${sectionTitleClass} text-2xl`}>
        Show info
      </h2>
      <dl className="space-y-4 text-sm">
        {items.map(({ label, value }) => (
          <div key={`${label}-${value}`}>
            <dt className="font-medium text-muted-foreground">{label}</dt>
            <dd className="mt-0.5 whitespace-pre-line leading-relaxed">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
