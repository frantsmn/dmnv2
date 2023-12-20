import {ref, computed, reactive} from 'vue'
import {defineStore} from 'pinia'
import {get, set} from '@vueuse/core'
import {asyncDelay} from '@/helpers'
import fetchDomainInfo from '@/service/fetch-domain-info'
import {sortByAlphabet, sortByAge} from '@/stores/sort-results'
import {filterResults} from '@/stores/filter-results'
import type {Filter, Sort, IResult} from '@/stores/types'

export const useDomainsStore = defineStore('domains', () => {
  const delay = ref<number>(0)
  const sort = ref<Sort>('default')
  const filter = reactive<Filter>({
    isHideEmptyWebArchiveResults: false,
    isHideEmptyGoogleResults: false,
  })

  const sources = ref<string[]>([])
  const results = reactive<Map<string, IResult>>(new Map())

  const resultsAsArray = computed(() => Array.from(results.values()))
  const totalAmount = computed(() => get(resultsAsArray).length)
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

  /** Запуск прогона доменов */
  const startProcess = async () => {
    const iterator = get(results).values()

    set(isInProcess, true)

    while (get(isInProcess)) {
      const {value: domainValue, done: isIteratorDone} = get(iterator).next()
      const domainName = domainValue?.domain

      if (isIteratorDone) {
        stopProcess()
        return console.log('Done!')
      } else if (get(delay) && get(completedAmount) !== 0) {
        await asyncDelay(get(delay))
      }

      try {
        results.set(domainName, {
          ...domainValue,
          status: 'fetching',
        })

        const domainInfo = await fetchDomainInfo(domainName, get(sources))

        if (!domainInfo) {
          results.set(domainName, {
            ...domainValue,
            status: 'fail',
            error: 'Сервер не вернул данные'
          })
          set(completedAmount, get(completedAmount) + 1)
          continue
        }

        switch (domainInfo.status) {
          case 'success': {
            results.set(domainName, {
              ...domainValue,
              status: domainInfo.status,
              webArchive: domainInfo.data.webArchive,
              google: domainInfo.data.google,
            })
            break
          }
          case 'fail': {
            results.set(domainName, {
              ...domainValue,
              status: domainInfo.status,
              error: domainInfo.error
            })
            break
          }
        }

        set(completedAmount, get(completedAmount) + 1)
      } catch (error) {
        console.error('Ошибка запроса', error)
      }
    }
  }

  /** Остановка прогона доменов */
  const stopProcess = () => set(isInProcess, false)

  /** Отфильтрованные и отсортированные результаты */
  const adaptedResults = computed(() => {
    const filteredResults = filterResults(get(resultsAsArray), filter)

    return sortsMethodsMap[get(sort)](filteredResults)
  })

  return {
    isInProcess,

    sort,
    filter,
    sources,
    results,
    adaptedResults,

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
