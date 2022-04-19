import { useEffect, useState } from "react"

export type NewLoadHelperResult<T, D> =
    {
        type: "pending",
        parameter: D,

        value?: undefined,
        error?: undefined,
    } | {
        type: "loaded",
        parameter: D,

        value: T,

        error?: undefined,
    } | {
        type: "error",
        parameter: D,

        value?: undefined,
        error: any,
    }

export type NewLoadHelperReturn<T, D> = [
    NewLoadHelperResult<T, D>,
    (data: D, forceReload?: boolean) => void,
    () => void,
]

export interface NewLoadHelperOptions<T, D> {
    loader: (parameter: D) => Promise<T>,
    parameterInitializer: () => D,
}

export const useNewLoadHelper = <T, D>(
    options: NewLoadHelperOptions<T, D>,
): NewLoadHelperReturn<T, D> => {
    const { loader, parameterInitializer } = options

    const [parameter, setParameter] = useState(parameterInitializer())
    const [realoadTriggerParameter, setReloadTriggerParameter] = useState(0)
    const [result, setResult] = useState<null | {
        type: "ok",
        value: T,
        error?: undefined,
    } | {
        type: "err",
        error: any,
        value?: undefined,
    }>(null)

    useEffect(() => {
        let isClosed = false

        setResult(null)
        loader(parameter)
            .then(r => {
                if (!isClosed) setResult({
                    type: "ok",
                    value: r,
                })

            })
            .catch(e => {
                if (!isClosed) setResult({
                    type: "err",
                    error: e,
                })
            })

        return () => {
            isClosed = true
        }
    }, [parameter, realoadTriggerParameter])

    let res: NewLoadHelperResult<T, D>
    if (result === null) {
        res = {
            type: "pending",
            parameter,
        }
    } else if (result.type === "ok") {
        res = {
            type: "loaded",
            parameter,
            value: result.value,
        }
    } else if (result.type === "err") {
        res = {
            type: "error",
            parameter,
            error: result.error,
        }
    }

    const setData = (data: D, forceReload: boolean = false) => {
        if (data != parameter) {
            setParameter(data)
        } else if (forceReload) {
            setReloadTriggerParameter(realoadTriggerParameter + 1)
        }
    }
    const reload = () => {
        setReloadTriggerParameter(realoadTriggerParameter + 1)
    }

    return [res, setData, reload]
}