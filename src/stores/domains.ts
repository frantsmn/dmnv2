import {ref, computed, reactive} from 'vue'
import {defineStore} from 'pinia'
import {get, set} from '@vueuse/core'
import {asyncDelay} from '@/helpers'
import fetchDomainInfo from '@/service/fetch-domain-info'
import type {IResult} from '@/components/Card/types'
import {sortByAlphabet, sortByAge} from '@/stores/results-sort-methods'

export type Sort = 'alphabet' | 'age' | 'default'
export type Filter = { isHideEmptyResults: boolean }

export const useDomainsStore = defineStore('domains', () => {
  const delay = ref<number>(0)
  const sort = ref<Sort>('default')
  const filter = reactive<Filter>({
    isHideEmptyResults: false
  })
  const sources = ref<string[]>([])
  const results = reactive<Map<string, IResult>>(new Map())
  const totalAmount = computed(() => results.size)
  const completedAmount = ref(0)
  const isInProcess = ref<boolean>(false)
  const isAllCompleted = ref<boolean>(false)
  const sortsMethodsMap = reactive<Record<Sort, (results: IResult[]) => any>>({
    'default': (results) => results,
    'age': (results) => sortByAge(results),
    'alphabet': (results) => sortByAlphabet(results),
  })

  const filterResults = (results: IResult[]) => {
    return filter.isHideEmptyResults
      ? results.filter(result => result.status !== 'fail' && (result.webArchive !== null || result.google?.links.length))
      : results
  }

  /** Установить список доменов для прогона */
  const setDomains = (payload: string[]) => {
    const uniqueDomains = [...new Set(payload)]

    results.clear()
    uniqueDomains.forEach((domainName, index) =>
      results.set(domainName, {
        index: index + 1,
        domain: domainName,
        status: 'awaiting',
        webArchive: null,
        google: null,
        message: null,
      })
    )
  }

  /** Установить задержку в секундах между запросами */
  const setDelay = (payload: number) => set(delay, payload)

  /** Установить источники данных для прогона */
  const setSources = (payload: string[]) => set(sources, payload)

  /** Установить порядок сортировки результатов */
  const setSort = (payload: string) => {
    set(sort, payload)
  }

  /** Установить фильтр результатов */
  const setFilter = (payload: boolean) => {
    Object.assign(filter, payload)
    console.log(filter)
  }

  /** Запуск прогона доменов */
  const startProcess = async () => {
    const iterator = get(results).values()

    set(isInProcess, true)
    set(completedAmount, 0)

    while (get(isInProcess)) {
      const {value: domainValue, done: isIteratorDone} = get(iterator).next()
      const domainName = domainValue?.domain

      if (isIteratorDone) {
        stopProcess()
        set(isAllCompleted, true)
        return console.log('Done!')
      } else if (get(delay) && get(completedAmount)) {
        await asyncDelay(get(delay))
      }

      try {
        results.set(domainName, {
          ...domainValue,
          status: 'pending',
        })
        const {status, data, message} = await fetchDomainInfo(domainName, get(sources))
        results.set(domainName, {
          index: domainValue.index,
          status,
          message,
          ...data,
        })
        set(completedAmount, get(completedAmount) + 1)
      } catch (error) {
        console.error('Ошибка запроса', error)
      }
    }
  }

  /** Остановка прогона доменов */
  const stopProcess = () => set(isInProcess, false)

  /** Отфильтрованные результаты */
  const filteredResults = computed<IResult[]>(() => filterResults(Array.from(results.values())))

  /** Отсортированные результаты */
  const sortedResults = computed(() => sortsMethodsMap[get(sort)](get(filteredResults)))

  return {
    isInProcess,
    isAllCompleted,

    sort,
    filter,
    sources,
    results,
    sortedResults,

    totalAmount,
    completedAmount,

    setDomains,
    setDelay,
    setSort,
    setFilter,
    setSources,
    startProcess,
    stopProcess,
  }
})
