<script lang="ts" setup>
import {get, set, useStorage} from '@vueuse/core'
import {onMounted, ref} from 'vue'

defineProps<{
  id: string
  disabled?: boolean
  domains?: string[]
}>()

const emit = defineEmits<{
  (event: 'update:domains', payload: string[]): void;
}>()

const text = ref<string>('')
const onInput = () => emit('update:domains', get(text).split('\n').filter(Boolean))

onMounted(() => {
  const domains = useStorage<string[]>('Main:Domains', [])

  if (!get(domains).length) {
    return
  }
  set(text, get(domains)?.toString().replaceAll(',', '\n'))
  emit('update:domains', get(domains))
})
</script>

<template>
  <div class="py-4 border-b border-b-emerald-900 border-opacity-50 mx-4">
    <label class="block mb-2" for="message">Список доменов для проверки</label>
    <textarea
        :id="id"
        @input="onInput"
        v-model="text"
        :disabled="disabled"
        class="block p-2 mb-2 w-full text-sm text-gray-200 rounded bg-emerald-400 bg-opacity-20 border border-emerald-900 border-opacity-50 placeholder-gray-400 focus:outline-0 focus:border-emerald-400"
        placeholder="example.com"
        rows="10"></textarea>
    <slot></slot>
  </div>
</template>
