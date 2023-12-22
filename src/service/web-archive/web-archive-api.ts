import type {DomainCheckResponse} from '@domain'

export const useWebArchiveApi = () => {
  const url = import.meta.env.DEV
    ? 'http://127.0.0.1:8080/api/domain?'
    : '/api/domain?'

  const fetchWebArchiveData = async (domain: string) => {
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
          return data.webArchive
        }

      } else {
        console.error(`Ошибка сервера ${response.status}`)
        return
      }
    } catch (err) {
      console.error(`[web-archive-api] Ошибка запроса\n${err}`)
      return
    }
  }

  return {
    fetchWebArchiveData
  }
}
