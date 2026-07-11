import { neon } from "@neondatabase/serverless";
import type { Article, Section } from "./articles";

/**
 * Neon(Postgres) 연결. DATABASE_URL은 Vercel의 Neon 통합이 자동 주입한다.
 * 키가 없으면(예: 로컬/빌드 시 미설정) 조회 측에서 graceful하게 빈 배열로 폴백한다.
 */
function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL 환경변수가 설정되지 않았습니다.");
  return neon(url);
}

/** articles 테이블이 없으면 생성한다 (idempotent). cron 최초 호출 시 자동 실행. */
export async function ensureSchema(): Promise<void> {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS articles (
      slug          TEXT PRIMARY KEY,
      kicker        TEXT NOT NULL,
      section       TEXT NOT NULL,
      headline      TEXT NOT NULL,
      deck          TEXT NOT NULL,
      byline        TEXT NOT NULL,
      dateline      TEXT NOT NULL,
      publish_date  DATE NOT NULL,
      read_minutes  INTEGER NOT NULL,
      body          JSONB NOT NULL,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_articles_publish_date ON articles (publish_date)`;
}

type ArticleRow = {
  slug: string;
  kicker: string;
  section: string;
  headline: string;
  deck: string;
  byline: string;
  dateline: string;
  publish_date: string;
  read_minutes: number;
  body: string[];
  created_at: string;
};

function rowToArticle(r: ArticleRow): Article {
  return {
    slug: r.slug,
    kicker: r.kicker,
    section: r.section as Section,
    headline: r.headline,
    deck: r.deck,
    byline: r.byline,
    dateline: r.dateline,
    publishDate: r.publish_date,
    readMinutes: r.read_minutes,
    body: r.body,
    createdAt: r.created_at,
  };
}

/** 발행일이 today 이하인 AI 생성 기사들을 최신순으로 반환. 실패 시 빈 배열. */
export async function getGeneratedArticles(today: string): Promise<Article[]> {
  try {
    const sql = getSql();
    const rows = (await sql`
      SELECT slug, kicker, section, headline, deck, byline, dateline,
             to_char(publish_date, 'YYYY-MM-DD') AS publish_date,
             read_minutes, body,
             to_char(created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS created_at
      FROM articles
      WHERE publish_date <= ${today}
      ORDER BY created_at DESC
    `) as ArticleRow[];
    return rows.map(rowToArticle);
  } catch (err) {
    console.error("[db] getGeneratedArticles 실패, 정적 기사만 노출:", err);
    return [];
  }
}

/** AI가 생성한 기사를 저장한다. 같은 slug면 무시. */
export async function insertArticle(a: Article): Promise<void> {
  const sql = getSql();
  await sql`
    INSERT INTO articles
      (slug, kicker, section, headline, deck, byline, dateline, publish_date, read_minutes, body)
    VALUES
      (${a.slug}, ${a.kicker}, ${a.section}, ${a.headline}, ${a.deck},
       ${a.byline}, ${a.dateline}, ${a.publishDate}, ${a.readMinutes},
       ${JSON.stringify(a.body)})
    ON CONFLICT (slug) DO NOTHING
  `;
}
