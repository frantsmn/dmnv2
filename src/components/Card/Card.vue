<script lang="ts" setup>
import {computed} from 'vue'
import ArrowTopRightOnSquare from '@/components/icons/ArrowTopRightOnSquare.vue'
import StatusIcon from '@/components/icons/StatusIcon.vue'
import type {IResult, Status} from '@/components/Card/types'
import {storeToRefs} from 'pinia'
import {useDomainsStore} from '@/stores/domains'
import {get} from '@vueuse/core'


const {
  sources
} = storeToRefs(useDomainsStore())

const props = withDefaults(defineProps<{ result: IResult }>(), {
  result: () => ({
    index: 1,
    status: 'awaiting',
    domain: 'example.com',
    webArchive: null,
    google: null,
    message: null
  })
})

const classList = computed(() => ({
  '': props.result.status === 'awaiting',
  'bg-amber-500': props.result.status === 'pending',
  'bg-black': props.result.status === 'success',
  'bg-red-500': props.result.status === 'fail',
}))

const domainHref = computed(() => `https://${props.result.domain}`)
const webArchiveHref = computed(() => `https://web.archive.org/web/*/${props.result.domain}`)
const googleHref = computed(() => `https://www.google.by/search?q=site:${props.result.domain}`)

const webArchiveStatusIcon = computed(() => getStatusIcon(props.result.status, Boolean(props.result.webArchive), 'webArchive'))
const googleStatusIcon = computed(() => getStatusIcon(props.result.status, Boolean(props.result.google), 'google'))

const getStatusIcon = (status: Status | 'error', isSourceData: boolean, sourceName: 'google' | 'webArchive') => {
  if (!get(sources).includes(sourceName)) {
    return 'awaiting'
  }

  if (isSourceData) {
    return 'success'
  }

  if (status === 'error') {
    return 'fail'
  }

  return status
}
</script>

<template>
  <section
      :class="classList"
      class="text-gray-400 px-5 group/card bg-opacity-20 body-font overflow-hidden relative"
  >
    <!--Error Message-->
    <div v-if="props.result.message">
      <p class="text-red-500 font-bold text-xs bg-red-600 bg-opacity-20 p-1 pb-1.5 -mb-4 mt-2 rounded w-max m-auto">
        {{ props.result.message }}
      </p>
    </div>

    <div
        class="container pb-6 border-b border-0 mx-auto group-last/card:border-0 border-emerald-900 border-opacity-30">
      <div class="py-6 pb-2 flex gap-5">
        <!--Links-->
        <div class="basis-1/5 mb-1 flex-shrink-1 flex flex-col items-start relative">
          <span class="pt-1">
            <span class="font-bold text-sm mr-1.5">{{props.result.index}}.</span>
            <a
                v-if="props.result.domain"
                :href="domainHref"
                class="mb-2.5 font-semibold title-font text-white inline-flex flex-grow-0 items-center group/link"
                target="_blank">
              <span>{{ props.result.domain }}</span>
              <ArrowTopRightOnSquare/>
            </a>
          </span>
          <a
              :href="webArchiveHref"
              class="mb-2.5 text-indigo-400 inline-flex items-center text-sm group/link"
              target="_blank">
            <StatusIcon :status="webArchiveStatusIcon"/>
            <span class="leading-none">web.archive.org</span>
            <ArrowTopRightOnSquare/>
          </a>
          <a
              :href="googleHref"
              class="mb-1 text-indigo-400 inline-flex items-center text-sm group/link"
              target="_blank">
            <StatusIcon :status="googleStatusIcon"/>
            <span class="leading-none">google.by</span>
            <ArrowTopRightOnSquare/>
          </a>
        </div>
        <!--WebArchive-->
        <div
            v-if="props.result.webArchive"
            class="relative basis-4/5 flex overflow-hidden">
          <div
              class="absolute text-white text-xs bg-black z-10 px-1 pt-0.5 pb-1 bg-opacity-50 rounded-br rounded-tl">
            <a
                v-if="props.result.webArchive.links[0]"
                :href="props.result.webArchive.links[0].href"
                class="hover:underline"
                target="_blank">
              {{ props.result.webArchive.links[0].innerText }}
            </a>
            <template v-if="props.result.webArchive.links.length === 2"> - </template>
            <a
                v-if="props.result.webArchive.links[1]"
                :href="props.result.webArchive.links[1].href"
                class="hover:underline"
                target="_blank">
              {{ props.result.webArchive.links[1].innerText }}
            </a>
          </div>
          <div class="overflow-x-auto rounded mix-blend-hard-light"
               style="direction: rtl">
            <img
                :src="`data:image/png;base64,${props.result.webArchive.img}`"
                alt="graph"
                class="rounded max-w-none m-auto mb-0.5 h-[5.5rem] opacity-70 hover:opacity-100 transition-opacity delay-75 duration-300"
            >
          </div>
        </div>
        <div v-else class="w-full">
          <div class="animate-pulse flex flex-col content-end items-end">
            <div class="rounded bg-white bg-opacity-[0.05] mb-1 h-[85px] w-[100%]"></div>
          </div>
        </div>
      </div>
      <!--Google-->
      <div v-if="props.result.google">
        <p class="text-emerald-400 mb-2">{{ props.result.google.amountStr }}</p>
        <div class="columns-3" style="column-gap: 10%">
          <ul class="list-decimal px-[1em] text-sm">
            <li v-for="(link, index) in props.result.google.links" :key="index">
              <a
                  :href="link.href"
                  class="hover:underline"
                  target="_blank">{{ link.innerText }}</a>
            </li>
          </ul>
        </div>
      </div>
      <div v-else class="w-full">
        <div class="animate-pulse flex gap-4">
          <div class="rounded bg-white bg-opacity-[0.05] h-[100px] w-1/3"></div>
          <div class="rounded bg-white bg-opacity-[0.05] h-[100px] w-1/3"></div>
          <div class="rounded bg-white bg-opacity-[0.05] h-[100px] w-1/3"></div>
        </div>
      </div>
    </div>
  </section>
</template>
