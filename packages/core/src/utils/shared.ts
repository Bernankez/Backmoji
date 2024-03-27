import { makeDestructurable } from "@bernankez/utils";
import { degreeToAngle, measureRectangle } from "./math";

export function measureText(ctx: CanvasRenderingContext2D, text: string) {
  const metrics = ctx.measureText(text);
  const fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
  const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
  return {
    width: metrics.width,
    fontHeight,
    height,
  };
}

export function calculateRenderCount(options: {
  width: number;
  height: number;
  degree: number;
  renderItemWidth: number;
  renderItemHeight: number;
  rowGap: number;
  columnGap: number;
}) {
  const { width, height, degree, renderItemHeight, renderItemWidth, rowGap, columnGap } = options;
  const [actualWidth, actualHeight] = measureRectangle(width, height, degree);
  const row = Math.ceil(actualHeight / (renderItemHeight + rowGap));
  const column = Math.ceil(actualWidth / (renderItemWidth + columnGap));
  return makeDestructurable({
    row,
    column,
  }, [row, column]);
}

export function calculateTranslate(width: number, height: number, degree: number) {
  const angle = degreeToAngle(degree % 90);
  const hypotenuse = ((degree % 180) > 90 ? height : width) * Math.sin(angle);
  const rightSide = hypotenuse * Math.sin(angle);
  const adjacentSide = hypotenuse * Math.cos(angle);
  let x: number, y: number;
  if (degree < 90) {
    x = rightSide;
    y = -adjacentSide;
  } else if (degree < 180) {
    x = width + adjacentSide;
    y = rightSide;
  } else if (degree < 270) {
    x = width - rightSide;
    y = height + adjacentSide;
  } else {
    x = -adjacentSide;
    y = height - rightSide;
  }
  return makeDestructurable({
    x,
    y,
  }, [x, y]);
}
