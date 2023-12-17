import type {GoogleData, WebArchiveData} from '../../../domain/types'

export type Status = 'awaiting' | 'pending' | 'success' | 'fail'

export interface IResult {
  index: number,
  domain: null | string
  status: Status
  webArchive: WebArchiveData | null,
  google: GoogleData | null,
  message: string | null,
}
