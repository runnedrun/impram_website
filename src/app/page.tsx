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
      <div className="flex flex-col gap-16 md:gap-24">
        <section className="flex flex-col items-center text-center max-w-3xl mx-auto pt-8 pb-4">
          <h1 className="font-[family-name:var(--font-limelight)] text-5xl md:text-6xl text-impram-navy mb-6">
            Welcome to Impram
          </h1>
          <p className="text-xl md:text-2xl leading-relaxed text-muted-foreground">
            {groupIntro}
          </p>
        </section>

        {upcoming ? (
          <UpcomingShowHero show={upcoming} />
        ) : (
          <section className="rounded-2xl border border-dashed border-border bg-muted/40 p-12 text-center shadow-sm">
            <p className="text-xl text-muted-foreground mb-4">No upcoming show scheduled yet.</p>
            <Link href="/shows/" className="inline-block text-lg font-medium text-impram-link hover:text-impram-link/80 transition-colors">
              Browse our previous shows →
            </Link>
          </section>
        )}

        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-10 border-t border-border/60">
          <Link href="/shows/" className="group flex flex-col p-6 rounded-2xl bg-muted/30 hover:bg-muted/60 transition-colors border border-border/40">
            <h3 className="font-[family-name:var(--font-limelight)] text-2xl text-impram-navy mb-2 group-hover:text-impram-link transition-colors">Shows</h3>
            <p className="text-muted-foreground text-sm">Browse our full history of improvised theater.</p>
          </Link>
          <Link href="/cast/" className="group flex flex-col p-6 rounded-2xl bg-muted/30 hover:bg-muted/60 transition-colors border border-border/40">
            <h3 className="font-[family-name:var(--font-limelight)] text-2xl text-impram-navy mb-2 group-hover:text-impram-link transition-colors">Cast</h3>
            <p className="text-muted-foreground text-sm">Meet the performers behind the scenes.</p>
          </Link>
          <Link href="/join-us/" className="group flex flex-col p-6 rounded-2xl bg-muted/30 hover:bg-muted/60 transition-colors border border-border/40">
            <h3 className="font-[family-name:var(--font-limelight)] text-2xl text-impram-navy mb-2 group-hover:text-impram-link transition-colors">Join Us</h3>
            <p className="text-muted-foreground text-sm">Want to try improv? Come play with us.</p>
          </Link>
          <Link href="/about-us/" className="group flex flex-col p-6 rounded-2xl bg-muted/30 hover:bg-muted/60 transition-colors border border-border/40">
            <h3 className="font-[family-name:var(--font-limelight)] text-2xl text-impram-navy mb-2 group-hover:text-impram-link transition-colors">About Us</h3>
            <p className="text-muted-foreground text-sm">Learn about our history and organization.</p>
          </Link>
        </section>
      </div>
    </SiteShell>
  );
}
