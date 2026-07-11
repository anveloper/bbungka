export const SiteFooter = () => {
  return (
    <footer className="mt-16 border-t-2 border-rule">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="rule-double" />
        <div className="mt-6 grid gap-6 text-[13px] leading-relaxed text-muted sm:grid-cols-3">
          <div>
            <h4 className="mb-1 font-display text-base font-bold text-ink">
              The Bbungka Times
            </h4>
            <p>
              1897년 창간(했다고 우기는) 대한민국 대표 허구 신문. 편집국은 어젯밤
              꿈속에 위치해 있습니다.
            </p>
          </div>
          <div>
            <h4 className="mb-1 smallcaps text-ink">알려드립니다</h4>
            <p>
              본지의 모든 기사·인물·통계·발언은 <strong>100% 지어낸 허구</strong>
              이며 오직 풍자와 재미를 위한 것입니다. 실제 사건·단체·인물과
              무관하며, 사실로 받아들이지 마세요.
            </p>
          </div>
          <div>
            <h4 className="mb-1 smallcaps text-ink">발행 정보</h4>
            <p>
              매일 자정(KST) 새 기사가 한 편씩 지면에 오릅니다. 구독료는
              평생 무료, 환불도 무제한입니다.
            </p>
          </div>
        </div>
        <p className="mt-6 text-center text-[11px] text-muted smallcaps">
          © The Bbungka Times · 이 문장까지 전부 거짓말입니다
        </p>
      </div>
    </footer>
  );
};
