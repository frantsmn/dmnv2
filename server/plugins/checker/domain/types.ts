/**
 * Описание моделей бизнес-логики
 */

/**
 * Источники данных
 */
export type DomainSource = 'google' | 'webArchive'

/**
 * Интерфейс ссылки
 */
export interface LinkData {
  href: string
  innerText: string
  timestamp?: number
}

/**
 * Интерфейс результата о домене с WebArchive
 */
export interface WebArchiveData {
  img: string,
  links: LinkData[]
}

/**
 * Интерфейс результата о домене с Google поиска
 */
export interface GoogleData {
  amountStr: string,
  links: LinkData[]
}

////////////////////////////////////////////////////////////////////////////////

interface JSendResponse {
  data: any
  // fail - start condition
  // error - during request
  status: 'error' | 'fail' | 'success'
  message?: string
}

export interface DomainCheckResponse extends JSendResponse {
  data: {
    domain: string,
    webArchive: WebArchiveData | null
    google: GoogleData | null
  }
}
