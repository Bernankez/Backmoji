import { useBackmoji, useImageLoader, useImageRenderer } from "@backmoji/react";
import { useEffect, useRef, useState } from "react";
import ReactLogo from "/react.svg?url";

export function WithReact() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const img = useImageLoader(ReactLogo);
  const renderer = useImageRenderer(img);
  const { render } = useBackmoji(canvasRef, renderer, {
    rowGap: 15,
    columnGap: 20,
    degree: 30,
  });

  useEffect(() => {
    if (mounted) {
      render();
    }
  }, [mounted, render]);

  return <canvas ref={canvasRef}></canvas>;
}
