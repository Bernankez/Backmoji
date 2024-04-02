import { type BackmojiOptions, type CreateImageRendererOptions, type CreateTextRendererOptions, type Renderer, backmoji, createImageRenderer, createTextRenderer } from "backmoji";
import { type ComputedRef, type MaybeRefOrGetter, computed, onMounted, ref, toValue } from "vue";

export type BackmojiResult = ReturnType<typeof backmoji>;

export function useBackmoji(renderer: MaybeRefOrGetter<Renderer | undefined>, canvas: MaybeRefOrGetter<HTMLCanvasElement | undefined>, options?: MaybeRefOrGetter<Omit<BackmojiOptions, "canvas"> | undefined>) {
  return computed(() => {
    const _renderer = toValue(renderer);
    const _options = toValue(options);
    const _canvas = toValue(canvas);
    if (!_canvas || !_renderer) {
      return undefined;
    }
    return backmoji(_renderer, {
      ..._options,
      canvas: _canvas,
    });
  });
}

export function useTextRenderer(text: MaybeRefOrGetter<string>, options?: MaybeRefOrGetter<CreateTextRendererOptions | undefined>) {
  return computed(() => {
    const _text = toValue(text);
    const _options = toValue(options);
    return createTextRenderer(_text, _options);
  });
}

export function useImageLoader(src: MaybeRefOrGetter<string>) {
  const img = ref();

  const load = async () => {
    const _src = toValue(src);
    const _img = new Image();
    _img.src = _src;
    await new Promise((resolve) => {
      _img.onload = resolve;
    });
    img.value = _img;
  };

  onMounted(load);

  return img;
}

export function useImageRenderer(image: MaybeRefOrGetter<HTMLImageElement | undefined>, options?: MaybeRefOrGetter<CreateImageRendererOptions | undefined>) {
  return computed(() => {
    const _image = toValue(image);
    const _options = toValue(options);
    if (!_image) {
      return undefined;
    }
    return createImageRenderer(_image, _options);
  });
}
