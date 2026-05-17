import { ShowCard } from "@/components/show-card";
import { PageHeading } from "@/components/page-heading";
import { SiteShell } from "@/components/site-shell";
import { getPublishedShowsByStatus } from "@/lib/db/queries";
import { pageMetadata } from "@/lib/seo/metadata";

export const revalidate = 60;

export const metadata = pageMetadata({
  title: "Shows",
  description: "Impram shows in Gothenburg – currently playing and previous productions.",
  path: "/shows/",
});

export default async function ShowsPage() {
  const [current, archived] = await Promise.all([
    getPublishedShowsByStatus("current"),
    getPublishedShowsByStatus("archived"),
  ]);

  return (
    <SiteShell>
      <PageHeading title="Shows" />
      {current.length > 0 && (
        <section className="mb-14">
          <h2 className="mb-6 font-[family-name:var(--font-limelight)] text-2xl text-impram-navy">
            Currently playing
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {current.map((show) => (
              <ShowCard key={show.slug} show={show} />
            ))}
          </div>
        </section>
      )}
      {archived.length > 0 && (
        <section>
          <h2 className="mb-6 font-[family-name:var(--font-limelight)] text-2xl text-impram-navy">
            Previous shows
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {archived.map((show) => (
              <ShowCard key={show.slug} show={show} />
            ))}
          </div>
        </section>
      )}
    </SiteShell>
  );
}
