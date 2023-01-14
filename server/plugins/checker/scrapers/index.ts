import type {Browser} from 'puppeteer'
import {useGoogleScraper} from './google-scraper'
import {useWebArchiveScraper} from './web-archive-scraper'

export const useScrapers = (browser: Browser) => {
    const {getGoogleInfo} = useGoogleScraper(browser)
    const {getWebArchiveInfo} = useWebArchiveScraper(browser)

    return {
        getGoogleInfo,
        getWebArchiveInfo,
    }
}
