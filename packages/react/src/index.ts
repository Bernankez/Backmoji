import type { BackmojiOptions, CreateImageRendererOptions, CreateTextRendererOptions, Renderer } from "backmoji";
import { backmoji, createImageRenderer, createTextRenderer } from "backmoji";
import { type RefObject, useEffect, useMemo, useState } from "react";

export type BackmojiResult = ReturnType<typeof backmoji>;

export function useBackmoji(canvas: RefObject<HTMLCanvasElement> | HTMLCanvasElement, renderer: Renderer | undefined, options?: BackmojiOptions, deps?: any[]) {
  const [backmojiResult, setBackmojiResult] = useState<BackmojiResult>({
    render: async () => {},
    setOptions: () => {},
    setSize: async () => {},
  });

  useEffect(() => {
    let _canvas: HTMLCanvasElement | null;
    if ("current" in canvas) {
      _canvas = canvas.current;
    } else {
      _canvas = canvas;
    }
    if (!_canvas || !renderer) {
      return;
    }

    setBackmojiResult(backmoji(_canvas, renderer, options));

    return () => {
      _canvas?.remove();
    };
  }, [canvas, renderer, ...(deps || [])]);

  return backmojiResult;
}

export function useImageLoader(img: string) {
  const [image, setImage] = useState<HTMLImageElement>();

  useEffect(() => {
    loadImage(img).then((image) => {
      setImage(image);
    });
  }, [img]);

  function loadImage(img: string) {
    return new Promise<HTMLImageElement>((resolve) => {
      const image = new Image();
      image.src = img;
      image.onload = () => {
        resolve(image);
      };
    });
  }

  return image;
}

export function useImageRenderer(img: HTMLImageElement | undefined, options?: CreateImageRendererOptions) {
  const renderer = useMemo(() => {
    if (img) {
      return createImageRenderer(img, options);
    }
  }, [img]);

  return renderer;
}

export function useTextRenderer(text: string, options?: CreateTextRendererOptions) {
  return useMemo(() => createTextRenderer(text, options), [text]);
}
