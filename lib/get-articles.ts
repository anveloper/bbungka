import { ARTICLES, articleSortKey, todayKST, type Article } from "./articles";
import { getGeneratedArticles } from "./db";

/**
 * 정적 seed 기사 + AI 생성(Neon) 기사를 병합해
 * "오늘 이하 발행 + 최신순"으로 반환한다. 지면의 단일 소스.
 */
export async function getAllPublished(today = todayKST()): Promise<Article[]> {
  const generated = await getGeneratedArticles(today);

  const bySlug = new Map<string, Article>();
  for (const a of ARTICLES) {
    if (a.publishDate <= today) bySlug.set(a.slug, a);
  }
  for (const a of generated) bySlug.set(a.slug, a); // 생성 기사 우선

  return [...bySlug.values()].sort((x, y) =>
    articleSortKey(x) < articleSortKey(y) ? 1 : -1,
  );
}

export async function getPublishedBySlug(
  slug: string,
  today = todayKST(),
): Promise<Article | undefined> {
  return (await getAllPublished(today)).find((a) => a.slug === slug);
}
