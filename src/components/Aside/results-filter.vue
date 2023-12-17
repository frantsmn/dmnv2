<script setup lang="ts">
import Checkbox from '@/components/shared/Checkbox.vue'
import {get, useStorage} from '@vueuse/core'
import {onMounted} from 'vue'
import type {Filter} from '@/stores/domains'

const emit = defineEmits<{
  (event: 'update:modelValue', filter: Filter): void;
}>()

const filter = useStorage('Settings:Filter', {
  isHideEmptyResults: false
})

const onUpdate = () => emit('update:modelValue', get(filter))

onMounted(onUpdate)
</script>

<template>
  <div class="py-4 mx-4">
    <p class="block mb-2">Фильтры</p>
    <Checkbox
        id="hideEmptyResults"
        v-model="filter.isHideEmptyResults"
        @update:modelValue="onUpdate"
    >Скрыть пустые результаты
    </Checkbox>
  </div>
</template>
