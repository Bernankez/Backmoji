import { useBackmoji, useImageLoader, useImageRenderer, useTextRenderer } from "@backmoji/react";
import { useEventListener } from "ahooks";
import { useEffect, useRef } from "react";
import { animate } from "../utils/animation";
import Paw from "/paw.svg?url";

const { play, setCallback, getTimestamp, reset } = animate({
  speed: 0.3,
});

export function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const _textRenderer = useTextRenderer("🤣", {
    font: "60px Arial",
    custom({ ctx, item, renderItemWidth, renderItemHeight, rowGap, columnGap, columnCount, rowCount }) {
      for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
        let from: number, to: number;
        if (rowIndex % 2 === 0) {
          from = -2;
          to = columnCount;
        } else {
          from = 0;
          to = columnCount + 2;
        }
        for (let columnIndex = from; columnIndex < to; columnIndex++) {
          let offset = getTimestamp();
          offset = offset % (2 * (renderItemWidth + columnGap));
          const x = columnIndex * (renderItemWidth + columnGap) + (rowIndex % 2 === 0 ? 1 : -1) * offset;
          const y = rowIndex * (renderItemHeight + rowGap);
          if ((columnIndex - rowIndex) % 2 === 0) {
            ctx.fillText(item, x, y);
          }
        }
      }
    },
  });

  const img = useImageLoader(Paw);
  const imageRenderer = useImageRenderer(img, {
    custom({ ctx, item, renderItemWidth, renderItemHeight, rowGap, columnGap, columnCount, rowCount }) {
      for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
        let from: number, to: number;
        if (rowIndex % 2 === 0) {
          from = -2;
          to = columnCount;
        } else {
          from = 0;
          to = columnCount + 2;
        }
        for (let columnIndex = from; columnIndex < to; columnIndex++) {
          let offset = getTimestamp();
          offset = offset % (2 * (renderItemWidth + columnGap));
          const x = columnIndex * (renderItemWidth + columnGap) + (rowIndex % 2 === 0 ? 1 : -1) * offset;
          const y = rowIndex * (renderItemHeight + rowGap);
          if ((columnIndex - rowIndex) % 2 === 0) {
            ctx.drawImage(item, x, y, renderItemWidth, renderItemHeight);
          }
        }
      }
    },
  });

  const { render, setSize } = useBackmoji(canvasRef, imageRenderer, {
    degree: -30,
    rowGap: 40,
    columnGap: 20,
  });

  function getSize() {
    if (canvasRef.current) {
      return {
        w: canvasRef.current?.width,
        h: canvasRef.current?.height,
      };
    }
  }

  function animationCb() {
    const ctx = canvasRef.current?.getContext("2d");
    const size = getSize();
    if (size && ctx) {
      const { w, h } = size;
      ctx?.clearRect(0, 0, w, h);
      render?.();
    }
  }
  setCallback(animationCb);

  useEventListener("resize", () => {
    setSize(window.innerWidth, window.innerHeight);
    animationCb();
  });

  function setCanvasStyle(canvas: HTMLCanvasElement) {
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.zIndex = "-1";
    canvas.style.opacity = "0.2";
  }

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    setCanvasStyle(canvasRef.current);
    play();

    return () => {
      reset();
      canvasRef.current?.remove();
    };
  }, []);

  useEffect(() => {
    setSize(window.innerWidth, window.innerHeight);
    render();
  }, [render, setSize]);

  return <canvas ref={canvasRef}></canvas>;
}
