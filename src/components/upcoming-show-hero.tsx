import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Show } from "@/lib/db/schema";
import { formatUpcomingDate, showTeaser } from "@/lib/show-display";

export function UpcomingShowHero({ show }: { show: Show }) {
  const image = show.heroImageUrl ?? show.cardImageUrl;
  const teaser = showTeaser(show);
  const when = formatUpcomingDate(show.upcomingAt);

  return (
    <section className="overflow-hidden rounded-2xl bg-impram-navy text-impram-cream shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="grid md:grid-cols-2">
        {image && (
          <div className="relative aspect-[16/10] min-h-[220px] md:aspect-auto md:min-h-[320px]">
            <Image
              src={image}
              alt={show.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        )}
        <div className="flex flex-col justify-center gap-4 p-8 md:p-10">
          <p className="text-sm font-medium uppercase tracking-wider text-impram-accent">
            Next show
          </p>
          <h2 className="text-3xl font-bold leading-tight text-impram-cream sm:text-4xl">
            {show.title}
          </h2>
          {when && <p className="text-lg text-impram-cream/90">{when}</p>}
          {show.venue && (
            <p className="text-sm text-impram-cream/80">{show.venue}</p>
          )}
          {teaser && (
            <p className="text-base leading-relaxed text-impram-cream/90">{teaser}</p>
          )}
          <div className="pt-2">
            <Link
              href={`/shows/${show.slug}/`}
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-impram-accent text-impram-navy hover:bg-impram-accent/90",
              )}
            >
              View show details
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
