import { backmoji, createTextRenderer } from "backmoji";
import "./style.css";

let timestamp = 0;

const renderer = createTextRenderer("👌", {
  font: "60px Arial",
  custom({ ctx, text, rowIndex, columnIndex, renderItemWidth, renderItemHeight, rowGap, columnGap, width }) {
    // TODO render with animation
    let offset = timestamp;
    const w = renderItemWidth + columnGap;
    if (offset > 2 * w) {
      offset = offset % (2 * w);
    }
    const x = columnIndex * (renderItemWidth + columnGap) + offset;
    const y = rowIndex * (renderItemHeight + rowGap);
    // Render twice
    // if (x > width) {
    //   y = y + renderItemHeight + rowGap;
    // }
    if ((columnIndex - rowIndex) % 2 === 0) {
      ctx.fillText(text, x, y);
      if (x > width) {
        let newY = y;
        if ((x > width - renderItemWidth) && y % 2 === 0) {
          newY = y + renderItemHeight + rowGap;
        }
        ctx.fillText(text, x - width + columnGap - renderItemWidth, newY);
      }
    }
  },
});

const { canvas, ctx, render, setSize } = backmoji(renderer, {
  degree: 0,
  rowGap: 20,
  columnGap: 20,
});

let raf = 0;

function play() {
  timestamp++;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  render();
  raf = requestAnimationFrame(play);
}

function pause() {
  if (raf) {
    cancelAnimationFrame(raf);
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
