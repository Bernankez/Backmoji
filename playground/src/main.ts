import { backmoji, createTextRenderer } from "backmoji";
import "./style.css";
import { Animate } from "./animation";

const animate = new Animate(true);

const renderer = createTextRenderer("🤣", {
  font: "60px Arial",
  custom({ ctx, text, renderItemWidth, renderItemHeight, rowGap, columnGap, columnCount, rowCount }) {
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
          ctx.fillText(text, x, y);
        }
      }
    }
  },
});

const { canvas, ctx, render, setSize, getSize } = backmoji(renderer, {
  degree: -20,
  rowGap: 20,
  columnGap: 20,
});

function cb() {
  const [w, h] = getSize();
  ctx.clearRect(0, 0, w, h);
  render();
}

animate.setCallback(cb);

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <button id="play">play</button>
  <button id="pause">pause</button>
  <button id="reset">reset</button>
  <div id="wrapper"></div>
`;

const wrapper = document.querySelector<HTMLDivElement>("#wrapper")!;
const playButton = document.querySelector<HTMLButtonElement>("#play")!;
const pauseButton = document.querySelector<HTMLButtonElement>("#pause")!;
const resetButton = document.querySelector<HTMLButtonElement>("#reset")!;
playButton.addEventListener("click", animate.play.bind(animate));
pauseButton.addEventListener("click", animate.pause.bind(animate));
resetButton.addEventListener("click", animate.reset.bind(animate));

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
