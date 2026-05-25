import { AboutUsContent } from "@/components/about-us-content";
import { PageHeading } from "@/components/page-heading";
import { SiteShell } from "@/components/site-shell";
import { pageMetadata } from "@/lib/seo/metadata";

export const revalidate = 60;

export const metadata = pageMetadata({
  title: "About us",
  path: "/about-us/",
});

export default function AboutUsPage() {
  return (
    <SiteShell>
      <PageHeading title="About us" />
      <AboutUsContent />
    </SiteShell>
  );
}
