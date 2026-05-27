import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Show } from "@/lib/db/schema";
import { formatUpcomingDate, showTeaser } from "@/lib/show-display";
import { sectionTitleClass } from "@/lib/typography";

export function UpcomingShowHero({ show }: { show: Show }) {
  const image = show.heroImageUrl ?? show.cardImageUrl;
  const teaser = showTeaser(show);
  const when = formatUpcomingDate(show.upcomingAt);

  const showHref = `/shows/${show.slug}/`;

  return (
    <section>
      <h2 className={`mb-6 ${sectionTitleClass} text-2xl`}>Currently playing</h2>
      <Link
        href={showHref}
        className="group block overflow-hidden rounded-2xl bg-impram-navy text-impram-cream shadow-sm transition-all duration-300 hover:shadow-md"
      >
        <div className="grid md:grid-cols-2">
          {image && (
            <div className="relative aspect-[16/10] min-h-[220px] md:aspect-auto md:min-h-[320px]">
              <Image
                src={image}
                alt={show.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          )}
          <div className="flex flex-col justify-center gap-4 p-8 md:p-10">
            <h3 className="text-3xl font-bold leading-tight text-impram-cream sm:text-4xl">
              {show.title}
            </h3>
            {when && <p className="text-lg text-impram-cream/90">{when}</p>}
            {show.venue && (
              <p className="text-sm text-impram-cream/80">{show.venue}</p>
            )}
            {teaser && (
              <p className="whitespace-pre-line text-base leading-relaxed text-impram-cream/90">
                {teaser}
              </p>
            )}
            <div className="pt-2">
              <span
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-impram-accent text-impram-navy group-hover:bg-impram-accent/90",
                )}
              >
                View show details
              </span>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
