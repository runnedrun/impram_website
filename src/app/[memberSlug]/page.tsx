import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MemberBio } from "@/components/member-bio";
import { SiteShell } from "@/components/site-shell";
import {
  getAllMemberSlugs,
  getMemberBySlug,
  getShowsForMember,
} from "@/lib/db/queries";
import { isReservedSlug } from "@/lib/reserved-slugs";
import { pageMetadata } from "@/lib/seo/metadata";
import { sectionTitleClass } from "@/lib/typography";

export const revalidate = 60;

type Props = { params: Promise<{ memberSlug: string }> };

export async function generateStaticParams() {
  if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL) return [];
  const slugs = await getAllMemberSlugs();
  return slugs.map((memberSlug) => ({ memberSlug }));
}

export async function generateMetadata({ params }: Props) {
  const { memberSlug } = await params;
  if (isReservedSlug(memberSlug)) return {};
  const member = await getMemberBySlug(memberSlug);
  if (!member) return {};
  return pageMetadata({
    title: member.name,
    description: member.metaDescription ?? member.bio,
    path: `/${member.slug}/`,
    image: member.photoUrl,
  });
}

export default async function MemberPage({ params }: Props) {
  const { memberSlug } = await params;
  if (isReservedSlug(memberSlug)) notFound();

  const member = await getMemberBySlug(memberSlug);
  if (!member) notFound();

  const memberShows = await getShowsForMember(member.slug);

  return (
    <SiteShell>
      <article className="mx-auto max-w-4xl">
        <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Cast
        </p>

        <div className="mt-6 grid grid-cols-[112px_1fr] items-start gap-5 sm:grid-cols-[200px_1fr] sm:gap-8 md:grid-cols-[240px_1fr]">
          {member.photoUrl ? (
            <div className="relative aspect-[370/492] w-full overflow-hidden rounded-2xl bg-muted shadow-sm">
              <Image
                src={member.photoUrl}
                alt={member.name}
                fill
                className="object-cover object-top"
                sizes="(max-width: 640px) 112px, 240px"
                priority
              />
            </div>
          ) : (
            <div className="flex aspect-[370/492] w-full items-center justify-center rounded-2xl bg-muted text-xs text-muted-foreground sm:text-sm">
              No photo
            </div>
          )}

          <div className="min-w-0 self-center sm:self-auto">
            <h1 className={`${sectionTitleClass} text-2xl leading-tight sm:text-4xl md:text-5xl`}>
              {member.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground sm:mt-2 sm:text-lg">
              {member.role}
            </p>
          </div>
        </div>

        {member.bio.trim() && (
          <div className="mt-8 sm:mt-10">
                <MemberBio bio={member.bio} />
          </div>
        )}

        {memberShows.length > 0 && (
          <section className="mt-12 rounded-2xl border border-border/60 bg-muted/20 p-6 shadow-sm sm:p-8">
            <h2 className={`${sectionTitleClass} text-xl sm:text-2xl`}>
              Previous shows
            </h2>
            <ul className="mt-4 space-y-2.5">
              {memberShows.map((show) => (
                <li key={show.slug}>
                  <Link
                    href={`/shows/${show.slug}/`}
                    className="text-base font-medium text-impram-link transition-colors hover:text-impram-link/80 sm:text-lg"
                  >
                    {show.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </SiteShell>
  );
}
