<script lang="ts" setup>
import {useDomainsStore} from '@/stores/domains'
import DummyLogo from '@/components/ResultsList/DummyLogo.vue'
import Card from '@/components/Card/Card.vue'
import {storeToRefs} from 'pinia'

const {totalAmount, sortedResults} = storeToRefs(useDomainsStore())
</script>

<template>
  <DummyLogo v-if="!totalAmount"/>
  <Card
      v-for="value in sortedResults"
      :key="value.index"
      :result="value"
  />
</template>
