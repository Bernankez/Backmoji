import { makeDestructurable } from "@bernankez/utils";
import { assert } from "./utils";
import { degreeToAngle } from "./utils/math";

export interface BackmojiOptions {
  width?: number;
  height?: number;
  degree?: number;
  rowGap?: number;
  columnGap?: number;
}

export function backmoji(options?: BackmojiOptions) {
  const { width = 300, height = 150, degree = 0, rowGap = 0, columnGap = 0 } = options || {};

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  assert(ctx, "Current environment does not support 2d canvas rendering");

  canvas.width = width;
  canvas.height = height;

  function getSize() {
    const w = canvas.width;
    const h = canvas.height;
    return makeDestructurable({
      w,
      h,
    }, [w, h]);
  }

  function getAngle(deg?: number) {
    return degreeToAngle(deg ?? degree);
  }

  function _getRows(rowHeight: number) {
    const [width, height] = getSize();
    const hypotenuse = Math.sqrt(width ** 2 + height ** 2);
    const rowsHeight = hypotenuse * Math.cos(getAngle());
    const rows = Math.ceil(rowsHeight / (rowHeight + rowGap));
    return rows;
  }

  // TODO
  function _getColumns(rowIndex: number, rowHeight: number, colWidth: number) {
    const rightAngle1 = (rowIndex + 1) * rowHeight * (1 / Math.tan(getAngle()));
    const rightAngle2 = (rowIndex + 1) * rowHeight * (1 / Math.tan(getAngle(90 - degree)));
    const colsWidth = rightAngle1 + rightAngle2;
    console.log(colsWidth);
    const cols = Math.ceil(colsWidth / (colWidth + columnGap));
    console.log(cols);
    return cols;
  }

  function tempSave() {
    const [width, height] = getSize();
    const imageData = ctx.getImageData(0, 0, width, height);

    return () => {
      ctx.putImageData(imageData, 0, 0);
    };
  }

  function setSize(size: { w?: number; h?: number }) {
    let { w, h } = size;
    const [width, height] = getSize();
    w = w ?? width;
    h = h ?? height;
    const restore = tempSave();
    canvas.width = w;
    canvas.height = h;
    restore();
  }

  function _setBackgroundColor() {
    const [width, height] = getSize();
    ctx.fillStyle = "#e6e6e6";
    ctx.fillRect(0, 0, width, height);
  }

  function _measureText(text: string) {
    const metrics = ctx.measureText(text);
    const fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
    const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    return {
      width: metrics.width,
      fontHeight,
      height,
    };
  }

  function setTextPattern(text: string) {
    const { width, height } = _measureText(text);
    const rows = _getRows(height);
    ctx.textBaseline = "top";
    ctx.save();
    ctx.rotate(getAngle());
    ctx.fillText(text, 0, 0);
  }

  function renderRow(rowIndex: number) {

  }

  return {
    canvas,
    setSize,
    setTextPattern,
    _setBackgroundColor,
    _measureText,

    getSize,
    _getRows,
    _getColumns,
    tempSave,
  };
}
