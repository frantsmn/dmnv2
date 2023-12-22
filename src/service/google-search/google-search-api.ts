export const useGoogleSearchApi = (options: {
  cx: string
  auth: string,
}) => {
  const url = 'https://www.googleapis.com/customsearch/v1?'
  const headers = new Headers({'User-Agent': 'GoogleSearch'})

  const fetchGoogleSearchData = async (q: string) => {
    try {
      const response = await fetch(url + new URLSearchParams({
        key: options.auth,
        cx: options.cx,
        q: q,
      }), {
        headers,
        method: 'GET',
      })

      return await response.json()
    } catch (err) {
      console.error(`[google-search-api] Ошибка запроса\n${err}`)
      return
    }
  }

  return {
    fetchGoogleSearchData
  }
}
