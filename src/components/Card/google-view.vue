<script setup lang="ts">
import type {GoogleData} from '@domain'

defineProps<{
  data: GoogleData,
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
</template>
