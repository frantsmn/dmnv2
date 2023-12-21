<script setup lang="ts">
import {onMounted} from 'vue'
import {get, useStorage} from '@vueuse/core'
import Checkbox from '@/components/shared/Checkbox.vue'
import type {Filter} from '@/stores/types'

const emit = defineEmits<{
  (event: 'update:modelValue', filter: Filter): void;
}>()

const filter = useStorage('Settings:Filter', {
  hasWebArchiveResults: false,
  hasGoogleResults: false,
})

const onUpdate = () => emit('update:modelValue', get(filter))

onMounted(onUpdate)
</script>

<template>
  <div class="py-4 mx-4">
    <p class="block mb-2">Фильтры</p>
    <Checkbox
        id="hideEmptyWebArchiveResults"
        v-model="filter.hasWebArchiveResults"
        @update:modelValue="onUpdate"
        title="Скрывает результаты без данных с WebArchive"
    >Скрыть без WebArchive
    </Checkbox>
    <Checkbox
        id="hideEmptyGoogleResults"
        v-model="filter.hasGoogleResults"
        @update:modelValue="onUpdate"
        title="Скрывает результаты без данных с Google"
    >Скрыть без Google
    </Checkbox>
  </div>
</template>
