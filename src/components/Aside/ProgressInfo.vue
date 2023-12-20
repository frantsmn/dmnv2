<script lang="ts" setup>
import {computed} from 'vue'
import {get} from '@vueuse/core'

const props = defineProps<{
  total: number
  current: number
}>()

const progressInPercent = computed(() => Math.round(get(props.current)/get(props.total)*100 || 0))
</script>

<template>
  <div class="pt-4 pb-3 border-b border-b-emerald-900 border-opacity-50 mx-4">
    <p class="flex justify-between mb-2"><span>Прогресс</span><span class="text-gray-300 ml-1">{{props.current}} из {{props.total}} <span class="ml-1 text-gray-400">({{progressInPercent}}%)</span></span></p>
  </div>
</template>
