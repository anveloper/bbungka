import Link from "next/link";
import { Masthead } from "@/components/masthead";
import { ArticleCard } from "@/components/article-card";
import { SiteFooter } from "@/components/site-footer";
import { getPublishedArticles, todayKST } from "@/lib/articles";

// 매 시간 재검증 → 자정이 지나면 그날의 새 기사가 지면에 등장
export const revalidate = 3600;

export default function HomePage() {
  const today = todayKST();
  const published = getPublishedArticles(today);
  const issueNo = 41000 + published.length;

  const [lead, ...rest] = published;
  const secondary = rest.slice(0, 2);
  const columns = rest.slice(2);

  return (
    <div className="min-h-screen">
      <Masthead date={today} issueNo={issueNo} />

      <main className="mx-auto max-w-6xl px-4">
        {!lead ? (
          <div className="py-24 text-center text-muted">
            <p className="font-display text-2xl italic">
              오늘 지면은 아직 인쇄 전입니다.
            </p>
          </div>
        ) : (
          <>
            {/* 1면 톱기사 */}
            <section className="grid gap-8 border-b border-rule/40 py-8 md:grid-cols-3">
              <div className="md:col-span-2">
                <div className="mb-3 flex items-center gap-2 text-[11px] text-accent smallcaps">
                  <span>{lead.kicker}</span>
                  <span className="text-muted">·</span>
                  <span className="text-muted">{lead.section}</span>
                  <span className="text-muted">· 오늘의 톱기사</span>
                </div>
                <Link href={`/article/${lead.slug}`}>
                  <h2 className="font-display text-4xl font-black leading-[1.08] text-ink transition-colors hover:text-accent sm:text-6xl">
                    {lead.headline}
                  </h2>
                </Link>
                <p className="mt-4 font-display text-xl italic leading-snug text-muted sm:text-2xl">
                  {lead.deck}
                </p>
                <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-ink/85">
                  {lead.body[0]}
                </p>
                <div className="mt-4 flex items-center gap-3 text-[12px] text-muted smallcaps">
                  <span>{lead.byline}</span>
                  <span>·</span>
                  <span>{lead.dateline}발</span>
                  <span>·</span>
                  <span>{lead.readMinutes}분 읽기</span>
                </div>
                <Link
                  href={`/article/${lead.slug}`}
                  className="mt-4 inline-block border-b border-ink pb-0.5 text-[13px] text-ink smallcaps hover:border-accent hover:text-accent"
                >
                  기사 전문 읽기 →
                </Link>
              </div>

              {/* 사이드 두 꼭지 */}
              <aside className="col-rule flex flex-col gap-6 pl-0 md:pl-6">
                {secondary.map((a) => (
                  <div
                    key={a.slug}
                    className="border-b border-rule/30 pb-5 last:border-0"
                  >
                    <ArticleCard article={a} variant="compact" />
                  </div>
                ))}
                {secondary.length === 0 && (
                  <p className="text-sm italic text-muted">
                    곧 더 많은 거짓말이 도착합니다.
                  </p>
                )}
              </aside>
            </section>

            {/* 하단 다단 편집 */}
            {columns.length > 0 && (
              <section className="py-8">
                <h3 className="rule-double mb-6 pt-3 text-center font-display text-sm italic text-muted">
                  더 많은 오늘의 소식
                </h3>
                <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                  {columns.map((a, i) => (
                    <div
                      key={a.slug}
                      className={i % 3 !== 0 ? "lg:col-rule lg:pl-6" : ""}
                    >
                      <ArticleCard article={a} />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
