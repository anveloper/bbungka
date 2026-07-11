import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="smallcaps mb-4 text-[12px] text-accent">호외 · 정정보도</div>
      <div className="font-display text-[7rem] font-black leading-none text-ink sm:text-[10rem]">
        404
      </div>
      <h1 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
        이 기사는 인쇄되지 않았습니다
      </h1>
      <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">
        찾으시는 지면이 없거나, 아직 편집국의 상상력이 미치지 못한
        거짓말입니다. 내일 다시 와 보시면 있을지도 모릅니다.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block border-b border-ink pb-0.5 text-[13px] text-ink smallcaps hover:border-accent hover:text-accent"
      >
        ← 1면으로 돌아가기
      </Link>
    </div>
  );
}
