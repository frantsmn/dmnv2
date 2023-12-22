<script lang="ts" setup>
import {storeToRefs} from 'pinia'
import {useDomainsStore} from '@/stores/domains'
import DummyLogo from '@/components/ResultsList/DummyLogo.vue'
import Card from '@/components/Card/Card.vue'

const {totalAmount, adaptedResults} = storeToRefs(useDomainsStore())
</script>

<template>
  <DummyLogo v-if="!totalAmount"/>
  <Card
      v-for="value in adaptedResults"
      :key="value.index"
      :result="value"
  />
</template>
