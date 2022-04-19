/**
 * Promise, which can be resolved later using external callbacks returned.
 */
export const latePromise = <T>(): [Promise<T>, (value: T) => void, (e: any) => void] => {
    let rejector: null | ((error: any) => void) = null
    let resolver: null | ((value: T) => void) = null

    let isValueSet = false
    let isErrorSet = false
    let value: T = null as any
    const p = new Promise<T>((resolve, reject) => {
        if (isValueSet) {
            resolve(value)
        } else if (isErrorSet) {
            reject(value)
        } else {
            resolver = resolve
            rejector = reject
        }
    })

    return [
        p,
        (v) => {
            if (resolver != null)
                resolver(v)
            else
                value = v
        },
        (err) => {
            if (rejector != null)
                rejector(err)
            else
                value = err
        }
    ]
}

export const sleep = (millis: number) => {
    const [promise, resolve, _] = latePromise<void>()
    const timeout = setTimeout(resolve, millis)
    let closed = false
    return [
        promise,
        () => {
            if (!closed) {
                clearInterval(timeout)
                closed = true
            }
        }
    ]
}


export const simpleSleep = (millis: number): Promise<void> => {
    const [promise, resolve, _] = latePromise<void>()
    const timeout = setTimeout(resolve, millis)
    return promise
}