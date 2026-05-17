import type { Show } from "@/lib/db/schema";

export function showTeaser(show: Show): string {
  if (show.homeTeaser?.trim()) return show.homeTeaser.trim();
  if (show.tagline?.trim()) return show.tagline.trim();
  if (show.metaDescription?.trim()) {
    const plain = show.metaDescription.replace(/\s+/g, " ").trim();
    const cut = plain.indexOf(" About ");
    return cut > 40 ? plain.slice(0, cut) : plain.slice(0, 200);
  }
  return "";
}

export function formatUpcomingDate(iso: string | null): string | null {
  if (!iso?.trim()) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
