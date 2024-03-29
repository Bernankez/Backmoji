import { useEffect, useState } from "react";
import { getHighlighter } from "shiki";
import { n } from "@bernankez/utils";

export type Languages = typeof languages[number];
export type Highlighter = Awaited<ReturnType<typeof resolveHighlighter>>;

const languages = n(["js", "ts", "javascript", "typescript", "jsx", "tsx", "sh", "bash", "vue"]);

function resolveHighlighter() {
  return getHighlighter({
    themes: ["rose-pine-dawn", "rose-pine-moon"],
    langs: languages,
  });
}

export function useHighlighter() {
  const [highlighter, setHighlighter] = useState<Highlighter>();

  useEffect(() => {
    if (!highlighter) {
      resolveHighlighter().then(setHighlighter);
    }
  }, []);

  return highlighter;
}
