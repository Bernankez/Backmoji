import { useBackmoji, useImageLoader, useImageRenderer } from "@backmoji/react";
import ReactLogo from "/react.svg?url";
import { useEffect, useRef } from "react";
import { useLatest } from "ahooks";
import { useResizeObserver } from "../hooks/useResizeObserver";

export function WithReact() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const img = useImageLoader(ReactLogo);
  const renderer = useImageRenderer(img);
  const backmojiResult = useBackmoji(renderer, canvasRef, {
    height: 150,
    rowGap: 15,
    columnGap: 30,
  });
  const { render, canvas, setSize } = useLatest(backmojiResult).current;
  const divRef = useResizeObserver<HTMLDivElement>((entries) => {
    for (const entry of entries) {
      const { width, height } = entry.contentRect;
      setSize?.(width, height);
      render?.();
    }
  });

  useEffect(() => {
    if (canvas) {
      setSize?.(divRef.current?.clientWidth, divRef.current?.clientHeight);
      render?.();

      return () => {
        canvas.remove();
      };
    }
  }, [canvas]);

  return (
    <div ref={divRef}>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}
