import { backmoji, createTextRenderer } from "backmoji";
import "./style.css";

let timestamp = 0;

const renderer = createTextRenderer("👌", {
  font: "60px Arial",
  custom({ ctx, text, renderItemWidth, renderItemHeight, rowGap, columnGap, columnCount, rowCount }) {
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      let from: number, to: number;
      if (rowIndex % 2 === 0) {
        from = -2;
        to = columnCount;
      } else {
        from = columnCount;
        to = -2;
      }
      for (let columnIndex = from; columnIndex < to; columnIndex++) {
        let offset = timestamp;
        offset = offset % (2 * (renderItemWidth + columnGap));
        // TODO
        const x = columnIndex * (renderItemWidth + columnGap) + (rowIndex % 2 === 0 ? offset : -offset);
        const y = rowIndex * (renderItemHeight + rowGap);
        if ((columnIndex - rowIndex) % 2 === 0) {
          ctx.fillText(text, x, y);
        }
      }
    }
  },
});

const { canvas, ctx, render, setSize } = backmoji(renderer, {
  degree: 340,
  rowGap: 20,
  columnGap: 20,
});

let raf: number | undefined;

function play() {
  timestamp++;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  render();
  raf = requestAnimationFrame(play);
}

function pause() {
  if (raf) {
    cancelAnimationFrame(raf);
    raf = undefined;
  }
}

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <button id="play">play</button>
  <button id="pause">pause</button>
  <div id="wrapper"></div>
`;

const wrapper = document.querySelector<HTMLDivElement>("#wrapper")!;
const playButton = document.querySelector<HTMLButtonElement>("#play")!;
const pauseButton = document.querySelector<HTMLButtonElement>("#pause")!;
playButton.addEventListener("click", play);
pauseButton.addEventListener("click", pause);

function updateSize() {
  const { width, height } = getComputedStyle(wrapper);
  const w = Number(width.slice(0, -2));
  const h = Number(height.slice(0, -2));
  setSize({ w, h });
  render();
}

updateSize();

window.addEventListener("resize", updateSize);

wrapper.appendChild(canvas);
