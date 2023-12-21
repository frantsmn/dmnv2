import type {DomainSource} from '@domain'
import type {IResult} from '@/stores/types'
import fetchDomainInfo from '@/service/fetch-domain-info'

export interface CheckDomainParams {
  results: Map<string, IResult>
  sources: DomainSource[]
  iterator: IterableIterator<IResult>
  onBeforeRequest?: () => Promise<void>
  onFinish: () => void
}

export const checkDomain = async ({
  results,
  sources,
  iterator,
  onBeforeRequest,
  onFinish
}: CheckDomainParams): Promise<IResult | undefined> => {
  const {value: domainValue, done} = iterator.next()
  const {domain: domainName} = domainValue as IResult

  if (done) {
    onFinish()
    console.log('Done!')
    return
  }

  await onBeforeRequest?.()

  results.set(domainName, {
    ...domainValue,
    status: 'fetching',
  })

  const domainInfo = await fetchDomainInfo(domainName, sources)

  if (!domainInfo) {
    return void results.set(domainName, {
      ...domainValue,
      status: 'fail',
      error: 'Сервер не вернул данные',
    })
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
        error: domainInfo.error,
      })
      break
    }
  }
}