import {useGoogleSearchApi} from '@/service/google-search/google-search-api'
import type {GoogleData} from '@domain'

interface ResultData {
  items: Array<{title: string, link: string}>
  searchInformation: {totalResults: number}
}

export const useGoogleSearchAdapter = () => {
  const api = useGoogleSearchApi({
    cx: 'a6410bda0aaee4378',
    auth: 'AIzaSyAjVaVJ3vOfs-gPVpmSx_GEmq19l6Pa-bk',
  })

  const fetchGoogleSearchData = async (domain: string): Promise<GoogleData | undefined> => {
    const data = await api.fetchGoogleSearchData(`site:${domain}`) as ResultData | undefined

    if (!data) return

    const {items} = data
    const {totalResults} = data.searchInformation

    return {
      amountStr: totalResults ? `Результатов: ${totalResults}` : '',
      links: items.map(item => ({innerText: item.title, href: item.link})),
    }
  }

  return {
    fetchGoogleSearchData
  }
}