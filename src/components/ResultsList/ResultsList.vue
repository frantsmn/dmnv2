<script lang="ts" setup>
import {useDomainsStore} from '@/stores/domains'
import DummyLogo from '@/components/ResultsList/DummyLogo.vue'
import Card from '@/components/Card/Card.vue'
import {storeToRefs} from 'pinia'

const {totalAmount, results} = storeToRefs(useDomainsStore())
</script>

<template>
  <DummyLogo v-if="!totalAmount"/>
  <Card
      v-for="[resultKey, resultValue] in results"
      :key="resultKey"
      :result="resultValue"
  />
</template>
