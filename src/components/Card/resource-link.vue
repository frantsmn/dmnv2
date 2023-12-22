<script setup lang="ts">
import StatusIcon from '@/components/icons/StatusIcon.vue'
import ArrowTopRightOnSquare from '@/components/icons/ArrowTopRightOnSquare.vue'
import type {Status} from '@/stores/types'
import {computed} from 'vue'

const props = defineProps<{
  title: string
  href: string
  error?: string
  status: Status | 'fail'
}>()

const classes = computed(() => ({
  'bg-red-600 rounded bg-opacity-20 -m-1 p-1': Boolean(props.error)
}))

</script>

<template>
  <div :class="classes" class="flex flex-col gap-1.5 mb-2.5 -m-1">
    <div class="flex flex-row gap-2">
      <a
          :href="href"
          class="text-indigo-400 inline-flex items-center text-sm group/link"
          target="_blank">
        <StatusIcon :status="status"/>
        <span class="leading-none">{{ title }}</span>
        <ArrowTopRightOnSquare/>
      </a>
    </div>
    <span v-if="error" class="text-red-500 font-bold text-xs inline-block">{{ error }}</span>
  </div>
</template>
