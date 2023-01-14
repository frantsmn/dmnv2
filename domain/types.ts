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
