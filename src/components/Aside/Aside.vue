<script lang="ts" setup>
import {useDomainsStore} from '@/stores/domains'
import TextareaList from '@/components/Aside/TextareaList.vue'
import ProgressInfo from '@/components/Aside/ProgressInfo.vue'
import DelaySetting from '@/components/Aside/DelaySetting.vue'
import SourcesFilter from '@/components/Aside/SourcesFilter.vue'
import ResultsSort from '@/components/Aside/ResultsSort.vue'
import ResultsFilter from '@/components/Aside/results-filter.vue'
import {storeToRefs} from 'pinia'

const {
  startProcess,
  stopProcess,
  setDomains,
  setSources,
  setDelay,
  setSort,
  setFilter,
} = useDomainsStore()

const {
  isInProcess,
  totalAmount,
  completedAmount,
} = storeToRefs(useDomainsStore())
</script>

<template>
  <aside aria-label="Sidebar"
         class="fixed block w-[19rem] z-20 overflow-y-auto border-r border-emerald-900 border-opacity-50">
    <div class="h-screen px-2 py-4 overflow-y-auto bg-opacity-20 text-sm text-gray-400 bg-black">
      <div class="py-4 border-b border-b-emerald-900 border-opacity-50 mx-4">
        <h1 class="text-emerald-400 font-light text-lg">Domain Checker</h1>
      </div>

      <TextareaList
          id="domains"
          @update:domains="setDomains"
          :disabled="isInProcess"
      >
        <button
            :disabled="isInProcess"
            class="text-emerald-500 hover:text-white disabled:hover:text-emerald-500 hover:bg-emerald-500 disabled:hover:bg-transparent focus:ring-2 focus:outline-none font-medium text-sm text-center rounded-md px-5 pt-1.5 pb-2 mr-2 mb-2 border-2 border-emerald-900 hover:border-emerald-500 disabled:hover:border-emerald-900 focus:ring-emerald-500 disabled:cursor-not-allowed"
            type="button"
            @click="startProcess">
          Старт
        </button>
        <button
            :disabled="!isInProcess"
            class="text-amber-500 hover:text-white disabled:hover:text-amber-500 hover:bg-amber-500 disabled:hover:bg-transparent focus:ring-2 focus:outline-none font-medium text-sm text-center rounded-md px-5 pt-1.5 pb-2 mr-2 mb-2 border-2 border-amber-900 hover:border-amber-500 disabled:hover:border-amber-900 focus:ring-amber-500 disabled:cursor-not-allowed"
            type="button"
            @click="stopProcess"
        >
          Пауза
        </button>
      </TextareaList>

      <ProgressInfo :total="totalAmount" :current="completedAmount"/>
      <SourcesFilter @update:modelValue="setSources"/>
      <DelaySetting @update:modelValue="setDelay"/>
      <ResultsSort @update:modelValue="setSort"/>
      <ResultsFilter @update:modelValue="setFilter"/>
      <!--      <div class="py-4 border-b border-b-emerald-900 border-opacity-50 mx-4">-->
      <!--        <p class="block mb-2">История</p>-->
      <!--      </div>-->
    </div>
  </aside>
</template>
