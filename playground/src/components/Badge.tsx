import type React from "react";
import { useMemo } from "react";
import { clsx } from "clsx";
import { version } from "~/package.json";

export interface BadgeProps {
  type: "npm" | "github";
  children?: React.ReactNode;
}

// @unocss-include
export function Badge({ type, children }: BadgeProps) {
  const icon = useMemo(() => {
    switch (type) {
      case "npm":
        return "i-tabler:brand-npm text-2xl";
      default:
        return "i-tabler:brand-github text-xl";
    }
  }, [type]);

  const link = useMemo(() => {
    switch (type) {
      case "npm":
        return "https://www.npmjs.com/package/backmoji";
      case "github":
        return "https://github.com/Bernankez/Backmoji";
      default:
        return "";
    }
  }, [type]);

  const title = useMemo(() => {
    switch (type) {
      case "npm":
        return `v${version}`;
      case "github":
        return "Backmoji";
      default:
        return "";
    }
  }, [type]);

  return (
    <div className="group w-fit select-none b-1 b-orange-500 rounded-md b-solid bg-orange-50 text-sm transition hover:bg-orange-500">
      <a className="h-full flex" href={link}>
        <div className="h-full flex items-center b-r-1 b-r-orange-500 b-r-solid px-1">
          <div className={clsx("text-orange-800 group-hover:text-white transition", icon)}></div>
        </div>
        <span className="h-full flex items-center px-1 text-orange-800 transition group-hover:text-white">{children ?? title}</span>
      </a>
    </div>
  );
}
