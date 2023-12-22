import type {DomainSource} from '@domain'
import type {IResult} from '@/stores/types'
import {useWebArchiveApi} from '@/service/web-archive/web-archive-api'
import {useGoogleSearchAdapter} from '@/service/google-search'

const {fetchWebArchiveData} = useWebArchiveApi()
const {fetchGoogleSearchData} = useGoogleSearchAdapter()

export interface CheckDomainParams {
  results: Map<string, IResult>
  sources: DomainSource[]
  iterator: IterableIterator<IResult>
  onFinish: () => void
}

export const checkDomain = async ({
  results,
  sources,
  iterator,
  onFinish
}: CheckDomainParams): Promise<IResult | undefined> => {
  const item = iterator.next()

  if (item.done) {
    console.log('🏁 Done!')
    return void onFinish()
  }

  const {domain: domainName} = item.value

  results.set(domainName, {
    ...item.value,
    status: 'fetching',
  })

  if (sources.includes('google')) {
    const googleData = await fetchGoogleSearchData(domainName)

    if (googleData) {
      item.value.google = googleData
    } else {
      item.value.google = {
        amountStr: '',
        links: [],
        error: '❌ Не удалось получить данные'
      }
    }
    // console.log('1. check-domain: fetchDomainData', googleData)
  }

  if (sources.includes('webArchive')) {
    const webArchiveData = await fetchWebArchiveData(domainName)

    if (webArchiveData) {
      item.value.webArchive = webArchiveData
    } else {
      item.value.webArchive = {
        links: [],
        img: '',
        error: '❌ Не удалось получить данные'
      }
    }
    // console.log('2. check-domain: fetchWebArchiveData', webArchiveData)
  }

  results.set(domainName, {
    ...item.value,
    status: 'complete',
  })
}