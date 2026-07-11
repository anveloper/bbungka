"use client";

import { useEffect, useState } from "react";

// 조간판(라이트) ↔ 야간판(다크) 전환. 선택값은 localStorage에 저장.
export const ThemeToggle = () => {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.dataset.theme === "dark");
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "조간판(밝게)으로 전환" : "야간판(어둡게)으로 전환"}
      className="smallcaps inline-flex items-center gap-1 text-[11px] text-muted transition-colors hover:text-accent"
    >
      <span aria-hidden>{dark ? "☀" : "☾"}</span>
      <span>{dark ? "조간판" : "야간판"}</span>
    </button>
  );
};
