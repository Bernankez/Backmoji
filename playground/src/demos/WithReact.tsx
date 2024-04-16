import { useBackmoji, useImageLoader, useImageRenderer } from "@backmoji/react";
import ReactLogo from "/react.svg?url";
import { useEffect, useRef, useState } from "react";
import { useResizeObserver } from "../hooks/useResizeObserver";

export function WithReact() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const img = useImageLoader(ReactLogo);
  const renderer = useImageRenderer(img);
  const { render, setSize } = useBackmoji(canvasRef, renderer, {
    rowGap: 15,
    columnGap: 30,
  });
  const divRef = useResizeObserver<HTMLDivElement>((entries) => {
    for (const entry of entries) {
      const { width, height } = entry.contentRect;
      setSize(width, height);
      render();
    }
  });

  useEffect(() => {
    if (mounted) {
      const div = divRef.current!;
      setSize(div.clientWidth, 150);
      render();
    }
  }, [mounted, render, setSize]);

  return (
    <div ref={divRef} className="rounded-md bg-orange-50">
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}
