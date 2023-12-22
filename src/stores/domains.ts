import {ref, computed, reactive} from 'vue'
import {defineStore} from 'pinia'
import {get, set} from '@vueuse/core'
import {sortByAlphabet, sortByAge} from '@/stores/sort-results'
import {filterResults} from '@/stores/filter-results'
import type {Filter, Sort, IResult} from '@/stores/types'
import {checkDomain} from '@/stores/check-domain'
import type {DomainSource} from '@domain'
import {setIntervalAsync, clearIntervalAsync} from 'set-interval-async'
import type {SetIntervalAsyncTimer} from 'set-interval-async'
import {asyncDelay} from '@/helpers'

export const useDomainsStore = defineStore('domains', () => {
  const state = reactive<{
    iterator: IterableIterator<IResult> | undefined
  }>({
    iterator: undefined,
  })

  let intervalId: SetIntervalAsyncTimer<unknown[]>

  const delay = ref<number>(0)
  const sort = ref<Sort>('default')
  const filter = reactive<Filter>({
    hasWebArchiveResults: false,
    hasGoogleResults: false,
  })

  const sources = ref<DomainSource[]>([])
  const results = reactive<Map<string, IResult>>(new Map())

  const resultsAsArray = computed(() => Array.from(results.values()))
  const completedAmount = computed(() => {
    return get(resultsAsArray)
      .filter((result) => !['idle', 'fetching'].includes(result.status))
      .length
  })

  const isInProcess = ref<boolean>(false)
  const sortsMethodsMap = reactive<Record<Sort, (results: IResult[]) => any>>({
    'default': (results) => results,
    'age': (results) => sortByAge(results),
    'alphabet': (results) => sortByAlphabet(results),
  })

  /** Установить список доменов для прогона */
  const setDomains = (payload: string[]) => {
    const uniqueDomains = [...new Set(payload)]
    let isWipeData = true

    if (get(completedAmount)) {
      isWipeData = confirm('Изменить список доменов?\nВсе результаты будут утеряны!')
    }

    if (!isWipeData) {
      return
    }

    results.clear()
    uniqueDomains.forEach((domainName, index) =>
      results.set(domainName, {
        index: index + 1,
        domain: domainName,
        status: 'idle',
      })
    )
  }

  /** Установить задержку в секундах между запросами */
  const setDelay = (payload: number) => set(delay, payload)
  /** Установить источники данных для прогона */
  const setSources = (payload: string[]) => set(sources, payload)
  /** Установить порядок сортировки результатов */
  const setSort = (payload: string) => set(sort, payload)
  /** Установить фильтр результатов */
  const setFilter = (payload: Filter) => Object.assign(filter, payload)

  /** Остановка прогона доменов */
  const stopProcess = async () => {
    await clearIntervalAsync(intervalId)
    set(isInProcess, false)
  }

  /** Запуск прогона доменов */
  const startProcess = async () => {
    if (!results.size) {
      return
    }

    set(isInProcess, true)

    if (!state.iterator) {
      state.iterator = get(results).values()
    }

    intervalId = setIntervalAsync(async () => {
      if (!get(isInProcess)) {
        return
      }

      await checkDomain({
        results,
        sources: get(sources),
        iterator: state.iterator!,
        onFinish: stopProcess,
      })

      if (get(isInProcess)) {
        await asyncDelay(get(delay))
      }

    }, 100)
  }

  return {
    isInProcess,

    sort,
    filter,
    sources,
    results,
    /** Отфильтрованные и отсортированные результаты */
    adaptedResults: computed(() => {
      const filteredResults = filterResults(get(resultsAsArray), filter)
      return sortsMethodsMap[get(sort)](filteredResults)
    }),
    /** Общее кол-во результатов */
    totalAmount: computed(() => get(resultsAsArray).length),
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
