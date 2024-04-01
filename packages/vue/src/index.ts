import { type BackmojiOptions, type CreateTextRendererOptions, type Renderer, backmoji, createTextRenderer } from "backmoji";
import { type ComputedRef, type MaybeRefOrGetter, computed, toValue } from "vue";

export type BackmojiResult = ReturnType<typeof backmoji>;

export function useBackmoji(renderer: MaybeRefOrGetter<Renderer>, canvas: MaybeRefOrGetter<HTMLCanvasElement | undefined>, options?: MaybeRefOrGetter<Omit<BackmojiOptions, "canvas"> | undefined>) {
  return computed(() => {
    const _renderer = toValue(renderer);
    const _options = toValue(options);
    const _canvas = toValue(canvas);
    if (!_canvas) {
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
