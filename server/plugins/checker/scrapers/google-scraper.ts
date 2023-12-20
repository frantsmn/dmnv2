import type {Browser, Page} from 'puppeteer'
import type {GoogleData, LinkData} from '@domain'

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
      data.error = 'Не удалось перейти на страницу поиска'
      void page.close()
      return data
    }

    try {
      await page.waitForSelector('#result-stats', {timeout: 2000})
      const links = await grabLinks(page)

      if (links.length === 0) {
        data.error = 'Данные поисковой выдачи отсутствуют'
      } else {
        data.links = links
        data.amountStr = await grabAmountStr(page)
      }
    } catch {
      data.error = 'Не удалось собрать данные. ⚠️ Ресурс ограничил доступ'
    }

    void page.close()
    return data
  }

  return {
    getGoogleInfo
  }
}
