# 🗞️ The Bbungka Times (뻥카뉴스)

매일 하나씩 말도 안 되는 거짓말 뉴스가 올라오는, 영국 정통 영자신문 감성의 **풍자 신문** 웹사이트.
자세한 기획은 [`GOAL.md`](./GOAL.md) 참고.

> ⚠️ 이 사이트의 모든 기사는 100% 지어낸 허구이며 오직 풍자·재미를 위한 것입니다.

## 개발

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # 프로덕션 빌드
```

## 기사 추가

`lib/articles.ts`의 `ARTICLES` 배열 맨 위에 다음 날짜(`publishDate`)로 항목을 추가하면
그날 자동으로 톱기사가 됩니다.

## 스택

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Vercel
