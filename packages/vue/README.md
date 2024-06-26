# @backmoji/vue

> [!WARNING]
> This library is still under development, and the APIs are not stable yet.

## Install

```sh
npm install backmoji
```

## Usage

### With vanilla JavaScript

```js
import { backmoji, createImageRenderer } from "backmoji";
import JSLogo from "/javascript.png";

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

async function loadImage(url) {
  const image = new Image();
  image.src = url;
  return new Promise()((resolve) => {
    image.onload = () => resolve(image);
  });
}

async function createRenderer() {
  return createImageRenderer(await loadImage(JSLogo));
}

const { render } = backmoji(canvas, createRenderer(), {
  rowGap: 15,
  columnGap: 20,
  degree: 30,
});
render();
```

### With Vue

```vue
<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useBackmoji, useImageLoader, useImageRenderer } from "@backmoji/vue";
import VueLogo from "/vue.svg";

const canvasRef = ref<HTMLCanvasElement>();
const image = useImageLoader(VueLogo);
const renderer = useImageRenderer(image);
const { render } = useBackmoji(canvasRef, renderer, {
  rowGap: 15,
  columnGap: 20,
  degree: 30,
});
watchEffect(() => {
  render();
});
</script>

<template>
  <canvas ref="canvasRef"></canvas>
</template>
```

### With React

```tsx
import { useBackmoji, useImageLoader, useImageRenderer } from "@backmoji/react";
import { useEffect, useRef, useState } from "react";
import ReactLogo from "/react.svg";

export function WithReact() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const img = useImageLoader(ReactLogo);
  const renderer = useImageRenderer(img);
  const { render } = useBackmoji(canvasRef, renderer, {
    rowGap: 15,
    columnGap: 20,
    degree: 30,
  });

  useEffect(() => {
    if (mounted) {
      render();
    }
  }, [mounted, render]);

  return <canvas ref={canvasRef}></canvas>;
}
```

## Examples

### Render a text pattern

You can create a text pattern using `createTextRenderer` function exported by `backmoji`.
You can adjust the font and size of the text by setting `font` as shown in the code below, and you can also adjust the spacing between the texts and the rotation by setting `rowGap`, `columnGap` and `degree`.

```ts
import { backmoji, createTextRenderer } from "backmoji";

const parent = document.querySelector<HTMLDivElement>("#demo-text-pattern")!;
const canvas = document.createElement("canvas");

const renderer = createTextRenderer("Hello World!", {
  font: "30px Aria",
});
const height = 160;
const { render, setSize } = backmoji(canvas, renderer, {
  degree: -45,
  rowGap: 50,
  columnGap: 40,
});

setSize(parent.clientWidth, height);

const observer = new ResizeObserver((entries) => {
  for (const entry of entries) {
    setSize(entry.contentRect.width, height);
    render();
  }
});
observer.observe(parent);

parent.appendChild(canvas);
render();
```

Also, you can render an emoji for emoji is a type of text.

### Render an image pattern

Rendering an image is similar to rendering text. You can create an image pattern using `createImageRenderer`. `createImageRenderer` accepts an image element. Make sure the image has loaded before the first render.

```ts
import { backmoji, createImageRenderer } from "backmoji";
import JSLogo from "/javascript.png";

const canvas = document.createElement("canvas");
const parent = document.querySelector<HTMLDivElement>("#demo-image-pattern")!;

function loadImage(url: string) {
  const image = new Image();
  image.src = url;
  return new Promise<HTMLImageElement>((resolve) => {
    image.onload = () => resolve(image);
  });
}

async function createRenderer() {
  return createImageRenderer(await loadImage(JSLogo));
}

const height = 300;
const { render, setSize } = backmoji(canvas, createRenderer(), {
  degree: -30,
  rowGap: 50,
  columnGap: 60,
});

const observer = new ResizeObserver((entries) => {
  for (const entry of entries) {
    setSize(entry.contentRect.width, height);
    render();
  }
});
observer.observe(parent);

parent.appendChild(canvas);
render();
```

### With custom render function

Sometimes you may need to render patterns with special arrangements, such as a chessboard-like staggered arrangement. You can use the second parameter `options.customRender` provided by `createTextRenderer` or `createImageRenderer` to handle the rendering position yourself.

```ts
import { backmoji, createImageRenderer } from "backmoji";
import JSLogo from "/javascript.png";

const canvas = document.createElement("canvas");
const parent = document.querySelector<HTMLDivElement>("#demo-custom-pattern")!;

function loadImage(url: string) {
  const image = new Image();
  image.src = url;
  return new Promise<HTMLImageElement>((resolve) => {
    image.onload = () => resolve(image);
  });
}

async function createRenderer() {
  return createImageRenderer(await loadImage(JSLogo), {
    customRender({ ctx, item, renderItemWidth, renderItemHeight, rowGap, columnGap, columnCount, rowCount }) {
      for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
        let from: number, to: number;
        if (rowIndex % 2 === 0) {
          from = -2;
          to = columnCount;
        } else {
          from = 0;
          to = columnCount + 2;
        }
        for (let columnIndex = from; columnIndex < to; columnIndex++) {
          const x = columnIndex * (renderItemWidth + columnGap);
          const y = rowIndex * (renderItemHeight + rowGap);
          if ((columnIndex - rowIndex) % 2 === 0) {
            ctx.drawImage(item, x, y, renderItemWidth, renderItemHeight);
          }
        }
      }
    },
  });
}

const height = 300;
const { render, setSize } = backmoji(canvas, createRenderer());

const observer = new ResizeObserver((entries) => {
  for (const entry of entries) {
    setSize(entry.contentRect.width, height);
    render();
  }
});
observer.observe(parent);

parent.appendChild(canvas);
render();
```

### With animation

`backmoji` itself does not provide any animation-related functionality, but through `customRender`, you can implement your own animation functionality, just like the animated background on this website. Here is a demonstration related to animation functionality.

```ts
// animation.ts
import { isDefined } from "@bernankez/utils";
import Stats from "stats.js";

export type Fn = () => void;

export function animate(options?: {
  speed?: number;
}) {
  let { speed: _speed = 0.5 } = options || {};

  let _callback: Fn | undefined;
  let _isPlay = false;
  let _timestamp = 0;
  let _ref: number | undefined;

  const _stats = new Stats();
  _stats.showPanel(0);

  function getTimestamp() {
    return _timestamp;
  }

  function setSpeed(speed: number) {
    _speed = speed;
  }

  function setCallback(callback: Fn) {
    _callback = callback;
  }

  function toggle(play?: boolean) {
    const isPlay = isDefined(play) ? play : !_isPlay;
    if (isPlay === _isPlay) {
      return;
    }
    if (isPlay) {
      _play();
    } else {
      _pause();
    }
    _isPlay = isPlay;
  }

  function _play() {
    if (!_callback) {
      return;
    }
    _timestamp += _speed;
    _stats.begin();
    _callback();
    _stats.end();
    _ref = requestAnimationFrame(_play);
  }

  function _pause() {
    if (_ref) {
      cancelAnimationFrame(_ref);
      _ref = undefined;
    }
  }

  function _reset() {
    _timestamp = 0;
    _pause();
    _callback?.();
  }

  return {
    stat: _stats,

    getTimestamp,

    setSpeed,
    setCallback,

    toggle,
    play: _play,
    pause: _pause,
    reset: _reset,
  };
}
```

```ts
import { backmoji, createImageRenderer } from "backmoji";
import { animate } from "@/utils/animation";
import Paw from "/paw.svg";

const { play, setCallback, getTimestamp, stat } = animate({
  speed: 0.3,
});

const canvas = document.createElement("canvas");
const parent = document.querySelector<HTMLDivElement>("#demo-animation-pattern")!;

function loadImage(url: string) {
  const image = new Image();
  image.src = url;
  return new Promise<HTMLImageElement>((resolve) => {
    image.onload = () => resolve(image);
  });
}

async function createRenderer() {
  return createImageRenderer(await loadImage(Paw), {
    customRender({ ctx, item, renderItemWidth, renderItemHeight, rowGap, columnGap, columnCount, rowCount }) {
      for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
        let from: number, to: number;
        if (rowIndex % 2 === 0) {
          from = -2;
          to = columnCount;
        } else {
          from = 0;
          to = columnCount + 2;
        }
        for (let columnIndex = from; columnIndex < to; columnIndex++) {
          let offset = getTimestamp();
          offset = offset % (2 * (renderItemWidth + columnGap));
          const x = columnIndex * (renderItemWidth + columnGap) + (rowIndex % 2 === 0 ? 1 : -1) * offset;
          const y = rowIndex * (renderItemHeight + rowGap);
          if ((columnIndex - rowIndex) % 2 === 0) {
            ctx.drawImage(item, x, y, renderItemWidth, renderItemHeight);
          }
        }
      }
    },
  });
}

const height = 300;
const { render, setSize } = backmoji(canvas, createRenderer(), {
  degree: 30,
});

function animationCb() {
  const ctx = canvas.getContext("2d")!;
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  render();
}

setCallback(animationCb);

const observer = new ResizeObserver((entries) => {
  for (const entry of entries) {
    setSize(entry.contentRect.width, height);
    render();
  }
});
observer.observe(parent);

parent.appendChild(canvas);
const statDom = stat.dom;
statDom.style.position = "absolute";
statDom.style.top = "0";
statDom.style.right = "0";
statDom.style.left = "unset";
parent.appendChild(statDom);

play();
```

## Customize

You can create your own `renderer` if the provided renderers do not meet your needs. See [renderer.ts](https://github.com/Bernankez/Backmoji/blob/master/packages/core/src/renderer.ts) for more details.

## Options

### `backmoji`

```ts
declare function backmoji(canvas: Awaitable<HTMLCanvasElement>, renderer: Awaitable<Renderer>, options?: BackmojiOptions): {
  render: () => Promise<void>;
  setOptions: (options: BackmojiOptions, combine?: boolean) => void;
  /*
  * Set the size of the canvas. It handles device pixel ratio automatically.
  */
  setSize: (width: number | undefined, height: number | undefined) => Promise<void>;
};

interface BackmojiOptions {
  degree?: number;
  rowGap?: number;
  columnGap?: number;
}

type Renderer = (context: RendererContext) => void;

interface RendererContext {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  rowGap: number;
  columnGap: number;
  degree: number;
  angle: number;
  /*
  * Measure size of texts, using CanvasRenderingContext2D.measureText underhood
  */
  measureText: (text: string) => {
    width: number;
    fontHeight: number;
    height: number;
  };
  /*
  * Calculate how many items should be rendered each row
  */
  calculateRenderCount: (renderItemWidth: number, renderItemHeight: number) => number[] & {
    row: number;
    column: number;
  };
  /*
  * Calculate the translate after rotation
  */
  calculateTranslate: () => number[] & {
    x: number;
    y: number;
  };
}
```

### renderer

```ts
interface CreateTextRendererOptions {
  font?: string;
  customRender?: (context: RenderContext<string>) => void;
}
/*
* The default render function if no customRender provided
*/
declare function textRender(context: RenderContext<string>): void;
declare function createTextRenderer(text: string, options?: CreateTextRendererOptions): Renderer;
interface CreateImageRendererOptions {
  customRender?: (context: RenderContext<HTMLImageElement>) => void;
}
```

```ts
/*
* The default render function if no customRender provided
*/
declare function imageRender(context: RenderContext<HTMLImageElement>): void;
declare function createImageRenderer(img: HTMLImageElement, options?: CreateImageRendererOptions): Renderer;
```

The following image explains the meanings of various attribute values:

![options](https://github.com/Bernankez/Backmoji/assets/23058788/cba65b1c-7885-403c-b33d-730b1310e458)
