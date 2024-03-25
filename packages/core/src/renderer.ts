import { type Renderer } from ".";

export interface RenderContext<T> {
  ctx: CanvasRenderingContext2D;
  item: T;
  renderItemWidth: number;
  renderItemHeight: number;
  rowGap: number;
  columnGap: number;
  rowCount: number;
  columnCount: number;
  width: number;
  height: number;
  angle: number;
  degree: number;
  originX: number;
  originY: number;
}

export interface CreateTextRendererOptions {
  font?: string;
  custom?: (context: RenderContext<string>) => void;
}

export function textRender(context: RenderContext<string>) {
  const { ctx, item, renderItemWidth, renderItemHeight, rowGap, columnGap, columnCount, rowCount } = context;
  for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
    for (let columnIndex = 0; columnIndex < columnCount; columnIndex++) {
      const x = columnIndex * (renderItemWidth + columnGap);
      const y = rowIndex * (renderItemHeight + rowGap);
      ctx.fillText(item, x, y);
    }
  }
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
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    const { width: renderItemWidth, height: renderItemHeight } = measureText(text);
    const [rowCount, columnCount] = calculateRenderCount(renderItemWidth, renderItemHeight);
    const renderContext: RenderContext<string> = {
      ctx,
      item: text,
      renderItemWidth,
      renderItemHeight,
      rowGap,
      columnGap,
      rowCount,
      columnCount,
      width,
      height,
      angle,
      degree,
      originX: x,
      originY: y,
    };
    render(renderContext);
    ctx.restore();
  };
  return renderer;
}

export interface CreateImageRendererOptions {
  custom?: (context: RenderContext<HTMLImageElement>) => void;
}

export function imageRender(context: RenderContext<HTMLImageElement>) {
  const { ctx, item, renderItemWidth, renderItemHeight, rowGap, columnGap, columnCount, rowCount } = context;
  for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
    for (let columnIndex = 0; columnIndex < columnCount; columnIndex++) {
      const x = columnIndex * (renderItemWidth + columnGap);
      const y = rowIndex * (renderItemHeight + rowGap);
      ctx.drawImage(item, x, y, renderItemWidth, renderItemHeight);
    }
  }
}

export function createImageRenderer(img: HTMLImageElement, options?: CreateImageRendererOptions) {
  const { custom } = options || {};
  const render = custom ?? imageRender;
  const renderer: Renderer = (context) => {
    const { ctx, angle, width, height, rowGap, columnGap, degree, calculateTranslate, calculateRenderCount } = context;
    const { x, y } = calculateTranslate();
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    const renderItemWidth = img.width;
    const renderItemHeight = img.height;
    const [rowCount, columnCount] = calculateRenderCount(renderItemWidth, renderItemHeight);
    const renderContext: RenderContext<HTMLImageElement> = {
      ctx,
      item: img,
      renderItemWidth,
      renderItemHeight,
      rowGap,
      columnGap,
      rowCount,
      columnCount,
      width,
      height,
      angle,
      degree,
      originX: x,
      originY: y,
    };
    render(renderContext);
    ctx.restore();
  };
  return renderer;
}
