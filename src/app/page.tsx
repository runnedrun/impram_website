import Link from "next/link";
import { UpcomingShowHero } from "@/components/upcoming-show-hero";
import { SiteShell } from "@/components/site-shell";
import { getUpcomingShow } from "@/lib/db/queries";
import { groupIntro } from "@/lib/site-copy";
import { pageMetadata } from "@/lib/seo/metadata";

export const revalidate = 60;

export const metadata = pageMetadata({
  title: "Improv in Gothenburg",
  description: "Impram – English improv theater in Gothenburg. See our next show and join us.",
  path: "/",
});

export default async function HomePage() {
  const upcoming = await getUpcomingShow();

  return (
    <SiteShell>
      <p className="mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground">
        {groupIntro}
      </p>

      {upcoming ? (
        <UpcomingShowHero show={upcoming} />
      ) : (
        <section className="rounded-xl border border-dashed border-border bg-muted/40 p-10 text-center">
          <p className="text-lg text-muted-foreground">No upcoming show scheduled yet.</p>
          <Link href="/shows/" className="mt-4 inline-block text-impram-link hover:underline">
            Browse our shows
          </Link>
        </section>
      )}

      <nav className="mt-12 flex flex-wrap gap-6 border-t border-border pt-8 text-sm font-medium">
        <Link href="/shows/" className="text-impram-link hover:underline">
          All shows
        </Link>
        <Link href="/cast/" className="text-impram-link hover:underline">
          Cast
        </Link>
        <Link href="/join-us/" className="text-impram-link hover:underline">
          Join us
        </Link>
        <Link href="/about-us/" className="text-impram-link hover:underline">
          About us
        </Link>
      </nav>
    </SiteShell>
  );
}
