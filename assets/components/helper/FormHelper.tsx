import * as React from "react"
import LoadingSpinner from "../LoadingSpinner"

/**
 * 
 * @deprecated use function based load helper
 */
const loader = <T,>(
    props: {
        render: (
            result: T | undefined,
            error: any | undefined,
            setPromise: (p: Promise<T>) => void
        ) => React.ReactElement,
        close?: () => void,
    }
) => {
    const { render, close } = props
    const [result, setResult] = React.useState<
        {
            type: "success",
            value: T,
            error?: undefined,
        } | {
            type: "error",
            error: any,
            value?: undefined,
        } | null
    >(null)

    const [promise, setPromise] = React.useState<Promise<T> | null>(null)

    React.useEffect(() => {
        let isClosed = false
        if (promise !== null) {
            promise
                .then(r => {
                    if (isClosed) setResult({
                        type: "success",
                        value: r,
                        error: undefined,
                    })
                })
                .catch(e => {
                    if (isClosed) setResult({
                        type: "error",
                        error: e,
                        value: undefined,
                    })
                })
        }

        return () => {
            isClosed = true
            if (close) close()
        }
    }, [promise]) // rerender only if promise has changed, AKA data has changed, not render or close

    if (!result)
        return <LoadingSpinner />

    return render(result.value, result.error, setPromise)
}

export default loader