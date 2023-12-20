/** Источники данных */
export type DomainSource = 'google' | 'webArchive'

/** Ссылки */
export interface LinkData {
  href: string
  innerText: string
  timestamp?: number
}

/** Результат WebArchive */
export interface WebArchiveData {
  img: string,
  links: LinkData[],
  error?: string,
}

/** Результат Google */
export interface GoogleData {
  amountStr: string,
  links: LinkData[],
  error?: string,
}

export interface SuccessDomainCheckResponse {
  status: 'success'
  data: {
    domain: string,
    webArchive?: WebArchiveData
    google?: GoogleData
  }
}

export interface FailDomainCheckResponse {
  status: 'fail'
  error: string
}

export type DomainCheckResponse = SuccessDomainCheckResponse | FailDomainCheckResponse