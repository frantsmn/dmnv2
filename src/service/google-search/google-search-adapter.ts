import {useGoogleSearchApi} from '@/service/google-search/google-search-api'
import type {GoogleData} from '@domain'

interface ResultData {
  items: Array<{title: string, link: string}>
  searchInformation?: {totalResults?: string}
}

export const useGoogleSearchAdapter = () => {
  const api = useGoogleSearchApi({
    cx: 'a6410bda0aaee4378',
    auth: 'AIzaSyAjVaVJ3vOfs-gPVpmSx_GEmq19l6Pa-bk',
  })

  const fetchGoogleSearchData = async (domain: string): Promise<GoogleData> => {
    const data = await api.fetchGoogleSearchData(`site:${domain}`) as ResultData | undefined

    if (!data) return {
      amountStr: '',
      links: [],
      error: '⚠️ Сервер не вернул данные'
    }

    const {items, searchInformation} = data

    return {
      amountStr: searchInformation
      && searchInformation?.totalResults
      && Number.parseInt(searchInformation.totalResults, 10)
        ? `Результатов: ${searchInformation.totalResults}`
        : 'Нет результатов поиска',
      links: items?.map(item => ({innerText: item.title, href: item.link})) ?? [],
    }
  }

  return {
    fetchGoogleSearchData
  }
}