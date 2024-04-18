import { type BackmojiOptions, type CreateImageRendererOptions, type CreateTextRendererOptions, type Renderer, backmoji, createImageRenderer, createTextRenderer } from "backmoji";
import { type MaybeRefOrGetter, computed, onMounted, ref, toValue } from "vue-demi";

export type BackmojiResult = ReturnType<typeof backmoji>;

export function useBackmoji(canvas: MaybeRefOrGetter<HTMLCanvasElement | undefined>, renderer: MaybeRefOrGetter<Renderer | undefined>, options?: MaybeRefOrGetter<Omit<BackmojiOptions, "canvas"> | undefined>) {
  const backmojiResult = computed(() => {
    const _renderer = toValue(renderer);
    const _options = toValue(options);
    const _canvas = toValue(canvas);
    if (!_canvas || !_renderer) {
      return undefined;
    }
    return backmoji(_canvas, _renderer, {
      ..._options,
    });
  });

  function render() {
    if (backmojiResult.value) {
      return backmojiResult.value.render();
    }
    return Promise.resolve();
  }

  function setOptions(options: BackmojiOptions, combine?: boolean) {
    if (backmojiResult.value) {
      backmojiResult.value.setOptions(options, combine);
    }
  }

  function setSize(width: number | undefined, height: number | undefined) {
    if (backmojiResult.value) {
      return backmojiResult.value.setSize(width, height);
    }
    return Promise.resolve();
  }

  return {
    render,

    setOptions,
    setSize,
  };
}

export function useImageLoader(src: MaybeRefOrGetter<string>) {
  const img = ref<HTMLImageElement>();

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

export function useTextRenderer(text: MaybeRefOrGetter<string>, options?: MaybeRefOrGetter<CreateTextRendererOptions | undefined>) {
  return computed(() => {
    const _text = toValue(text);
    const _options = toValue(options);
    return createTextRenderer(_text, _options);
  });
}
