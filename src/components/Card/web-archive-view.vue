<script setup lang="ts">
import type {WebArchiveData} from '@domain'

defineProps<{
  data: WebArchiveData,
}>()
</script>

<template>
  <div v-if="data.img" class="relative basis-4/5 flex overflow-hidden">
    <div
        v-if="data.links.length"
        class="absolute text-white text-xs bg-black z-10 px-1 pt-0.5 pb-1 bg-opacity-50 rounded-br rounded-tl">
      <a
          v-if="data.links[0]"
          :href="data.links[0].href"
          class="hover:underline"
          target="_blank">
        {{ data.links[0].innerText }}
      </a>
      <template v-if="data.links.length === 2">&nbsp;-&nbsp;</template>
      <a
          v-if="data.links[1]"
          :href="data.links[1].href"
          class="hover:underline"
          target="_blank">
        {{ data.links[1].innerText }}
      </a>
    </div>
    <div class="overflow-x-auto rounded mix-blend-hard-light mb-2"
         style="direction: rtl">
      <img
          :src="`data:image/png;base64,${data.img}`"
          alt="graph"
          class="rounded max-w-none m-auto mb-0.5 h-[5.5rem] opacity-70 hover:opacity-100 transition-opacity delay-75 duration-300"
      >
    </div>
  </div>
</template>
