<script lang="ts" setup>
import {ref} from 'vue'

defineEmits<{
  (event: 'update:modelValue', payload: boolean): void;
}>()

const props = defineProps<{
  modelValue: boolean,
  id: string,
}>()

const checked = ref(props.modelValue)
</script>

<template>
  <div class="flex items-center my-1">
    <input
        :id="id"
        v-model="checked"
        class="cursor-pointer -hue-rotate-60 w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 dark:focus:ring-emerald-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        type="checkbox"
        @change="$emit('update:modelValue', checked)">
    <label
        :for="id"
        class="cursor-pointer ml-2 text-sm text-gray-300">
      <slot>
        Title
      </slot>
    </label>
  </div>
</template>
