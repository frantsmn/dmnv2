import type {Browser} from 'puppeteer'
import type {WebArchiveData} from '../domain/types'
import type {ElementHandle} from 'puppeteer'

export const useWebArchiveScraper = (browser: Browser) => {
  const getWebArchiveInfo = async (domain: string) => {
    const page = await browser.newPage()
    const data: WebArchiveData = {
      img: '',
      links: [],
    }
    let container: ElementHandle<Element> | null = null

    try {
      await page.goto(`http://web.archive.org/web/*/${domain}`)
      await page.waitForNetworkIdle({
        idleTime: 1000,
        timeout: 5000,
      })
    } catch {
      await page.close()
      throw Error('Не удалось открыть страницу')
    }

    try { 
      await page.waitForSelector('#wm-graph-anchor', {timeout: 4000})
      container = await page.$('.sparkline-container')
    } catch {
      await page.close()
      throw Error('Не удалось найти график')
    }

    if (!container) {
      await page.close()
      throw Error('Не удалось найти график')
    }

    await page.addStyleTag({
      content: `
            .sparkline-container {
                overflow: visible !important;
                max-width: unset !important;
                width: max-content;
            }

            #donate_banner{
                display: none !important;
            }
            `
    })

    const buffer = await container.screenshot()
    if (!buffer) {
      await page.close()
      throw Error('Не удалось найти график')
    }
    data.img = buffer?.toString('base64') ?? ''

    try {
      data.links = await page.evaluate(() => {
        const anchors: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('.captures-range-info a')
        return [...anchors].map((a) => {
          return {
            href: a.href,
            innerText: a.innerText,
            timestamp: +new Date(a.innerText)
          }
        }
        )
      })
    } catch {
      await page.close()
      throw Error('Не удалось собрать ссылки')
    }

    await page.close()

    if (!data.links.length && !data.img) {
      return null
    }

    return data
  }

  return {
    getWebArchiveInfo
  }
}
