import type {DomainCheckResponse, WebArchiveData} from '@domain'

export const useWebArchiveApi = () => {
  const url = import.meta.env.DEV
    ? 'http://127.0.0.1:8080/api/domain?'
    : '/api/domain?'

  const fetchWebArchiveData = async (domain: string): Promise<WebArchiveData> => {
    const webArchiveData = {
      img: '',
      links: [],
    }
      
    try {
      const response = await fetch(url + new URLSearchParams({
        domain,
        source: 'webArchive',
      }), {
        method: 'GET',
      })

      if (response.ok) {
        const data = await response.json() as DomainCheckResponse | undefined

        if (data && data.webArchive) {
          Object.assign(webArchiveData, data.webArchive)
        }
      } else {
        Object.assign(webArchiveData, {error: `Ошибка сервера: ${response.status}`})
        console.error('[web-archive-api] Ошибка сервера. Response:', response)
      }
    } catch (e) {
      const error = e as Error

      Object.assign(webArchiveData, {error: `Ошибка запроса: ${error.message}`})
      console.error('[web-archive-api] Ошибка запроса:', error)
    }

    return webArchiveData
  }

  return {
    fetchWebArchiveData
  }
}
