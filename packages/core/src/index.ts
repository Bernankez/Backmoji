import { makeDestructurable } from "@bernankez/utils";
import { assert } from "./utils";
import { calculateRenderCount, calculateTranslate, measureText } from "./utils/shared";
import { degreeToAngle } from "./utils/math";

export * from "./renderer";
export * from "./utils/shared";
export * from "./utils/math";

export interface BackmojiOptions {
  width?: number;
  height?: number;
  degree?: number;
  rowGap?: number;
  columnGap?: number;
}

export interface RendererContext {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  rowGap: number;
  columnGap: number;
  degree: number;
  angle: number;

  measureText: (text: string) => { width: number;fontHeight: number;height: number };
  calculateRenderCount: (renderItemWidth: number, renderItemHeight: number) => number[] & { row: number;column: number };
  calculateTranslate: () => number[] & { x: number;y: number };
}

export type Renderer = (context: RendererContext) => void;

export function backmoji(renderer: Renderer, options?: BackmojiOptions) {
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

  function setSize(size: { w?: number; h?: number }) {
    let { w, h } = size;
    const [width, height] = getSize();
    w = w ?? width;
    h = h ?? height;
    canvas.width = w;
    canvas.height = h;
  }

  function saveImageData() {
    const [width, height] = getSize();
    const imageData = ctx.getImageData(0, 0, width, height);

    return () => {
      ctx.putImageData(imageData, 0, 0);
    };
  }

  function createRendererContext(): RendererContext {
    let _degree = degree % 360;
    if (_degree < 0) {
      _degree = 360 + _degree;
    }
    const _measureText: RendererContext["measureText"] = text => measureText(ctx, text);
    const [width, height] = getSize();
    const _calculateRederCount: RendererContext["calculateRenderCount"] = (renderItemWidth, renderItemHeight) => calculateRenderCount({
      width,
      height,
      degree: _degree,
      renderItemWidth,
      renderItemHeight,
      rowGap,
      columnGap,
    });
    const _calculateTranslate = () => calculateTranslate(width, height, _degree);

    return {
      ctx,
      width,
      height,
      rowGap,
      columnGap,
      degree: _degree,
      angle: degreeToAngle(_degree),

      measureText: _measureText,
      calculateRenderCount: _calculateRederCount,
      calculateTranslate: _calculateTranslate,
    };
  }

  function render() {
    const context = createRendererContext();
    renderer(context);
  }

  return {
    canvas,
    ctx,

    render,
    setSize,
    getSize,

    saveImageData,
  };
}
