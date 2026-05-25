import type { shows } from "@/lib/db/schema";
import { migrateLegacyShowBody } from "@/lib/show-content";

type ShowInsert = typeof shows.$inferInsert;

export function showInsertFromLegacyRow(
  row: ShowInsert & { body?: string },
): ShowInsert {
  const legacyBody = row.body ?? "";
  const {
    body: _body,
    aboutText: _aboutText,
    ticketUrl: _ticketUrl,
    performanceSummary: _performanceSummary,
    eventNotes: _eventNotes,
    castCredits: _castCredits,
    ...base
  } = row as ShowInsert & { body?: string };

  if (!legacyBody.trim()) {
    return {
      ...base,
      aboutText: row.aboutText ?? "",
      ticketUrl: row.ticketUrl ?? null,
      performanceSummary: row.performanceSummary ?? null,
      eventNotes: row.eventNotes ?? null,
      castCredits: row.castCredits ?? [],
    };
  }

  const migrated = migrateLegacyShowBody(legacyBody);
  return {
    ...base,
    aboutText: migrated.aboutText,
    ticketUrl: migrated.ticketUrl,
    performanceSummary: migrated.performanceSummary,
    eventNotes: migrated.eventNotes,
    castCredits: migrated.castCredits,
    price: migrated.price ?? base.price ?? null,
    duration: migrated.duration ?? base.duration ?? null,
    interval: migrated.interval ?? base.interval ?? null,
    language: migrated.language ?? base.language ?? null,
    venue: migrated.venue ?? base.venue ?? null,
    seatingNote: migrated.seatingNote ?? base.seatingNote ?? null,
  };
}
