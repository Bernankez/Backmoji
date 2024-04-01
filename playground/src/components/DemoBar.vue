<script setup lang="ts">
import { ref } from "vue";

const props = withDefaults(defineProps<{
  defaultValue?: boolean;
}>(), {
  defaultValue: undefined,
});

const collasped = ref(props.defaultValue ?? true);
</script>

<template>
  <div class="mt-4 flex justify-end">
    <div role="button" class="flex select-none items-center gap-1 rounded-md p-1 transition active:bg-orange-100" :class="[collasped ? 'hover:bg-orange-50' : 'bg-orange-100']" @click="collasped = !collasped">
      <div class="i-tabler:code"></div>
      Code
    </div>
  </div>
  <slot v-if="!collasped"></slot>
</template>
