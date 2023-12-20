<script setup lang="ts">
defineProps<{ text: string }>()
</script>

<template>
  <span class="text-red-500 font-bold text-xs bg-red-600 bg-opacity-20 p-2 pt-1 inline-block rounded">
    {{ text }}
  </span>
</template>
