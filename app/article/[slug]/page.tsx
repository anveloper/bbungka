import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Masthead } from "@/components/masthead";
import { ArticleCard } from "@/components/article-card";
import { SiteFooter } from "@/components/site-footer";
import {
  getArticleBySlug,
  getPublishedArticles,
  todayKST,
  formatKoreanDate,
} from "@/lib/articles";

export const revalidate = 3600;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "기사를 찾을 수 없습니다 — The Bbungka Times" };
  return {
    title: `${article.headline} — The Bbungka Times`,
    description: article.deck,
    openGraph: {
      title: article.headline,
      description: article.deck,
      type: "article",
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const today = todayKST();
  const article = getArticleBySlug(slug, today);

  if (!article) notFound();

  const issueNo = 41000 + getPublishedArticles(today).length;
  const related = getPublishedArticles(today)
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);

  return (
    <div className="min-h-screen">
      <Masthead date={today} issueNo={issueNo} />

      <main className="mx-auto max-w-3xl px-4">
        <article className="py-10">
          <div className="mb-4 flex items-center gap-2 text-[12px] text-accent smallcaps">
            <span>{article.kicker}</span>
            <span className="text-muted">·</span>
            <span className="text-muted">{article.section}</span>
          </div>

          <h1 className="font-display text-4xl font-black leading-[1.1] text-ink sm:text-5xl">
            {article.headline}
          </h1>

          <p className="mt-5 font-display text-xl italic leading-snug text-muted sm:text-2xl">
            {article.deck}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 border-y border-rule/40 py-3 text-[12px] text-muted smallcaps">
            <span className="text-ink">{article.byline}</span>
            <span>·</span>
            <span>{article.dateline}발</span>
            <span>·</span>
            <span>{formatKoreanDate(article.publishDate)}</span>
            <span>·</span>
            <span>{article.readMinutes}분 읽기</span>
          </div>

          <div className="article-body mt-8 text-[17px] text-ink">
            {article.body.map((p, i) => (
              <p key={i} className={i === 0 ? "dropcap" : undefined}>
                {p}
              </p>
            ))}
          </div>

          <div className="mt-10 rounded-sm border border-rule/40 bg-paper-2/60 px-4 py-3 text-[13px] italic leading-relaxed text-muted">
            ※ 이 기사는 The Bbungka Times가 지어낸 <strong>허구</strong>입니다.
            등장하는 인물·기관·통계·발언은 모두 사실이 아니며, 실제와
            무관합니다. 웃자고 쓴 글에 죽자고 믿지 마세요.
          </div>

          <div className="mt-8">
            <Link
              href="/"
              className="text-[13px] text-ink smallcaps hover:text-accent"
            >
              ← 1면으로 돌아가기
            </Link>
          </div>
        </article>

        {related.length > 0 && (
          <section className="border-t-2 border-rule py-8">
            <h3 className="mb-6 font-display text-sm italic text-muted">
              함께 실린 오늘의 거짓말
            </h3>
            <div className="grid gap-x-6 gap-y-8 sm:grid-cols-3">
              {related.map((a, i) => (
                <div key={a.slug} className={i > 0 ? "sm:col-rule sm:pl-6" : ""}>
                  <ArticleCard article={a} variant="compact" />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
