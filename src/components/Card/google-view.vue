<script setup lang="ts">
import type {GoogleData} from '@domain'
import type {Status} from '@/stores/types'

defineProps<{
  data: GoogleData,
  status: Status
}>()
</script>

<template>
  <div>
    <p class="text-emerald-400 mb-2">{{ data.amountStr }}</p>
    <div class="columns-3" style="column-gap: 10%">
      <ul class="list-decimal px-[1em] text-sm">
        <li
            v-for="(link, index) in data.links"
            :key="index"
        >
          <a
              :href="link.href"
              class="hover:underline"
              target="_blank">{{ link.innerText }}</a>
        </li>
      </ul>
    </div>
  </div>
  <div v-if="status === 'fetching'" class="w-full">
    <div class="animate-pulse flex gap-4">
      <div class="rounded bg-white bg-opacity-[0.05] h-[40px] w-1/3"></div>
      <div class="rounded bg-white bg-opacity-[0.05] h-[40px] w-1/3"></div>
      <div class="rounded bg-white bg-opacity-[0.05] h-[40px] w-1/3"></div>
    </div>
  </div>
</template>
