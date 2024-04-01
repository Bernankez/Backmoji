<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useBackmoji, useTextRenderer } from "@backmoji/vue";
import VueLogo from "/vue.svg?url";

const canvasRef = ref<HTMLCanvasElement>();
const renderer = useTextRenderer("vue");
const backmojiResult = useBackmoji(renderer, canvasRef, {
  rowGap: 30,
  columnGap: 30,
});
watchEffect(() => {
  if (backmojiResult.value) {
    backmojiResult.value.render();
  }
});
</script>

<template>
  <canvas ref="canvasRef"></canvas>
</template>
