import { ProseContent } from "@/components/prose-content";
import { PageHeading } from "@/components/page-heading";
import { SiteShell } from "@/components/site-shell";
import { getSitePage } from "@/lib/db/queries";
import { pageMetadata } from "@/lib/seo/metadata";

export const revalidate = 60;

export const metadata = pageMetadata({
  title: "About us",
  path: "/about-us/",
});

export default async function AboutUsPage() {
  const page = await getSitePage("about-us");
  if (!page) return null;

  return (
    <SiteShell>
      <PageHeading title={page.title} />
      <ProseContent html={page.body} />
    </SiteShell>
  );
}
