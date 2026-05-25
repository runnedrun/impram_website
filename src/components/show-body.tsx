import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Show } from "@/lib/db/schema";
import {
  aboutParagraphs,
  eventNotesToLines,
  resolveShowCast,
  showHasUpcomingBlock,
  type ShowDisplayCast,
} from "@/lib/show-content";

function ShowCastCard({ member }: { member: ShowDisplayCast }) {
  return (
    <Link
      href={`/${member.slug}/`}
      className="group flex flex-col items-center text-center"
    >
      <div className="relative aspect-square w-full max-w-[160px] overflow-hidden rounded-2xl bg-muted shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-md">
        {member.photoUrl ? (
          <Image
            src={member.photoUrl}
            alt={member.name}
            fill
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, 160px"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No photo
          </div>
        )}
      </div>
      <h3 className="mt-4 font-[family-name:var(--font-limelight)] text-lg leading-tight text-foreground transition-colors group-hover:text-impram-link">
        {member.name}
      </h3>
      {member.role && (
        <p className="mt-1 text-sm text-muted-foreground">{member.role}</p>
      )}
    </Link>
  );
}

function ShowInfoList({
  show,
  extraLines,
}: {
  show: Show;
  extraLines: string[];
}) {
  const rows: { label: string; value: string }[] = [];

  if (show.price?.trim()) rows.push({ label: "Tickets", value: show.price.trim() });
  if (show.duration?.trim()) {
    rows.push({ label: "Schedule", value: show.duration.trim() });
  }
  for (const line of extraLines) {
    rows.push({ label: "", value: line });
  }
  if (show.language?.trim()) {
    rows.push({ label: "Language", value: show.language.trim() });
  }
  if (show.seatingNote?.trim()) {
    rows.push({ label: "Seating", value: show.seatingNote.trim() });
  }
  if (show.venue?.trim()) rows.push({ label: "Venue", value: show.venue.trim() });
  if (show.interval?.trim()) {
    rows.push({ label: "Interval", value: show.interval.trim() });
  }

  if (rows.length === 0) return null;

  return (
    <dl className="divide-y divide-border/60">
      {rows.map((detail) => (
        <div
          key={`${detail.label}-${detail.value}`}
          className="grid gap-1 bg-background px-6 py-4 sm:grid-cols-[7.5rem_1fr] sm:gap-4"
        >
          {detail.label ? (
            <dt className="text-sm font-medium text-muted-foreground">
              {detail.label}
            </dt>
          ) : (
            <dt className="sr-only">Detail</dt>
          )}
          <dd className="text-sm leading-relaxed whitespace-pre-line text-foreground">
            {detail.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function ShowBody({
  show,
  members,
}: {
  show: Show;
  members: Parameters<typeof resolveShowCast>[1];
}) {
  const paragraphs = aboutParagraphs(show.aboutText);
  const cast = resolveShowCast(show, members);
  const extraLines = eventNotesToLines(show.eventNotes);
  const hasEvent = showHasUpcomingBlock(show);

  return (
    <div className="flex flex-col gap-14">
      {paragraphs.length > 0 && (
        <section>
          <h2 className="font-[family-name:var(--font-limelight)] text-3xl text-impram-navy">
            About the show
          </h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-foreground">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>
      )}

      {hasEvent && (
        <section>
          <h2 className="font-[family-name:var(--font-limelight)] text-3xl text-impram-navy">
            Upcoming shows
          </h2>
          <div className="mt-6 overflow-hidden rounded-2xl border border-border/60 shadow-sm">
            {show.performanceSummary?.trim() && (
              <div className="bg-impram-navy px-6 py-5 text-impram-cream">
                <p className="text-lg leading-relaxed">{show.performanceSummary}</p>
              </div>
            )}
            <ShowInfoList show={show} extraLines={extraLines} />
            {show.ticketUrl?.trim() && (
              <div className="border-t border-border/60 bg-muted/20 px-6 py-6">
                <a
                  href={show.ticketUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "w-full bg-impram-accent text-impram-navy hover:bg-impram-accent/90 sm:w-auto",
                  )}
                >
                  Get tickets
                </a>
              </div>
            )}
          </div>
        </section>
      )}

      {cast.length > 0 && (
        <section>
          <h2 className="font-[family-name:var(--font-limelight)] text-3xl text-impram-navy">
            Cast and creative team
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {cast.map((member) => (
              <ShowCastCard key={member.slug} member={member} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
