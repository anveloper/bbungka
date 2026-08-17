import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { generateText, Output } from "ai";
import { createGoogle } from "@ai-sdk/google";
import { z } from "zod";

// 사용자가 넣은 GEMINI_AI_API_KEY 또는 표준 GOOGLE_GENERATIVE_AI_API_KEY 둘 다 지원
function getApiKey(): string | undefined {
  return (
    process.env.GEMINI_AI_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    process.env.GOOGLE_API_KEY
  );
}
import { todayKST, type Article } from "@/lib/articles";
import { ensureSchema, insertArticle } from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Gemini가 생성할 창작 필드만 정의 (slug·날짜·읽기시간은 서버가 계산)
const genSchema = z.object({
  kicker: z
    .string()
    .describe("짧은 라벨. 예: 단독, 속보, 긴급, 화제, 국제, 정책 중 하나"),
  section: z.enum([
    "정치",
    "국제",
    "사회",
    "경제",
    "과학",
    "문화",
    "스포츠",
  ]),
  headline: z
    .string()
    .describe("말도 안 되지만 진지한 신문 헤드라인. 15~30자, 따옴표 남발 금지"),
  deck: z.string().describe("부제 한 줄. 헤드라인을 능청스럽게 보충"),
  byline: z
    .string()
    .describe("기자명. 'OO부 홍길동 기자' 형식, 이름은 소재와 얽힌 말장난"),
  dateline: z.string().describe("취재 발신 지역. 예: 서울, 세종, 제네바, 부산"),
  body: z
    .array(z.string())
    .min(3)
    .max(5)
    .describe("본문 문단 3~5개. 각 문단 2~4문장, 능청스럽고 진지한 보도체"),
});

const SYSTEM = `너는 풍자 신문 'The Bbungka Times(뻥카뉴스)'의 기사 생성기다.
- 100% 허구인, 말도 안 되게 웃긴 가짜 뉴스 기사를 정통 신문 보도체로 써라.
- 톤: 진지하고 담백한 신문 문체 + 완전히 허무맹랑한 내용의 낙차에서 오는 유머.
- 소재는 일상적이고 사소한 것을 크게 부풀리는 방식(예: 요일 폐지, 중력 점검, 비둘기 노조).
- 실제 정치인·연예인 등 실존 인물의 실명, 실제 기업·기관명, 특정 개인 비방, 혐오·차별·성적·폭력적 내용은 절대 쓰지 말 것.
- 인용문은 익명 관계자/전문가/시민 위주로. 모든 내용은 명백한 농담이어야 한다.
- 한국어로만 작성.`;

// 소재 다양성을 위한 회전 힌트
const TOPIC_HINTS = [
  "교통·출퇴근",
  "음식·식당",
  "날씨·계절",
  "동물·반려",
  "가전·기술",
  "행정·세금",
  "우주·과학",
  "스포츠·운동",
  "쇼핑·구독경제",
  "잠·휴식",
  "도시·건물",
  "교육·시험",
];

function authorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

async function handle(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    return NextResponse.json(
      { error: "Gemini API 키 미설정 (GEMINI_AI_API_KEY)" },
      { status: 500 },
    );
  }

  try {
    await ensureSchema();

    const google = createGoogle({ apiKey });
    const now = new Date();
    // 하루 1회 생성이므로 '일' 단위로 힌트를 회전시킨다 (12일 주기)
    const dayIndex = Math.floor(now.getTime() / 86_400_000);
    const hint = TOPIC_HINTS[dayIndex % TOPIC_HINTS.length];

    const { output } = await generateText({
      model: google(process.env.GEMINI_MODEL ?? "gemini-flash-latest"),
      temperature: 1,
      system: SYSTEM,
      prompt: `'${hint}' 분야에서 예상치 못한 소재를 하나 골라, 뻥카뉴스 기사 한 편을 만들어줘. 앞선 기사들과 겹치지 않게 참신하게.`,
      output: Output.object({ schema: genSchema }),
    });

    const createdAt = now.toISOString();
    const bodyLen = output.body.join("").length;
    const article: Article = {
      slug: `gen-${now.getTime()}`,
      kicker: output.kicker,
      section: output.section,
      headline: output.headline,
      deck: output.deck,
      byline: output.byline,
      dateline: output.dateline,
      publishDate: todayKST(),
      readMinutes: Math.max(2, Math.round(bodyLen / 350)),
      body: output.body,
      createdAt,
    };

    await insertArticle(article);
    revalidatePath("/");

    return NextResponse.json({ ok: true, article });
  } catch (err) {
    console.error("[cron/generate] 실패:", err);
    return NextResponse.json(
      { error: "생성 실패", detail: String(err) },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  return handle(req);
}

// Vercel Cron은 GET으로 호출하며 CRON_SECRET을 Bearer로 실어 보낸다
export async function GET(req: Request) {
  return handle(req);
}
