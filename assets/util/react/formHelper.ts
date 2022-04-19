import { useEffect, useState } from "react"
import { useIsMounted } from "../mountedHook"

export type LoadHelperResult<T> =
    {
        type: "idle",
        value?: undefined,
        error?: undefined,
    } | {
        type: "pending",
        value?: undefined,
        error?: undefined,
    } | {
        type: "loaded",
        value: T,
        error?: undefined,
    } | {
        type: "error",
        value?: undefined,
        error: any,
    }

/**
 * @deprecated Use callbacks directly in method passed to setPromise instead.
 */
export type LoadHelperCallbacks<T> = {
    onSuccess?: (value: T) => void,
    onError?: (err: any) => void,
}

/**
 * @deprecated use some less quirky util for all these tasks
 */
export const useLoadHelper = <T>(
    {
        basePromise,
        callbacks,
    }: {
        basePromise?: Promise<T> | null,
        callbacks?: LoadHelperCallbacks<T>,
    }
): [
        LoadHelperResult<T>,
        (promise: Promise<T> | null) => void,
    ] => {
    const [promise, setPromise] = useState<Promise<T> | null>(basePromise ?? null)
    const [result, setResult] = useState<null | {
        type: "ok",
        value: T,
        error?: undefined,
    } | {
        type: "err",
        error: any,
        value?: undefined,
    }>(null)

    const isMounted = useIsMounted()

    useEffect(() => {
        let isClosed = false

        if (promise) {
            promise
                .then(r => {
                    if (!isClosed && isMounted.current) {
                        if (callbacks?.onSuccess) {
                            callbacks.onSuccess(r)
                        }
                        setResult({
                            type: "ok",
                            value: r,
                        })
                    }
                })
                .catch(e => {
                    if (!isClosed && isMounted.current) {
                        if (callbacks?.onError) {
                            callbacks.onError(e)
                        }
                        setResult({
                            type: "err",
                            error: e,
                        })
                    }
                })
        }

        return () => {
            isClosed = true
        }
    }, [promise])

    let res: LoadHelperResult<T>
    if (result === null) {
        if (promise === null) {
            res = {
                type: "idle",
            }
        } else {
            res = {
                type: "pending",
            }
        }
    } else if (result.type === "ok") {
        res = {
            type: "loaded",
            value: result.value,
        }
    } else if (result.type === "err") {
        res = {
            type: "error",
            error: result.error,
        }
    }

    return [res, setPromise]
}