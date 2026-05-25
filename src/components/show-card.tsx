import Image from "next/image";
import Link from "next/link";
import type { Show } from "@/lib/db/schema";

export function ShowCard({ show }: { show: Show }) {
  const image = show.cardImageUrl ?? show.heroImageUrl;
  return (
    <Link
      href={`/shows/${show.slug}/`}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-impram-navy shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
    >
      {image ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <Image
            src={image}
            alt={show.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="relative aspect-[16/9] w-full bg-impram-navy" />
      )}
      <div className="flex flex-1 flex-col justify-end p-5 pt-6 bg-impram-navy">
        <h3 className="text-2xl font-bold text-impram-cream sm:text-3xl">
          {show.title}
        </h3>
        {show.tagline && (
          <p className="mt-2 text-sm text-impram-cream/80 line-clamp-2">
            {show.tagline}
          </p>
        )}
      </div>
    </Link>
  );
}
