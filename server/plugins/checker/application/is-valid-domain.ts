export const isValidDomain = (domain: string) => {
    return /^(?!:\/\/)([а-яА-Яa-zA-Z0-9-_]+\.)*[а-яА-Яa-zA-Z0-9][а-яА-Яa-zA-Z0-9-_]+\.[а-яА-Яa-zA-Z]{2,11}?$/igm.test(domain)
}
