import type { MetadataRoute } from "next";

const SITE_URL = "https://bbungka.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // cron 엔드포인트는 크롤링 불필요
      disallow: "/api/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
