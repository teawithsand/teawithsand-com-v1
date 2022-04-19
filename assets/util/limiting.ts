export const debounce = <T extends Function>(cb: T, wait: number = 200) => {
    let h: any = null
    let callable = (...args: any) => {
        if (h !== null) {
            clearTimeout(h)
        }
        h = setTimeout(() => cb(...args), wait)
    };
    return [
        callable as any as T,
        () => {
            clearTimeout(h)
            h = null
        }
    ]
}