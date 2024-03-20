import { makeDestructurable } from "@bernankez/utils";
import { assert } from "./utils";
import { degreeToAngle, measureRectangle } from "./utils/math";

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

  function render() {
    const [actualWidth, actualHeight] = measureRectangle(canvas.width, canvas.height, degree);
    const { width, height } = _measureText("Hello, World!");
    const rowCount = _calculateColumnCount(actualHeight, height);
    const columnCount = _calculateColumnCount(actualWidth, width);
  }

  function _calculateRowCount(height: number, rowHeight: number) {
    return Math.ceil(height / (rowHeight + rowGap));
  }

  function _calculateColumnCount(width: number, columnWidth: number) {
    return Math.ceil(width / (columnWidth + columnGap));
  }

  function setTextPattern(text: string) {
    const { width, height } = _measureText(text);
    ctx.textBaseline = "top";
    ctx.save();
    ctx.rotate(getAngle());
    ctx.fillText(text, 0, 0);
  }

  return {
    canvas,
    setSize,
    setTextPattern,
    _setBackgroundColor,
    _measureText,

    getSize,
    tempSave,
  };
}
