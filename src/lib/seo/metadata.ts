import type { Metadata } from "next";

const siteName = "Impram";
const defaultDescription = "Improv in Gothenburg";

export const metadataBase = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://impram.net",
);

export function pageMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description?: string | null;
  path: string;
  image?: string | null;
}): Metadata {
  const desc = description?.trim() || defaultDescription;
  const canonical = path.endsWith("/") ? path : `${path}/`;

  return {
    title: `${title} – ${siteName}`,
    description: desc,
    alternates: { canonical },
    openGraph: {
      title: `${title} – ${siteName}`,
      description: desc,
      url: canonical,
      siteName,
      locale: "en_US",
      type: "website",
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: `${title} – ${siteName}`,
      description: desc,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export const defaultMetadata: Metadata = {
  metadataBase,
  title: {
    default: `${siteName} – ${defaultDescription}`,
    template: `%s – ${siteName}`,
  },
  description: defaultDescription,
};
