<template>
  <div
      v-if="status === 'success'"
      class="flex-shrink-0 w-[1.3em] h-[1.3em] rounded-full bg-emerald-500 inline-flex items-center justify-center text-white relative z-10 mr-[0.5em]"
      title="Ответ получен"
  >
    <svg
        aria-hidden="true"
        class="w-[1.1em] h-[1.1em]"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4.5 12.75l6 6 9-13.5" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>
  </div>

  <div
      v-if="status === 'fail'"
      class="flex-shrink-0 w-[1.3em] h-[1.3em] rounded-full bg-red-500 inline-flex items-center justify-center text-white relative z-10 mr-[0.5em]"
      title="Ошибка"
  >
    <svg
        aria-hidden="true"
        class="w-[1.1em] h-[1.1em]"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>
  </div>

  <div
      v-if="status === 'pending'"
      class="flex-shrink-0 w-[1.3em] h-[1.3em] rounded-full bg-amber-600 inline-flex items-center justify-center text-white relative z-10 mr-[0.5em]"
      title="Ожидание ответа..."
  >
    <svg
        aria-hidden="true"
        class="w-[1.1em] h-[1.1em] animate-spin"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
      <path
          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
          stroke-linecap="round"
          stroke-linejoin="round"></path>
    </svg>
  </div>

  <div
      v-if="status === 'awaiting'"
      class="flex-shrink-0 w-[1.3em] h-[1.3em] rounded-full bg-gray-500 inline-flex items-center justify-center text-white relative z-10 mr-[0.5em]"
      title="В очереди"
  >
    <svg
        aria-hidden="true"
        class="w-[1.1em] h-[1.1em]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"
         xmlns="http://www.w3.org/2000/svg">
      <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>
  </div>
</template>


<script lang="ts">
export default {
  props: {
    status: {
      type: String,
      default: 'awaiting',
      validator(value: string) {
        return ['awaiting', 'pending', 'success', 'fail'].includes(value)
      }
    }
  }
}

</script>
