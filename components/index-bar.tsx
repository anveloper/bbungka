type IndexBarProps = {
  issueNo: number;
  count: number; // 오늘 발행 건수
};

type Metric = {
  label: string;
  value: string;
  delta?: string;
  dir?: "up" | "down";
};

// issueNo 기반으로 매 호마다 살짝 달라지는(결정적) 풍자 지표
export const IndexBar = ({ issueNo, count }: IndexBarProps) => {
  const bbungka = 2400 + (issueNo % 900);
  const delta = 10 + ((issueNo * 7) % 88);
  const naive = 71 + (issueNo % 24);

  const metrics: Metric[] = [
    {
      label: "뻥카지수",
      value: bbungka.toLocaleString(),
      delta: `▲ ${delta}`,
      dir: "up",
    },
    {
      label: "국민 순진도",
      value: `${naive}.${(issueNo % 9) + 1}%`,
      delta: "▲ 0.4",
      dir: "up",
    },
    { label: "오늘 발행", value: `${count}건` },
    {
      label: "진실 함유량",
      value: "0.00%",
      delta: "▼ 0.0",
      dir: "down",
    },
  ];

  return (
    <div className="border-b border-rule/50 bg-paper-2/40">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-1 px-4 py-1.5 sm:justify-between">
        {metrics.map((m) => (
          <div key={m.label} className="flex items-baseline gap-1.5">
            <span className="smallcaps text-[10px] text-muted">{m.label}</span>
            <span className="tnum text-[13px] font-bold text-ink">
              {m.value}
            </span>
            {m.delta && (
              <span
                className={`tnum text-[11px] font-bold ${
                  m.dir === "down" ? "idx-down" : "idx-up"
                }`}
              >
                {m.delta}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
