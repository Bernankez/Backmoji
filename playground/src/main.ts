import { backmoji, createTextRenderer } from "backmoji";
import "./style.css";

const renderer = createTextRenderer("👌", {
  font: "60px Arial",
  custom({ ctx, text, rowIndex, columnIndex, renderItemWidth, renderItemHeight, rowGap, columnGap }) {
    const x = columnIndex * (renderItemWidth + columnGap);
    const y = rowIndex * (renderItemHeight + rowGap);
    if ((columnIndex - rowIndex) % 2 === 0) {
      ctx.fillText(text, x, y);
    }
  },
});

const { canvas, render, setSize } = backmoji(renderer, {
  degree: 235,
  rowGap: 20,
  columnGap: 20,
});

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div id="wrapper"></div>
`;

const wrapper = document.querySelector<HTMLDivElement>("#wrapper")!;

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
