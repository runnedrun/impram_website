import type { Member, Show } from "@/lib/db/schema";

export type ShowCastCredit = {
  memberSlug: string;
  role?: string | null;
};

export function dedupeCastCredits(credits: ShowCastCredit[]): ShowCastCredit[] {
  const seen = new Set<string>();
  const deduped: ShowCastCredit[] = [];

  for (const credit of credits) {
    const memberSlug = credit.memberSlug?.trim();
    if (!memberSlug || seen.has(memberSlug)) continue;
    seen.add(memberSlug);
    deduped.push({
      memberSlug,
      role: credit.role?.trim() || undefined,
    });
  }

  return deduped;
}

export type ShowDisplayCast = {
  slug: string;
  name: string;
  photoUrl: string;
  role?: string;
};

function stripTags(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function memberSlugFromHref(href: string): string | null {
  const match = href.match(/\/([a-z0-9-]+)\/?$/i);
  return match?.[1] ?? null;
}

function parseCastFromHtml(castHtml: string): ShowCastCredit[] {
  const credits: ShowCastCredit[] = [];
  let pendingPhoto: string | null = null;

  const chunks = castHtml.split(/<section[\s>]/i).slice(1);

  for (const chunk of chunks) {
    const imgMatch = chunk.match(/<img[^>]+src="([^"]+)"/i);
    if (imgMatch) pendingPhoto = imgMatch[1];

    const nameMatch = chunk.match(
      /<h4[^>]*>\s*<a[^>]+href="([^"]+)"[^>]*>\s*([\s\S]*?)<\/a>/i,
    );
    if (nameMatch) {
      const slug = memberSlugFromHref(nameMatch[1]);
      if (slug) {
        credits.push({ memberSlug: slug });
        pendingPhoto = null;
      }
    }

    const roleMatch = chunk.match(/<h5[^>]*>\s*([\s\S]*?)<\/h5>/i);
    if (roleMatch && credits.length > 0) {
      const role = stripTags(roleMatch[1]);
      if (role.toLowerCase() !== "cast and creative team") {
        credits[credits.length - 1].role = role;
      }
    }
  }

  return credits;
}

const ABOUT_END =
  /(?=<h3[^>]*>\s*Upcoming|<h5[^>]*>\s*Cast and creative team|<section[\s>]|<p>\s*<strong>\s*Shows:|\bBOOK TICKETS\b|Stripe Payments requires)/i;

function cleanAboutText(text: string): string {
  return text
    .replace(/^[^\n]{0,80}?\n+ABOUT THE SHOW\s*/i, "")
    .replace(/^ABOUT THE SHOW\s*/i, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function extractAboutText(html: string): string {
  const normalized = html.replace(/\t/g, "");

  const h2Match = normalized.match(
    /<h2[^>]*>\s*About the show\s*<\/h2>\s*([\s\S]*)/i,
  );
  if (h2Match) {
    const chunk = h2Match[1].split(ABOUT_END)[0];
    return cleanAboutText(stripTags(chunk));
  }

  const h5Match = normalized.match(
    /<h5[^>]*>[\s\S]*?ABOUT[\s\S]*?THE\s*SHOW[\s\S]*?<\/h5>\s*([\s\S]*)/i,
  );
  if (h5Match) {
    const chunk = h5Match[1].split(ABOUT_END)[0];
    return cleanAboutText(stripTags(chunk));
  }

  return "";
}

function paragraphLinesFromHtml(html: string): string[] {
  const lines: string[] = [];
  for (const pMatch of html.matchAll(/<p>([\s\S]*?)<\/p>/gi)) {
    const text = stripTags(pMatch[1]);
    if (!text) continue;
    if (text.includes("Stripe Payments requires")) continue;
    if (text.includes("asp_data_")) continue;
    if (/^Processing\s*\.{3}$/i.test(text)) continue;
    lines.push(text);
  }
  return lines;
}

function classifyDetailLines(lines: string[]): {
  price: string | null;
  duration: string | null;
  interval: string | null;
  language: string | null;
  venue: string | null;
  seatingNote: string | null;
  extraNotes: string[];
} {
  let price: string | null = null;
  let duration: string | null = null;
  let interval: string | null = null;
  let language: string | null = null;
  let venue: string | null = null;
  let seatingNote: string | null = null;
  const extraNotes: string[] = [];
  let pendingVenueLabel = false;

  for (const line of lines) {
    if (pendingVenueLabel) {
      venue = venue ? `${venue}\n${line}` : line;
      pendingVenueLabel = false;
      continue;
    }
    if (line === "PERFORMANCE VENUE") {
      pendingVenueLabel = true;
      continue;
    }
    if (line.includes("SEK")) {
      price = line.replace(/(\d+ SEK for Show)\s+(\d+ SEK)/, "$1\n$2");
    } else if (line.startsWith("Venue:")) {
      venue = line.replace(/^Venue:\s*/, "");
    } else if (line === "Performed in English") {
      language = "English";
    } else if (line === "THE SHOW IS PERFORMED") {
      continue;
    } else if (line === "IN ENGLISH") {
      language = "English";
    } else if (/INTERVAL/i.test(line) && !/\d+\s*MINUTES/i.test(line)) {
      interval = line;
    } else if (/Seating.*prior/i.test(line)) {
      seatingNote = line;
    } else if (
      /\d+\s*(?:MINUTES|HOUR|HOURS)/i.test(line) ||
      line.includes("Doors open") ||
      line.includes("Show runs") ||
      line.includes("performance length")
    ) {
      duration = duration ? `${duration}\n${line}` : line;
    } else if (/waffle|brunch/i.test(line)) {
      extraNotes.push(line);
    } else if (/Dice Theater|Göteborg|41455|Fängelset|Kålltorpsgatan/i.test(line)) {
      venue = venue ? `${venue}\n${line}` : line;
    } else if (
      !line.startsWith("Shows:") &&
      line !== "BOOK TICKETS" &&
      !line.includes("Tickets are sold through")
    ) {
      extraNotes.push(line);
    }
  }

  return { price, duration, interval, language, venue, seatingNote, extraNotes };
}

function extractUpcomingFromHtml(html: string): {
  performanceSummary?: string;
  ticketUrl?: string;
  eventNoteLines: string[];
  price: string | null;
  duration: string | null;
  interval: string | null;
  language: string | null;
  venue: string | null;
  seatingNote: string | null;
} {
  const normalized = html.replace(/\t/g, "");
  const upcomingMatch = normalized.match(
    /<h3[^>]*>\s*Upcoming shows\s*<\/h3>\s*([\s\S]*?)(?=<h5[^>]*>\s*Cast and creative team|$)/i,
  );
  const upcomingHtml = upcomingMatch?.[1] ?? "";

  let performanceSummary: string | undefined;
  const dateMatch = upcomingHtml.match(/<p>\s*<strong>([\s\S]*?)<\/strong>/i);
  if (dateMatch) {
    performanceSummary = stripTags(dateMatch[1]).replace(/\s*-\s*$/, "");
  }

  if (!performanceSummary) {
    const showsMatch = normalized.match(
      /<p>\s*<strong>\s*Shows:\s*([^<]+)<\/strong>/i,
    );
    if (showsMatch) {
      performanceSummary = stripTags(showsMatch[1]).trim();
    }
  }

  const ticketMatch =
    upcomingHtml.match(
      /<a[^>]+href="([^"]+)"[^>]*>[\s\S]*?Get tickets/i,
    ) ??
    normalized.match(
      /<a[^>]+href="([^"]+)"[^>]*>[\s\S]*?BOOK TICKETS/i,
    );
  const ticketUrl = ticketMatch?.[1];

  const tailAfterAbout =
    normalized.match(
      /<h2[^>]*>\s*About the show\s*<\/h2>[\s\S]*/i,
    )?.[0] ??
    normalized.match(
      /<h5[^>]*>[\s\S]*?ABOUT[\s\S]*?THE\s*SHOW[\s\S]*?<\/h5>[\s\S]*/i,
    )?.[0] ??
    "";
  const detailSource = upcomingHtml || tailAfterAbout;
  const classified = classifyDetailLines(paragraphLinesFromHtml(detailSource));

  const eventNoteLines = classified.extraNotes.filter((line) => {
    if (performanceSummary && line === performanceSummary) return false;
    if (line === "PERFORMANCE VENUE") return false;
    if (line === "THE SHOW IS PERFORMED") return false;
    if (line === "IN ENGLISH") return false;
    return true;
  });

  return {
    performanceSummary,
    ticketUrl,
    eventNoteLines,
    price: classified.price,
    duration: classified.duration,
    interval: classified.interval,
    language: classified.language,
    venue: classified.venue,
    seatingNote: classified.seatingNote,
  };
}

export function migrateLegacyShowBody(body: string): {
  aboutText: string;
  ticketUrl: string | null;
  performanceSummary: string | null;
  eventNotes: string | null;
  castCredits: ShowCastCredit[];
  price: string | null;
  duration: string | null;
  interval: string | null;
  language: string | null;
  venue: string | null;
  seatingNote: string | null;
} {
  const aboutText = extractAboutText(body);
  const upcoming = extractUpcomingFromHtml(body);

  const castMatch = body.replace(/\t/g, "").match(
    /<h5[^>]*>\s*Cast and creative team\s*<\/h5>\s*([\s\S]*)/i,
  );
  const castCredits = parseCastFromHtml(castMatch?.[1] ?? "");

  const eventNotes =
    upcoming.eventNoteLines.length > 0
      ? upcoming.eventNoteLines.join("\n")
      : null;

  return {
    aboutText,
    ticketUrl: upcoming.ticketUrl ?? null,
    performanceSummary: upcoming.performanceSummary ?? null,
    eventNotes,
    castCredits,
    price: upcoming.price,
    duration: upcoming.duration,
    interval: upcoming.interval,
    language: upcoming.language,
    venue: upcoming.venue,
    seatingNote: upcoming.seatingNote,
  };
}

export function eventNotesToLines(eventNotes: string | null): string[] {
  if (!eventNotes?.trim()) return [];
  return eventNotes
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function aboutParagraphs(aboutText: string): string[] {
  return aboutText
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function resolveShowCast(
  show: Show,
  members: Member[],
): ShowDisplayCast[] {
  const credits = dedupeCastCredits((show.castCredits ?? []) as ShowCastCredit[]);
  const bySlug = new Map(members.map((m) => [m.slug, m]));

  const cast: ShowDisplayCast[] = [];
  for (const credit of credits) {
    const member = bySlug.get(credit.memberSlug);
    if (!member) continue;
    const role =
      credit.role?.trim() ||
      (member.role !== "Improviser" ? member.role : undefined);
    cast.push({
      slug: member.slug,
      name: member.name,
      photoUrl: member.photoUrl ?? "",
      role,
    });
  }
  return cast;
}

export function showHasUpcomingBlock(show: Show): boolean {
  return Boolean(
    show.performanceSummary?.trim() ||
      show.ticketUrl?.trim() ||
      show.price?.trim() ||
      show.duration?.trim() ||
      show.venue?.trim() ||
      show.language?.trim() ||
      show.seatingNote?.trim() ||
      eventNotesToLines(show.eventNotes).length > 0,
  );
}
