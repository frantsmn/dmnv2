import type {DomainCheckResponse} from '@domain'

export default async function fetchDomainInfo(domain: string, sources: Array<string>): Promise<DomainCheckResponse | undefined> {
  try {
    const url = import.meta.env.DEV ? 'http://127.0.0.1:8080/api/domain?' : '/api/domain?'
    const response = await fetch(url + new URLSearchParams({
      domain,
      source: sources.join(','),
    }), {
      method: 'GET',
    })

    if (response.ok) {
      const data = await response.json() as unknown

      return data as DomainCheckResponse
    } else {
      console.error(`Ошибка сервера ${response.status}`)
      return
    }
  } catch (err) {
    console.error(`Ошибка запроса\n${err}`)
    return
  }
}
