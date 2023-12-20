import type {Filter, IResult} from '@/stores/types'

const hasWebArchiveResult = (result: IResult) => result.webArchive?.img.length
const hasGoogleResult = (result: IResult) => result.google?.links.length

export const filterResults = (results: IResult[], filter: Filter) => {
  return results.filter(result => {
    return (filter.isHideEmptyWebArchiveResults ? hasWebArchiveResult(result) : true)
            && (filter.isHideEmptyGoogleResults ? hasGoogleResult(result) : true)
  })
}
