import type {FastifyRequest} from 'fastify'
import type {DomainCheckResponse} from './domain/types'
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
  const checkDomain = async (request: FastifyRequest) => {
    const {domain, source}: DomainRequest = requestAdapter(request)
    const response: DomainCheckResponse = {
      status: 'success',
      data: {
        domain,
        google: null,
        webArchive: null,
      }
    }

    if (!isValidDomain(domain)) {
      return {
        ...response,
        status: 'fail',
        message: 'Некорректное имя домена',
      }
    }
    const sourceMethods = {
      webArchive: async (domain: string) => {
        try {
          response.data.webArchive = await getWebArchiveInfo(domain)
        } catch (error) {
          const {message} = error as Error
          response.status = 'error'
          response.message = `[Web Archive] ${message ?? 'Ошибка'}`
        }
      },
      google: async (domain: string) => {
        try {
          response.data.google = await getGoogleInfo(domain)
        } catch (error) {
          const {message} = error as Error
          response.status = 'error'
          response.message = `[Google] ${message ?? 'Ошибка'}`
        }
      },
    }

    await Promise.all(source.map(sourceName => sourceMethods[sourceName]?.(domain)))

    return response
  }

  return {
    checkDomain,
  }
}
