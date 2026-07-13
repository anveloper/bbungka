import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Masthead } from "@/components/masthead";
import { ArticleCard } from "@/components/article-card";
import { SiteFooter } from "@/components/site-footer";
import {
  SECTIONS,
  sectionToSlug,
  slugToSection,
  todayKST,
} from "@/lib/articles";
import { getAllPublished } from "@/lib/get-articles";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ section: string }>;
};

export function generateStaticParams() {
  return SECTIONS.map((s) => ({ section: sectionToSlug(s) }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { section: slug } = await params;
  const section = slugToSection(slug);
  if (!section)
    return { title: { absolute: "섹션을 찾을 수 없습니다 — The Bbungka Times" } };
  return {
    title: section,
    description: `The Bbungka Times ${section}면. 매일 하나씩, 세상에서 가장 그럴듯한 거짓말.`,
    alternates: { canonical: `/section/${slug}` },
  };
}

export default async function SectionPage({ params }: PageProps) {
  const { section: slug } = await params;
  const section = slugToSection(slug);
  if (!section) notFound();

  const today = todayKST();
  const all = await getAllPublished(today);
  const issueNo = 41000 + all.length;
  const articles = all.filter((a) => a.section === section);

  return (
    <div className="min-h-screen">
      <Masthead date={today} issueNo={issueNo} activeSection={section} />

      <main className="mx-auto max-w-6xl px-4">
        <div className="rule-double mt-8 flex items-baseline justify-between pt-3">
          <h1 className="font-display text-3xl font-black text-ink sm:text-4xl">
            {section}
          </h1>
          <span className="smallcaps text-[12px] text-muted">
            총 {articles.length}건
          </span>
        </div>

        {articles.length === 0 ? (
          <p className="py-20 text-center font-display text-xl italic text-muted">
            아직 이 면에 실린 거짓말이 없습니다.
          </p>
        ) : (
          <div className="grid gap-x-6 gap-y-8 py-8 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a, i) => (
              <div
                key={a.slug}
                className={`top-rule pt-3 ${
                  i % 3 !== 0 ? "lg:col-rule lg:pl-6" : ""
                }`}
              >
                <ArticleCard article={a} />
              </div>
            ))}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
