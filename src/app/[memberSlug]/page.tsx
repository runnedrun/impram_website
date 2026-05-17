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
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Meet our cast
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-limelight)] text-4xl text-impram-navy sm:text-5xl">
          {member.name}
        </h1>
        {member.photoUrl && (
          <div className="relative mx-auto mt-8 aspect-[370/492] max-w-sm overflow-hidden bg-muted">
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
        <div className="mt-8">
          {member.bio.includes("<") ? (
            <ProseContent html={member.bio} />
          ) : (
            <p className="text-lg leading-relaxed">{member.bio}</p>
          )}
        </div>
        {credits.length > 0 && (
          <ul className="mt-8 space-y-2 border-t border-border pt-8">
            {credits.map((c) => (
              <li key={`${c.showSlug}-${c.credit}`}>
                <Link
                  href={`/shows/${c.showSlug}/`}
                  className="text-impram-link hover:underline"
                >
                  {c.credit}
                </Link>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-2 text-sm text-muted-foreground">{member.role}</p>
      </article>
    </SiteShell>
  );
}
