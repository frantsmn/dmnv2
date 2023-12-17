import type {Browser, Page} from 'puppeteer'
import type {GoogleData, LinkData} from '../domain/types'

export const useGoogleScraper = (browser: Browser) => {
  const grabAmountStr = async (page: Page): Promise<string> => {
    return await page.evaluate(() => {
      return document?.querySelector('#result-stats')?.textContent ?? ''
    })
  }
  const grabLinks = async (page: Page) => {
    return await page.evaluate(() => {
      const links: LinkData[] = []
      const resultsElement = document.querySelector('#search')
      const nodeList: NodeListOf<HTMLAnchorElement> | [] = resultsElement?.querySelectorAll('a[data-ved]') ?? []
      const nodeArray = [...nodeList]
      nodeArray.forEach(a => {
        const title = a.querySelector('h3')
        if (title && title.textContent) {
          links.push({
            href: a.href,
            innerText: title.textContent
          })
        }
      })
      return links
    })
  }

  const getGoogleInfo = async (domain: string) => {
    const page = await browser.newPage()
    const url = new URL(`https://google.by/search?q=site%3A${domain}`).toString()
    const data: GoogleData = {
      amountStr: '',
      links: [],
    }

    try {
      await page.goto(url)
      await page.waitForNetworkIdle({
        idleTime: 200,
        timeout: 2000,
      })
    } catch {
      await page.close()
      throw Error('Не удалось перейти на страницу поиска')
    }

    try {
      await page.waitForSelector('#result-stats', {timeout: 2000})
      data.amountStr = await grabAmountStr(page)
      data.links = await grabLinks(page)
    } catch {
      await page.close()
      throw Error('Не удалось собрать данные выдачи')
    }

    await page.close()

    if (!data.amountStr && !data.links.length) {
      return null
    }

    return data
  }

  return {
    getGoogleInfo
  }
}
