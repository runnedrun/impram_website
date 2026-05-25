import { JoinUsContent } from "@/components/join-us-content";
import { PageHeading } from "@/components/page-heading";
import { SiteShell } from "@/components/site-shell";
import { getOpenRehearsalDates } from "@/lib/db/queries";
import { pageMetadata } from "@/lib/seo/metadata";

export const revalidate = 60;

export const metadata = pageMetadata({
  title: "Join us",
  path: "/join-us/",
});

export default async function JoinUsPage() {
  const dates = await getOpenRehearsalDates();

  return (
    <SiteShell>
      <PageHeading title="Join us" />
      <JoinUsContent dates={dates} />
    </SiteShell>
  );
}
