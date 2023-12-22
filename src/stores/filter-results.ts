import type {Filter, IResult} from '@/stores/types'

const hasWebArchiveResult = (result: IResult) => result.webArchive?.img.length
const hasGoogleResult = (result: IResult) => result.google?.links.length

const isSuccessResult = (result: IResult) => result.status === 'complete'

export const filterResults = (results: IResult[], filter: Filter) => {
  return results.filter(result => {
    return (filter.hasWebArchiveResults ? !isSuccessResult(result) || hasWebArchiveResult(result) : true)
            && (filter.hasGoogleResults ? !isSuccessResult(result) || hasGoogleResult(result) : true)
  })
}
