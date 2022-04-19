import * as React from "react"
import ErrorBar from "../ErrorBar"
import LoadingSpinner from "../LoadingSpinner"
/**
 * @deprecated use hook based load helper
 */
const loader = <T,>(
    props: {
        promise: Promise<T>,
        render: (result: T) => React.ReactElement,
        close?: () => void,
    }
) => {
    const { promise, render, close } = props
    const [result, setResult] = React.useState(null)
    React.useEffect(() => {
        let isClosed = false
        promise
            .then(r => {
                if (isClosed)
                    setResult({
                        type: "success",
                        value: r,
                    })
            })
            .catch(e => {
                if (isClosed)
                    setResult({
                        type: "error",
                        error: e,
                    })
            })

        return () => {
            isClosed = true

            if (close)
                close()
        }
    }, [promise]) // rerender only if promise has changed, AKA data has changed, not render or close

    if (!result)
        return <LoadingSpinner />

    if (result.type === "error")
        return <ErrorBar error={result.error} />

    return render(result.value)
}

export default loader