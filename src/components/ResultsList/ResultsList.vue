<script lang="ts" setup>
import {storeToRefs} from 'pinia'
import {useDomainsStore} from '@/stores/domains'
import DummyLogo from '@/components/ResultsList/DummyLogo.vue'
import Card from '@/components/Card/Card.vue'

// import type {GoogleData, LinkData, WebArchiveData} from '@domain'
// const totalAmount = 4
// const adaptedResults = [
//   {
//     index: 1,
//     status: 'fail',
//     domain: 'example.com',
//     error: 'Не удалось получить данные'
//   },
//   {
//     index: 2,
//     status: 'fetching',
//     domain: 'example.com',
//     /** Данные WebArchive */
//     webArchive: {
//       img: '',
//       links: [],
//       error: 'Какая-то ошибка',
//     },
//   },
//   {
//     index: 3,
//     status: 'success',
//     domain: 'example.com',
//     /** Данные WebArchive */
//     google: {
//       amountStr: 'Результаты',
//       links: [{
//         href: '#',
//         innerText: 'Текст ссылки',
//         timestamp: 0
//       }],
//     },
//   },
//   {
//     index: 4,
//     status: 'success',
//     domain: 'example.com',
//     /** Данные WebArchive */
//     google: {
//       amountStr: 'Результаты',
//       links: [{
//         href: '#',
//         innerText: 'Текст ссылки',
//         timestamp: 0
//       }],
//     },
//     /** Данные WebArchive */
//     webArchive: {
//       img: '',
//       links: [],
//     },
//   },
//   {
//     index: 5,
//     status: 'success',
//     domain: 'example.com',
//     /** Данные WebArchive */
//     google: {
//       amountStr: 'Результаты',
//       links: [],
//       error: 'Ошибка при получении ссылок'
//     },
//     /** Данные WebArchive */
//     webArchive: {
//       img: '',
//       links: [],
//     },
//   },
//   {
//     index: 6,
//     status: 'success',
//     domain: 'example.com',
//     /** Данные WebArchive */
//     google: {
//       amountStr: 'Результаты',
//       links: [],
//       error: 'Ошибка при получении ссылок'
//     },
//     /** Данные WebArchive */
//     webArchive: {
//       img: '',
//       links: [],
//       error: 'Ошибка при получении графика'
//     },
//   },
//   {
//     index: 7,
//     status: 'success',
//     domain: 'example.com',
//     'google': {
//       'amountStr': '',
//       'links': [],
//       'error': 'Данные поисковой выдачи отсутствуют'
//     },
//     'webArchive': {
//       'img': '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',
//       'links': [],
//       error: 'Ошибка при получении ссылок'
//     }
//   }]

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
