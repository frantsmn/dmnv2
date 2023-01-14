<template>
  <div class="py-4 border-b border-b-emerald-900 border-opacity-50 mx-4">
    <p class="block mb-2">Задержка между запросами</p>
    <div class="flex justify-between gap-4">

      <input
          type="range"
          min="0"
          max="5"
          v-model="delay"
          class="grow -hue-rotate-60 cursor-grab active:cursor-grabbing"
          @input="onInput"
      >
      <span>{{ delay }} сек</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {onMounted} from 'vue'
import {get, useStorage} from '@vueuse/core'

const emit = defineEmits<{
  (event: 'update:modelValue', payload: number): void;
}>()

const delay = useStorage('Settings:Delay', 1)

const onInput = () => {
  emit('update:modelValue', get(delay) * 1000)
}

onMounted(() => {
  emit('update:modelValue', get(delay) * 1000)
})
</script>
