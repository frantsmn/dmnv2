import type {WebArchiveData} from '@domain'
import type {Browser} from 'puppeteer'
import type {ElementHandle} from 'puppeteer'
import {isValidDomain} from '../application'

export const useWebArchiveScraper = (browser: Browser) => {
  const getWebArchiveInfo = async (domain: string) => {
    const page = await browser.newPage()
    const data: WebArchiveData = {
      img: '',
      links: [],
    }

    if (!isValidDomain(domain)) {
      data.error = 'Некорректное имя домена'
      void page.close()
      return data
    }

    let container: ElementHandle<Element> | null = null

    try {
      await page.goto(`http://web.archive.org/web/*/${domain}`)
      await page.waitForNetworkIdle({
        idleTime: 1000,
        timeout: 5000,
      })
    } catch {
      data.error = 'Не удалось собрать данные. ⚠️ Ресурс ограничил доступ'
      void page.close()
      return data
    }

    try { 
      await page.waitForSelector('#wm-graph-anchor', {timeout: 4000})
      container = await page.$('.sparkline-container')
    } catch {
      data.error = 'Не удалось найти график'
      await page.close()
      return data
    }

    if (!container) {
      data.error = 'Не удалось найти график'
      void page.close()
      return data
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
      data.error = 'Не удалось найти график'
      void page.close()
      return data
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
      data.error = 'Не удалось собрать ссылки диапазона графика'
    }

    void page.close()
    return data
  }

  return {
    getWebArchiveInfo
  }
}
