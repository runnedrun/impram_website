import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProseContent } from "@/components/prose-content";
import { SiteShell } from "@/components/site-shell";
import { getAllMemberSlugs, getMemberBySlug } from "@/lib/db/queries";
import { isReservedSlug } from "@/lib/reserved-slugs";
import { pageMetadata } from "@/lib/seo/metadata";

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

  const credits = member.showCredits ?? [];

  return (
    <SiteShell>
      <article className="mx-auto max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Cast
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-limelight)] text-4xl text-impram-navy sm:text-5xl">
          {member.name}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">{member.role}</p>
        {member.photoUrl && (
          <div className="relative mx-auto mt-10 aspect-[370/492] max-w-sm overflow-hidden rounded-2xl bg-muted shadow-sm">
            <Image
              src={member.photoUrl}
              alt={member.name}
              fill
              className="object-cover"
              sizes="400px"
              priority
            />
          </div>
        )}
        <div className="mt-10">
          {member.bio.includes("<") ? (
            <ProseContent html={member.bio} />
          ) : (
            <p className="text-lg leading-relaxed">{member.bio}</p>
          )}
        </div>
        {credits.length > 0 && (
          <section className="mt-12 border-t border-border/60 pt-10">
            <h2 className="font-[family-name:var(--font-limelight)] text-2xl text-impram-navy">
              Shows
            </h2>
            <ul className="mt-4 space-y-3">
              {credits.map((c) => (
                <li key={`${c.showSlug}-${c.credit}`}>
                  <Link
                    href={`/shows/${c.showSlug}/`}
                    className="text-lg font-medium text-impram-link transition-colors hover:text-impram-link/80"
                  >
                    {c.credit}
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
