import { MemberCard } from "@/components/member-card";
import { PageHeading } from "@/components/page-heading";
import { SiteShell } from "@/components/site-shell";
import { getPublishedMembers } from "@/lib/db/queries";
import { pageMetadata } from "@/lib/seo/metadata";

export const revalidate = 60;

export const metadata = pageMetadata({
  title: "Cast",
  description: "Meet the Impram improvisers in Gothenburg.",
  path: "/cast/",
});

export default async function CastPage() {
  const cast = await getPublishedMembers();

  return (
    <SiteShell>
      <PageHeading title="Cast" />
      <div className="grid grid-cols-3 items-start gap-x-3 gap-y-12 sm:gap-x-4 sm:gap-y-10 lg:grid-cols-3 xl:grid-cols-4">
        {cast.map((member) => (
          <MemberCard key={member.slug} member={member} />
        ))}
      </div>
    </SiteShell>
  );
}
