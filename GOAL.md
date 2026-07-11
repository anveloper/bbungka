# 🗞️ The Bbungka Times (뻥카뉴스) — GOAL

> 바이브 코딩 대회 출품작 · 목표: **3시간 안에 완성 → Vercel 배포**

## 한 줄 요약

매일 하나씩 **말도 안 되는 거짓말 뉴스**가 올라오는, 영국 정통 영자신문(The Times) 감성의 **풍자 신문** 웹사이트.

---

## 콘셉트

- **이름**: The Bbungka Times / 뻥카뉴스
- **슬로건**: _"All The News That's Unfit To Believe"_ (믿기엔 부적합한 모든 뉴스)
- **톤**: 진지한 신문 레이아웃 + 완전히 허무맹랑한 내용의 낙차에서 오는 유머
- **원칙**: 모든 기사는 **100% 허구**. 사이트 곳곳(기사 하단·푸터)에 풍자임을 명시해 오해·허위정보 문제를 차단.

## 디자인 방향 (완료)

- **폰트**: 제호·헤드라인 `Playfair Display`(900), 본문 `PT Serif` — 정통 세리프 신문체
- **색**: 크림색 신문 지질(`#f5f1e8`) + 잉크 블랙(`#1a1712`) + 포인트 딥레드(`#7a1f1f`)
- **레이아웃**: 중앙 정렬 제호 + 이중 괘선(rule) + 다단(multi-column) 편집 + 세로 컬럼 구분선
- **디테일**: 종이 질감 그레인, 드롭캡(기사 첫 글자), 소형 대문자(small-caps) 라벨, 발신지/기자명

## 핵심 동작 — "하루에 하나씩"

- 별도 서버·DB·크론 없이 **날짜 게이팅**으로 구현.
- 각 기사에 `publishDate`(KST)가 있고, **오늘 이하**인 기사만 지면에 노출.
- 미리 써둔 기사들이 매일 자정마다 자동으로 한 편씩 "인쇄"됨.
- 페이지는 `revalidate = 3600`(1시간)으로 재생성 → 날짜가 바뀌면 새 톱기사 등장.

## 기술 스택

| 항목       | 선택                                    |
| ---------- | --------------------------------------- |
| 프레임워크 | Next.js 16 (App Router, Turbopack)      |
| 언어       | TypeScript (strict)                     |
| 스타일     | Tailwind CSS v4                         |
| 폰트       | `next/font/google` (Playfair, PT Serif) |
| 배포       | Vercel                                  |
| 패키지     | pnpm                                    |

## 파일 구조

```
app/
  layout.tsx              # 폰트·메타데이터
  page.tsx                # 1면 (톱기사 + 다단 편집)
  article/[slug]/page.tsx # 기사 전문 (드롭캡·관련기사)
  globals.css             # 신문 디자인 시스템
components/
  masthead.tsx            # 제호·날짜·섹션 내비
  article-card.tsx        # 기사 카드 (default/compact)
  site-footer.tsx         # 푸터 + 허구 고지
lib/
  articles.ts            # 기사 데이터 + 날짜 게이팅 로직
```

## 완료 기준 (Definition of Done)

- [x] 타임즈풍 세리프 디자인 + 다단 1면
- [x] 기사 상세 페이지(드롭캡·정렬 본문·면책 문구)
- [x] "하루 하나" 날짜 게이팅 로직 + 미래 기사 숨김
- [x] `pnpm build` 성공, 콘솔 에러 없음
- [x] 풍자/허구 고지 명시
- [ ] GitHub 레포 생성 (`gh`)
- [ ] Vercel 프로덕션 배포

## 앞으로 기사 추가하는 법

`lib/articles.ts`의 `ARTICLES` 배열 **맨 위**에 다음 날짜(`publishDate`)로 새 항목을 추가하기만 하면 됩니다. 그날이 오면 자동으로 톱기사가 됩니다.

```ts
{
  slug: "unique-slug",
  kicker: "단독",
  section: "사회",
  headline: "말도 안 되는 헤드라인",
  deck: "부제 한 줄",
  byline: "OO부 홍길동 기자",
  dateline: "서울",
  publishDate: "2026-07-12", // 이 날짜부터 노출
  readMinutes: 3,
  body: ["첫 문단(드롭캡)…", "둘째 문단…"],
}
```

> (선택) 완전 자동화를 원하면, GitHub Actions나 Vercel Cron으로 매일 AI가 기사 1건을 생성해 커밋하도록 확장할 수 있습니다.
