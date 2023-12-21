<script lang="ts" setup>
import {computed} from 'vue'
import ArrowTopRightOnSquare from '@/components/icons/ArrowTopRightOnSquare.vue'
import type {IResult, Status} from '@/stores/types'
import type {GoogleData, WebArchiveData} from '@domain'
import ErrorTag from '@/components/Card/error-tag.vue'
import WebArchiveView from '@/components/Card/web-archive-view.vue'
import GoogleView from '@/components/Card/google-view.vue'
import ResourceLink from '@/components/Card/resource-link.vue'

const props = defineProps<{ result: IResult }>()

const classList = computed(() => ({
  '': props.result.status === 'idle',
  'bg-amber-500': props.result.status === 'fetching',
  'bg-black': props.result.status === 'success',
  'bg-red-500': props.result.status === 'fail',
}))

const domainHref = computed(() => `https://${props.result.domain}`)
const webArchiveHref = computed(() => `https://web.archive.org/web/*/${props.result.domain}`)
const googleHref = computed(() => `https://www.google.by/search?q=site:${props.result.domain}`)
const getStatusIcon = (
  status: Status,
  data: WebArchiveData | GoogleData | undefined,
) => {
  if (status === 'success') {
    if (data === undefined) {
      return 'idle'
    }

    return data?.error ? 'fail' : 'success'
  }

  return status
}
</script>

<template>
  <section
      :class="classList"
      class="overflow-auto text-gray-400 px-5 group/card bg-opacity-20 body-font border-b border-0 group-last/card:border-0 border-emerald-900 border-opacity-30 py-6 gap-5"
  >
    <div class="container mx-auto flex gap-3">

      <!--Links-->
      <div class="flex flex-col" style="flex-basis: 10em">
        <span class="whitespace-nowrap">
        <span class="font-bold text-sm mr-1.5">{{ props.result.index }}.</span>
        <a
            :href="domainHref"
            class="mb-2.5 font-semibold title-font text-white inline-flex flex-grow-0 items-center group/link"
            target="_blank">
          <span>{{ props.result.domain }}</span>
          <ArrowTopRightOnSquare/>
        </a>
      </span>
        <ErrorTag v-if="props.result.error" :text="props.result.error"/>
        <template v-else>
          <ResourceLink
              title="web.archive.org"
              :href="webArchiveHref"
              :error="props.result.webArchive?.error"
              :status="getStatusIcon(props.result.status, props.result.webArchive)"
          />
          <ResourceLink
              title="google.by"
              :href="googleHref"
              :error="props.result.google?.error"
              :status="getStatusIcon(props.result.status, props.result.google)"
          />
        </template>
      </div>

      <!--Results-->
      <div class="flex-grow overflow-hidden">
        <WebArchiveView
            v-if="props.result.webArchive"
            :data="props.result.webArchive"
        />
        <GoogleView
            v-if="props.result.google"
            :data="props.result.google"
        />
      </div>
    </div>
  </section>
</template>
