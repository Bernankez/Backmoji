import { type BackmojiOptions, type CreateImageRendererOptions, type CreateTextRendererOptions, type Renderer, backmoji, createImageRenderer, createTextRenderer } from "backmoji";
import { useEffect, useState } from "react";

export type BackmojiReturn = ReturnType<typeof backmoji>;

export function useBackmoji(renderer?: Renderer, options?: BackmojiOptions) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (isMounted && renderer) ? backmoji(renderer, options) : undefined;
}

export function useImageRenderer(img: HTMLImageElement | string, options?: CreateImageRendererOptions) {
  const [image, setImage] = useState<HTMLImageElement>();

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

  return image ? createImageRenderer(image, options) : undefined;
}

export function useTextRenderer(text: string, options?: CreateTextRendererOptions) {
  return createTextRenderer(text, options);
}
