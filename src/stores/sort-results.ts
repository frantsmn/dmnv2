export const sortByAlphabet = (items: any[]) => {
  return items.sort((a, b) => {
    if (a.domain > b.domain) {
      return 1
    }
    if (a.domain < b.domain) {
      return -1
    }
    return 0
  })
}

export const sortByAge = (items: any[]) => {
  return items.sort((a, b) => {
    const $a = a.webArchive?.links[0]?.timestamp ?? 0
    const $b = b.webArchive?.links[0]?.timestamp ?? 0

    return $a - $b
  })
}
