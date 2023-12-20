import type {DomainCheckResponse} from '@domain'
import type {FastifyRequest} from 'fastify'
import type {DomainRequest} from './application/request-adapter'
import puppeteer from 'puppeteer'
import {requestAdapter, isValidDomain} from './application'
import {useScrapers} from './scrapers'

const isDevMode = process.env.NODE_ENV === 'development'

export const useChecker = async () => {
  const browserOptions = isDevMode
    ? {headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox']}
    : {headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']}

  const browser = await puppeteer.launch(browserOptions)
  const {getWebArchiveInfo, getGoogleInfo} = useScrapers(browser)

  if (isDevMode) {
    setTimeout(async () => {
      const [page] = await browser.pages()
      await page.goto('http://localhost:8080/')
    }, 200)
  }
  const checkDomain = async (request: FastifyRequest): Promise<DomainCheckResponse> => {
    const {domain, source}: DomainRequest = requestAdapter(request)

    if (!isValidDomain(domain)) {
      return {
        status: 'fail',
        error: 'Некорректное имя домена',
      }
    }

    return {
      status: 'success',
      data: {
        domain,
        ...{google: source.includes('google') ? await getGoogleInfo(domain) : undefined},
        ...{webArchive: source.includes('webArchive') ? await getWebArchiveInfo(domain) : undefined},
      }
    }
  }

  return {
    checkDomain,
  }
}
