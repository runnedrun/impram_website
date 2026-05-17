import { ProseContent } from "@/components/prose-content";
import { PageHeading } from "@/components/page-heading";
import { SiteShell } from "@/components/site-shell";
import { getSitePage } from "@/lib/db/queries";
import { pageMetadata } from "@/lib/seo/metadata";

export const revalidate = 60;

export const metadata = pageMetadata({
  title: "Privacy Policy",
  path: "/privacy-policy/",
});

export default async function PrivacyPolicyPage() {
  const page = await getSitePage("privacy-policy");
  if (!page) return null;

  return (
    <SiteShell>
      <PageHeading title={page.title} />
      <ProseContent html={page.body} />
    </SiteShell>
  );
}
