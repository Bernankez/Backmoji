import type { Renderer } from ".";

export interface CreateTextRendererOptions {
  font?: string;
  custom?: (context: RenderContext) => void;
}

export interface RenderContext {
  ctx: CanvasRenderingContext2D;
  text: string;
  rowIndex: number;
  columnIndex: number;
  renderItemWidth: number;
  renderItemHeight: number;
  rowGap: number;
  columnGap: number;
  rowCount: number;
  columnCount: number;
  width: number;
  height: number;
}

export function textRender(context: RenderContext) {
  const { ctx, text, rowIndex, columnIndex, renderItemWidth, renderItemHeight, rowGap, columnGap } = context;
  const x = columnIndex * (renderItemWidth + columnGap);
  const y = rowIndex * (renderItemHeight + rowGap);
  ctx.fillText(text, x, y);
}

export function createTextRenderer(text: string, options?: CreateTextRendererOptions) {
  const { font, custom } = options || {};
  const render = custom ?? textRender;
  const renderer: Renderer = (context) => {
    const { ctx, rowGap, columnGap, measureText, degree, angle, calculateRenderCount, calculateTranslate, width, height } = context;
    if (font) {
      ctx.font = font;
    }
    ctx.textBaseline = "top";
    const { x, y } = calculateTranslate();
    ctx.translate(x, y);
    ctx.rotate(angle);
    const { width: renderItemWidth, height: renderItemHeight } = measureText(text);
    const [rowCount, columnCount] = calculateRenderCount(renderItemWidth, renderItemHeight);
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      for (let columnIndex = 0; columnIndex < columnCount; columnIndex++) {
        const renderContext: RenderContext = {
          ctx,
          text,
          rowIndex,
          columnIndex,
          renderItemWidth,
          renderItemHeight,
          rowGap,
          columnGap,
          rowCount,
          columnCount,
          width,
          height,
        };
        render(renderContext);
      }
    }
  };
  return renderer;
}
