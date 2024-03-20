import { backmoji } from "backmoji";
import { measureRectangle } from "../../packages/core/src/utils/math";
import "./style.css";

const { canvas, setSize, _setBackgroundColor, setTextPattern, _getRows, _getColumns, _measureText } = backmoji({
  degree: 45,
});

const { w, h } = measureRectangle(1, 1, 45);
console.log(w, h);

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div id="wrapper"></div>
`;

const wrapper = document.querySelector<HTMLDivElement>("#wrapper")!;

function updateSize() {
  const { width, height } = getComputedStyle(wrapper);
  const w = Number(width.slice(0, -2));
  const h = Number(height.slice(0, -2));
  setSize({ w, h });
  // setBackgroundColor();
  setTextPattern("Testingasdfasdfasdlk");
  const { width: w1, height: h1 } = _measureText("T");
  console.log(w1, h1);
  console.log(_getRows(h1), _getColumns(10, h1, w1));
}

updateSize();

window.addEventListener("resize", updateSize);

wrapper.appendChild(canvas);
