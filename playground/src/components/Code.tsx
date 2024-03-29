import { useMemo } from "react";
import { type Languages, useHighlighter } from "../hooks/useHighlighter";

export interface CodeProps {
  code?: string;
  children?: React.ReactNode;
  lang: Languages;
}

export function Code({ code, lang, children }: CodeProps) {
  const highlighter = useHighlighter();
  const _code = code || children?.toString().trim();

  const highlightCode = useMemo(() => {
    if (!_code) {
      return "";
    }
    if (!highlighter) {
      return _code;
    }
    return highlighter.codeToHtml(_code, {
      lang,
      themes: {
        light: "rose-pine-dawn",
        dark: "rose-pine-moon",
      },
    });
  }, [_code, lang, highlighter]);

  return <div className="box-border overflow-hidden rounded-lg p-2" dangerouslySetInnerHTML={{ __html: highlightCode }}></div>;
}
