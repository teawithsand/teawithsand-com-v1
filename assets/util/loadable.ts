export type Loadable<T> = {
    state: "loaded",
    data: T,
} | {
    state: "loading",
} | {
    state: "error",
    error: Error,
}

export const dispatchLoadable = <T>(data: Loadable<T>): T | null => {
    if (data.state === "loaded") {
        return data.data
    } else if (data.state === "error") {
        throw data.error
    } else {
        return null
    }
}

export const dispatchLoadableCallback = <T>({
    data,
    onLoaded,
    onLoading,
    onError,
}: {
    data: Loadable<T>,
    onLoaded?: (data: T) => void,
    onLoading?: () => void,
    onError?: (error: Error) => void,
}) => {
    if (data.state === "loaded") {
        if (onLoaded)
            onLoaded(data.data)
    } else if (data.state === "error") {
        if (onError)
            onError(data.error)
    } else {
        if (onLoading)
            onLoading()
    }
}

export const dispatchLoadableReturn = <T, R>({
    data,
    onLoaded,
    onLoading,
    onError,
}: {
    data: Loadable<T>,
    onLoaded: (data: T) => R,
    onLoading: () => R,
    onError: (error: Error) => R,
}): R => {
    if (data.state === "loaded") {
        return onLoaded(data.data)
    } else if (data.state === "error") {
        return onError(data.error)
    } else {
        return onLoading()
    }
}

export const loadableFromPromise = <T>(promise: Promise<T>, onChanged: (loadable: Loadable<T>) => void) => {
    let isDone = false
    promiseToLoadable(promise)
        .then((res) => {
            isDone = true
            onChanged(res)
        })
    if (!isDone) {
        onChanged({
            state: "loading",
        })
    }
}


export const promiseToLoadable = async <T>(promise: Promise<T>): Promise<Loadable<T>> => {
    try {
        const res = await promise
        return {
            state: "loaded",
            data: res,
        }
    } catch (e) {
        if (e instanceof Error) {
            return {
                state: "error",
                error: e,
            }
        } else {
            return {
                state: "error",
                error: new Error(e),
            }
        }
    }
}