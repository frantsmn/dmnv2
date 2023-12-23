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

/** Ответ бэка DomainChecker */
export interface DomainCheckResponse {
  webArchive?: WebArchiveData
  // google?: GoogleData
}
