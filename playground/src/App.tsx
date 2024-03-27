import "./App.css";
import { useEffect, useRef, useState } from "react";
import { useBackmoji, useImageRenderer, useTextRenderer } from "@backmoji/react";
import Paw from "./assets/paw.svg";
import { Animate } from "./animation";

const animate = new Animate(true);

function App() {
  const textRenderer = useTextRenderer("😯", {
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
          let offset = animate.timestamp;
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
  const imageRenderer = useImageRenderer(Paw, {
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
          let offset = animate.timestamp;
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
  const backmojiReturn = useBackmoji(textRenderer, {
    degree: -30,
    rowGap: 40,
    columnGap: 20,
  });
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (backmojiReturn) {
      const { canvas, setSize, getSize, ctx, render } = backmojiReturn;
      function cb() {
        const [w, h] = getSize();
        ctx.clearRect(0, 0, w, h);
        render();
      }

      animate.setCallback(cb);
      render();
      backgroundRef.current?.appendChild(canvas);

      return () => {
        backgroundRef.current?.removeChild(canvas);
      };
    }
  }, [backmojiReturn]);

  return (
    <div ref={backgroundRef}>
      <section className="h-screen flex items-center justify-center">
        <h1 className="font-bold text-7xl md:text-8xl lg:text-9xl text-orange-500">
          Backmoji
        </h1>
        <button onClick={animate.play.bind(animate)}>play</button>
        <button onClick={animate.pause.bind(animate)}>pause</button>
        <button onClick={animate.reset.bind(animate)}>reset</button>
      </section>
    </div>
  );
}

export default App;
