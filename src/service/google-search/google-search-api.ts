export interface GoogleSearchApiErrorResponse {
  error: {
    code: number
    message: string
  }
}

export interface GoogleSearchApiSuccessResponse {
  items: Array<{title: string, link: string}>
  searchInformation?: {totalResults?: string}
}

export type GoogleSearchApiResponse = GoogleSearchApiErrorResponse | GoogleSearchApiSuccessResponse


export const useGoogleSearchApi = (options: {
  cx: string
  auth: string,
}) => {
  const url = 'https://www.googleapis.com/customsearch/v1?'
  const headers = new Headers({'User-Agent': 'GoogleSearch'})

  const fetchGoogleSearchData = async (q: string): Promise<GoogleSearchApiResponse> => {
    try {
      const response = await fetch(url + new URLSearchParams({
        key: options.auth,
        cx: options.cx,
        q: q,
      }), {
        headers,
        method: 'GET',
      })

      return await response.json() as GoogleSearchApiResponse
    } catch (e) {
      const error = e as Error
      console.error(`[google-search-api] Ошибка запроса\n${error.message}`)

      return {
        error: {
          code: 0,
          message: error.message,
        }
      }
    }
  }

  return {
    fetchGoogleSearchData
  }
}
