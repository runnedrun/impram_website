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

const SHOW_TIME_ZONE = "Europe/Stockholm";

function parseShowDate(iso: string): Date | null {
  const trimmed = iso.trim();
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})/.exec(trimmed);
  if (!dateOnly) return null;
  const year = Number(dateOnly[1]);
  const month = Number(dateOnly[2]) - 1;
  const day = Number(dateOnly[3]);
  if (trimmed.length === 10) {
    return new Date(Date.UTC(year, month, day, 12));
  }
  return new Date(trimmed);
}

export function formatUpcomingDate(iso: string | null): string | null {
  if (!iso?.trim()) return null;
  const d = parseShowDate(iso) ?? new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: SHOW_TIME_ZONE,
  });
}
