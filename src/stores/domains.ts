import {ref, computed, reactive} from 'vue'
import {defineStore} from 'pinia'
import {get, set} from '@vueuse/core'
import {asyncDelay} from '@/helpers'
import fetchDomainInfo from '@/service/fetch-domain-info'
import type {IResult} from '@/components/Card/types'

export const useDomainsStore = defineStore('domains', () => {
    const delay = ref<number>(0)
    const sources = ref<string[]>([])
    const results = reactive<Map<string, IResult>>(new Map())
    const totalAmount = computed(() => results.size)
    const completedAmount = ref(0)
    const isInProcess = ref<boolean>(false)
    const isAllCompleted = ref<boolean>(false)

    /**
     * Установить список доменов для прогона
     * @param {string[]} payload
     */
    const setDomains = (payload: string[]) => {
        const uniqueDomains = [...new Set(payload)]

        results.clear()
        uniqueDomains.forEach((domainName) =>
            results.set(domainName, {
                domain: domainName,
                status: 'awaiting',
                webArchive: null,
                google: null,
                message: null,
            })
        )
    }
    /**
     * Установить задержку в секундах между запросами
     * @param {number} payload
     */
    const setDelay = (payload: number) => set(delay, payload)
    /**
     * Установить источники данных для прогона
     * @param {string[]} payload
     */
    const setSources = (payload: string[]) => set(sources, payload)
    /**
     * Запуск прогона доменов
     */
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
    const stopProcess = () => set(isInProcess, false)

    return {
        isInProcess,
        isAllCompleted,

        sources,
        results,

        totalAmount,
        completedAmount,

        setDomains,
        setDelay,
        setSources,
        startProcess,
        stopProcess,
    }
})
