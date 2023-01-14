export default async function fetchDomainInfo(domain: string, sources: Array<string>) {
    try {
        const url = import.meta.env.DEV ? 'http://127.0.0.1:8080/api/domain?' : '/api/domain?'
        const response = await fetch(url + new URLSearchParams({
            domain,
            source: sources.join(','),
        }), {
            method: 'GET',
        })

        if (response.ok) {
            return await response.json()
        } else {
            console.error(`Ошибка сервера ${response.status}`)
            return undefined
        }
    } catch (err) {
        console.error(`Ошибка запроса\n${err}`)
        return undefined
    }
}
