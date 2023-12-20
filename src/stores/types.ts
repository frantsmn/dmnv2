import type {GoogleData, WebArchiveData} from '@domain'

/** Сортировка результатов */
export type Sort = 'alphabet' | 'age' | 'default'

/** Фильтры результатов */
export type Filter = {
  isHideEmptyWebArchiveResults: boolean
  isHideEmptyGoogleResults: boolean
}

/** Статус результата */
export type Status = 'idle' | 'fetching' | 'success' | 'fail'

/** Результат */
export interface IResult {
  /** Индекс домена */
  index: number
  /** Имя домена */
  domain: string
  /** Состояние результата по домену */
  status: Status
  /** Данные WebArchive */
  webArchive?: WebArchiveData,
  /** Данные Google */
  google?: GoogleData,
  /** Ошибка проверки (запроса) */
  error?: string,
}