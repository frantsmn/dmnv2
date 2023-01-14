import type {Browser} from 'puppeteer'
import type {WebArchiveData} from '../domain/types'

export const useWebArchiveScraper = (browser: Browser) => {
    const getWebArchiveInfo = async (domain: string) => {
        const page = await browser.newPage()
        const data: WebArchiveData = {
            img: '',
            links: [],
        }

        try {
            await page.goto(`http://web.archive.org/web/*/${domain}`)
            await page.waitForNetworkIdle({
                idleTime: 1000,
                timeout: 5000,
            })
        } catch {
            throw `Не удалось перейти на страницу [web.archive.org | ${domain}]`
        }

        await page.waitForSelector('#wm-graph-anchor', {timeout: 4000})
        const container = await page.$('.sparkline-container')

        if (!container) {
            throw `Не удалось найти блок для скриншота [web.archive.org | ${domain}]`
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
            throw `Не удалось сделать скриншот [web.archive.org | ${domain}]`
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
            throw `Не удалось собрать ссылки [web.archive.org | ${domain}]`
        }

        await page.goto('about:blank')
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
