import type { MetadataRoute } from "next";
import {
  getAllMemberSlugs,
  getAllShowSlugs,
  getAllSitePageSlugs,
} from "@/lib/db/queries";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://impram.net";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [showSlugs, memberSlugs, pageSlugs] = await Promise.all([
    getAllShowSlugs(),
    getAllMemberSlugs(),
    getAllSitePageSlugs(),
  ]);

  const staticPaths = ["", "shows/", "cast/", ...pageSlugs.map((s) => `${s}/`)];

  return [
    ...staticPaths.map((path) => ({
      url: `${base}/${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    })),
    ...showSlugs.map((slug) => ({
      url: `${base}/shows/${slug}/`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...memberSlugs.map((slug) => ({
      url: `${base}/${slug}/`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
