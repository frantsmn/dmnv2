export const asyncDelay = (ms: number) =>
    new Promise((resolve) => {
        setTimeout(() => resolve(true), ms)
    })
