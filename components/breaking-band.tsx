import Link from "next/link";
import type { Article } from "@/lib/articles";

type BreakingBandProps = {
  articles: Article[];
};

// 최신 헤드라인들이 좌로 흐르는 속보 띠. 컨텐츠를 2벌 렌더해 이음매 없이 순환.
export const BreakingBand = ({ articles }: BreakingBandProps) => {
  const items = articles.slice(0, 8);
  if (items.length === 0) return null;

  const Row = ({ ariaHidden }: { ariaHidden?: boolean }) => (
    <span className="ticker-track" aria-hidden={ariaHidden}>
      {items.map((a) => (
        <Link
          key={a.slug}
          href={`/article/${a.slug}`}
          className="mx-6 text-[13px] text-paper/95 hover:text-paper hover:underline"
        >
          <span className="mr-2 text-paper/60">◆</span>
          {a.headline}
        </Link>
      ))}
    </span>
  );

  return (
    <div className="flex items-stretch border-b-2 border-rule bg-ink text-paper">
      <div className="breaking-tag flex shrink-0 items-center px-3 smallcaps text-[12px] font-bold tracking-widest">
        속보
      </div>
      <div className="ticker-mask relative flex-1 overflow-hidden py-1.5">
        <div className="flex w-max">
          <Row />
          <Row ariaHidden />
        </div>
      </div>
    </div>
  );
};
