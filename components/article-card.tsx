import Link from "next/link";
import type { Article } from "@/lib/articles";

type ArticleCardProps = {
  article: Article;
  variant?: "default" | "compact";
};

export const ArticleCard = ({
  article,
  variant = "default",
}: ArticleCardProps) => {
  const isCompact = variant === "compact";

  return (
    <article className="group">
      <div className="mb-1.5 flex items-center gap-2 text-[10px] text-accent smallcaps">
        <span>{article.kicker}</span>
        <span className="text-muted">·</span>
        <span className="text-muted">{article.section}</span>
      </div>

      <Link href={`/article/${article.slug}`}>
        <h3
          className={`font-display font-bold leading-[1.15] text-ink transition-colors group-hover:text-accent ${
            isCompact ? "text-lg" : "text-2xl"
          }`}
        >
          {article.headline}
        </h3>
      </Link>

      <p
        className={`mt-1.5 italic leading-snug text-muted ${
          isCompact ? "text-sm" : "text-[15px]"
        }`}
      >
        {article.deck}
      </p>

      {!isCompact && (
        <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed text-ink/80">
          {article.body[0]}
        </p>
      )}

      <div className="mt-2 text-[11px] text-muted smallcaps">
        {article.byline} · {article.dateline}발
      </div>
    </article>
  );
};
