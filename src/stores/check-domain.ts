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
  onFinish: () => Promise<void>
}

export const checkDomain = async ({
  results,
  sources,
  iterator,
  onFinish
}: CheckDomainParams): Promise<IResult | undefined> => {
  const item = iterator.next()

  if (item.done) {
    await onFinish()
    console.log('🏁 Done!')
    return
  }

  const {domain: domainName} = item.value

  results.set(domainName, {
    ...item.value,
    status: 'fetching',
  })

  results.set(domainName, {
    ...item.value,
    ...{google: sources.includes('google') ? await fetchGoogleSearchData(domainName) : undefined},
    ...{webArchive: sources.includes('webArchive') ? await fetchWebArchiveData(domainName) : undefined},
    status: 'complete',
  })
}