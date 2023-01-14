<template>
  <div class="py-4 border-b border-b-emerald-900 border-opacity-50 mx-4">
    <p class="block mb-2">Источники</p>
    <Checkbox
        id="WebArchive"
        v-model="sourcesMap.webArchive"
        @update:modelValue="onUpdate"
    >WebArchive
    </Checkbox>
    <Checkbox
        id="Google"
        v-model="sourcesMap.google"
        @update:modelValue="onUpdate"
    >Google
    </Checkbox>
  </div>
</template>

<script lang="ts" setup>
import {get, useStorage} from '@vueuse/core'
import Checkbox from '@/components/shared/Checkbox.vue'
import type {ComputedRef, Ref} from 'vue'
import {computed, onMounted} from 'vue'

const emit = defineEmits<{
  (event: 'update:modelValue', payload: string[]): void;
}>()

const sourcesMap: Ref<Record<string, boolean>> = useStorage('Settings:Sources', {
  google: true,
  webArchive: true,
})

const activeSources: ComputedRef<string[]> = computed(() => Object.keys(get(sourcesMap)).filter((key) => get(sourcesMap)[key]))

const onUpdate = () => {
  emit('update:modelValue', get(activeSources))
}

onMounted(() => {
  emit('update:modelValue', get(activeSources))
})
</script>
