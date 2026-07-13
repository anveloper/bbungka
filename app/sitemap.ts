import type { MetadataRoute } from "next";
import { SECTIONS, sectionToSlug, todayKST } from "@/lib/articles";
import { getAllPublished } from "@/lib/get-articles";

export const revalidate = 3600;

const SITE_URL = "https://bbungka.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getAllPublished(todayKST());

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "hourly", priority: 1 },
    ...SECTIONS.map((s) => ({
      url: `${SITE_URL}/section/${sectionToSlug(s)}`,
      changeFrequency: "daily" as const,
      priority: 0.6,
    })),
  ];

  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}/article/${a.slug}`,
    lastModified: a.createdAt ?? `${a.publishDate}T00:00:00.000Z`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...articleRoutes];
}
