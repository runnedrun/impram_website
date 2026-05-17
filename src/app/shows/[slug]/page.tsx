import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShowCard } from "@/components/show-card";
import { ProseContent } from "@/components/prose-content";
import { ShowMetadata } from "@/components/show-metadata";
import { JsonLd } from "@/components/json-ld";
import { SiteShell } from "@/components/site-shell";
import {
  getAllShowSlugs,
  getRelatedShows,
  getShowBySlug,
} from "@/lib/db/queries";
import { pageMetadata } from "@/lib/seo/metadata";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL) return [];
  const slugs = await getAllShowSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const show = await getShowBySlug(slug);
  if (!show) return {};
  return pageMetadata({
    title: show.title,
    description: show.metaDescription,
    path: `/shows/${show.slug}/`,
    image: show.heroImageUrl,
  });
}

export default async function ShowPage({ params }: Props) {
  const { slug } = await params;
  const show = await getShowBySlug(slug);
  if (!show) notFound();

  const related = await getRelatedShows(show);

  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "TheaterEvent",
    name: show.title,
    description: show.metaDescription ?? show.title,
    location: show.venue
      ? { "@type": "Place", name: show.venue }
      : undefined,
    inLanguage: show.language ?? "en",
    organizer: { "@type": "PerformingGroup", name: "Impram", url: "https://impram.net" },
  };

  return (
    <SiteShell>
      <JsonLd data={eventJsonLd} />
      <article>
        {show.heroImageUrl && (
          <div className="relative mb-10 aspect-[21/9] w-full overflow-hidden rounded-lg bg-muted">
            <Image
              src={show.heroImageUrl}
              alt={show.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1200px) 100vw, 1152px"
            />
          </div>
        )}
        <h1 className="font-[family-name:var(--font-limelight)] text-4xl text-impram-navy sm:text-5xl">
          {show.title}
        </h1>
        {show.tagline && (
          <p className="mt-2 text-lg text-muted-foreground">{show.tagline}</p>
        )}
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_280px]">
          <ProseContent html={show.body} />
          <ShowMetadata show={show} />
        </div>
      </article>

      {related.length > 0 && (
        <section className="mt-16 border-t border-border pt-12">
          <h2 className="mb-8 font-[family-name:var(--font-limelight)] text-2xl text-impram-navy">
            Check out other shows
          </h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((s) => (
              <ShowCard key={s.slug} show={s} />
            ))}
          </div>
          <p className="mt-6">
            <Link href="/shows/" className="text-impram-link hover:underline">
              View all shows
            </Link>
          </p>
        </section>
      )}
    </SiteShell>
  );
}
