import Link from "next/link";
import { SECTIONS, formatKoreanDate } from "@/lib/articles";
import { ThemeToggle } from "@/components/theme-toggle";

type MastheadProps = {
  date: string; // YYYY-MM-DD
  issueNo: number;
};

export const Masthead = ({ date, issueNo }: MastheadProps) => {
  return (
    <header className="border-b-2 border-rule">
      {/* 상단 얇은 정보줄 */}
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-1.5 text-[11px] tracking-wide text-muted smallcaps">
        <span className="shrink-0">제 {issueNo.toLocaleString()} 호</span>
        <span className="hidden sm:block">대한민국 · 전 세계 동시 배달</span>
        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden sm:inline">정가 0원</span>
          <ThemeToggle />
        </div>
      </div>

      <div className="border-t border-rule/40" />

      {/* 제호 */}
      <div className="mx-auto max-w-6xl px-4 py-6 text-center">
        <div className="mb-2 flex items-center justify-center gap-3 text-[11px] text-muted smallcaps">
          <span className="hidden h-px w-16 bg-rule/40 sm:block" />
          <span>매일 하나씩, 세상에서 가장 그럴듯한 거짓말</span>
          <span className="hidden h-px w-16 bg-rule/40 sm:block" />
        </div>

        <Link href="/" className="block">
          <h1 className="masthead-title font-display font-black text-ink">
            The Bbungka Times
          </h1>
        </Link>

        <p className="mt-2 font-display text-lg italic text-muted sm:text-xl">
          뻥&nbsp;카&nbsp;뉴&nbsp;스
        </p>
      </div>

      {/* 날짜 / 슬로건 줄 */}
      <div className="rule-double mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-1 px-4 py-2 text-[12px] text-ink sm:flex-row smallcaps">
          <span>{formatKoreanDate(date)}</span>
          <span className="italic normal-case tracking-normal text-muted">
            &ldquo;All The News That&rsquo;s Unfit To Believe&rdquo;
          </span>
          <span>날씨 · 거짓말처럼 맑음</span>
        </div>
      </div>

      {/* 섹션 내비게이션 */}
      <nav className="border-t border-rule">
        <ul className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-5 gap-y-1 px-4 py-2 text-[12px] smallcaps">
          <li>
            <Link
              href="/"
              className="border-b-2 border-accent pb-0.5 font-bold text-accent"
            >
              1면
            </Link>
          </li>
          {SECTIONS.map((s) => (
            <li key={s}>
              <span className="link-underline cursor-default text-muted">
                {s}
              </span>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};
