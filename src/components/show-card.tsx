import Image from "next/image";
import Link from "next/link";
import type { Show } from "@/lib/db/schema";

export function ShowCard({ show }: { show: Show }) {
  const image = show.cardImageUrl ?? show.heroImageUrl;
  return (
    <Link
      href={`/shows/${show.slug}/`}
      className="group relative block overflow-hidden bg-impram-navy"
    >
      {image && (
        <div className="relative aspect-[16/9] w-full">
          <Image
            src={image}
            alt={show.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-impram-navy/40 transition-opacity group-hover:bg-impram-navy/20" />
        </div>
      )}
      <div className="absolute inset-0 flex items-end p-6">
        <h3 className="font-[family-name:var(--font-limelight)] text-3xl text-white drop-shadow-md sm:text-4xl">
          {show.title}
        </h3>
      </div>
    </Link>
  );
}
