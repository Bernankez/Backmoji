import { type BackmojiOptions, type CreateImageRendererOptions, type CreateTextRendererOptions, type Renderer, backmoji, createImageRenderer, createTextRenderer } from "backmoji";
import { useEffect, useMemo, useState } from "react";

export type BackmojiResult = ReturnType<typeof backmoji>;

export function useBackmoji(renderer: Renderer | null, options?: BackmojiOptions, deps?: any[]) {
  const [backmojiResult, setBackmojiResult] = useState<Partial<BackmojiResult>>({});

  useEffect(() => {
    if (!renderer) {
      return;
    }

    setBackmojiResult(backmoji(renderer, options));

    return () => {
      if (backmojiResult?.canvas) {
        backmojiResult.canvas.remove();
      }
    };
  }, [renderer, ...(deps || [])]);

  return backmojiResult;
}

export function useImageLoader(img: HTMLImageElement | string) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (typeof img === "string") {
      loadImage(img).then((image) => {
        setImage(image);
      });
    } else {
      setImage(img);
    }
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

export function useImageRenderer(img: HTMLImageElement | null, options?: CreateImageRendererOptions) {
  const renderer = useMemo(() => {
    if (img) {
      return createImageRenderer(img, options);
    }
    return null;
  }, [img]);

  return renderer;
}

export function useTextRenderer(text: string, options?: CreateTextRendererOptions) {
  return useMemo(() => createTextRenderer(text, options), [text]);
}
