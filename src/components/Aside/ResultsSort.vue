<script lang="ts" setup>
import {onMounted} from 'vue'
import type {Ref} from 'vue'
import type {Sort} from '@/stores/domains'
import {get, useStorage} from '@vueuse/core'

const sort: Ref<Sort> = useStorage('Settings:Sort', 'default') as Ref<Sort>
const emit = defineEmits<{
  (event: 'update:modelValue', payload: Sort): void;
}>()

onMounted(() => emit('update:modelValue', get(sort)))
</script>

<template>
  <div class="py-4 mx-4">
    <p class="block mb-2">Сортировка</p>
    <div class="flex flex-col">
      <label class="flex gap-1.5 mb-1 align-middle cursor-pointer">
        <input
            id="sort-by-default"
            v-model="sort"
            class="cursor-pointer -hue-rotate-60 w-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 dark:focus:ring-emerald-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            name="result-sort"
            type="radio"
            value="default"
            @input="emit('update:modelValue', 'default')"
        />
        <span>по умолчанию</span>
      </label>
      <label class="flex gap-1.5 mb-1 align-middle cursor-pointer">
        <input
            id="sort-by-alphabet"
            v-model="sort"
            class="cursor-pointer -hue-rotate-60 w-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 dark:focus:ring-emerald-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            name="result-sort"
            type="radio"
            value="alphabet"
            @input="emit('update:modelValue', 'alphabet')"
        />
        <span>по алфавиту</span>
      </label>
      <label class="flex gap-1.5 mb-1 align-middle cursor-pointer">
        <input
            id="sort-by-age"
            v-model="sort"
            class="cursor-pointer -hue-rotate-60 w-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 dark:focus:ring-emerald-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            name="result-sort"
            type="radio"
            value="age"
            @input="emit('update:modelValue', 'age')"
        />
        <span>по возрасту</span>
      </label>
    </div>
  </div>
</template>
