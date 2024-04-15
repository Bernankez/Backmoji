import type { Awaitable } from "@bernankez/utils";
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

export function backmoji(canvas: Awaitable<HTMLCanvasElement>, renderer: Awaitable<Renderer>, options?: BackmojiOptions) {
  let _options: BackmojiOptions = options || {};

  async function createRendererContext() {
    const _canvas = await canvas;
    const ctx = _canvas.getContext("2d");
    assert(ctx, "Current environment does not support 2d canvas rendering");
    const { width = 300, height = 150, degree = 0, rowGap = 0, columnGap = 0 } = _options || {};
    let _degree = degree % 360;
    if (_degree < 0) {
      _degree = 360 + _degree;
    }
    const _measureText: RendererContext["measureText"] = text => measureText(ctx, text);
    const _calculateRenderCount: RendererContext["calculateRenderCount"] = (renderItemWidth, renderItemHeight) => calculateRenderCount({
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
      calculateRenderCount: _calculateRenderCount,
      calculateTranslate: _calculateTranslate,
    };
  }

  async function render() {
    const _renderer = await renderer;
    const context = await createRendererContext();
    _renderer(context);
  }

  function setOptions(options: BackmojiOptions, combine = true) {
    if (combine) {
      Object.assign(_options, options);
    } else {
      _options = options;
    }
  }

  return {
    render,

    setOptions,
  };
}
