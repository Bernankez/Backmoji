import "./App.css";
import { useEffect, useRef } from "react";
import { useBackmoji, useImageLoader, useImageRenderer, useTextRenderer } from "@backmoji/react";
import { useEventListener } from "ahooks";
import Paw from "./assets/paw.svg";
import { animate } from "./animation";

const { play, setCallback, getTimestamp, reset } = animate();

function App() {
  const backgroundRef = useRef<HTMLDivElement>(null);

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
  const { getSize, setSize, render, canvas, ctx } = useBackmoji(imageRenderer, {
    degree: -30,
    rowGap: 40,
    columnGap: 20,
  });

  function animationCb() {
    if (getSize && ctx) {
      const { w, h } = getSize();
      ctx?.clearRect(0, 0, w, h);
      render?.();
    }
  }
  setCallback(animationCb);

  useEventListener("resize", () => {
    setSize?.(window.innerWidth, window.innerHeight);
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
    if (canvas) {
      if (backgroundRef.current) {
        backgroundRef.current.appendChild(canvas);
        setCanvasStyle(canvas);
        setSize?.(window.innerWidth, window.innerHeight);
        render?.();
        play();
      }

      return () => {
        reset();
        canvas.remove();
      };
    }
  }, [canvas]);

  return (
    <div ref={backgroundRef}>
      <section className="h-screen flex items-center justify-center">
        <h1 className="font-bold font-italic text-7xl md:text-8xl lg:text-9xl text-orange-500">
          Backmoji
        </h1>
      </section>
    </div>
  );
}

export default App;
