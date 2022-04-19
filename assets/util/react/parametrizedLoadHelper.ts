import { useEffect, useRef, useState } from "react"
import { useIsMounted } from "../mountedHook"

type ErrorData = {
    hasLastLoadingError: boolean,
    lastLoadingError?: any,
}

type ReturnData<E> = {
    state: "pending" | "ready",
    aggregated: E,
    hasError: boolean,
    error?: any,
}

export type ParametrizedLoadHelperReturn<P, V, E> = [
    ReturnData<E>,
    (newLoadedValues: Map<P, V> | null) => void,
    (parameterToLoad: P) => void,
]


export interface ParametrizedLoadHelperOptions<P, V, E> {
    // Note: this value must not depend on any props/external values,
    //  since it won't be triggered again if these change
    //
    // Instead use useEffect hook with calls to setter data and loading new data simultaneously
    initializer?: () => P,
    loader: (parameter: P) => Promise<V>,
    aggregator: (loadedValues: Map<P, V>) => E,

    onNewValueLoaded?: (parameter: P, value: V) => void,
    onLoadingError?: (parameter: P, error: any) => void,
}


export const useParametrizedLoadHelper = <P, V, E>(options: ParametrizedLoadHelperOptions<P, V, E>): ParametrizedLoadHelperReturn<P, V, E> => {
    const isMounted = useIsMounted()

    const [loadedValuesMap, setLoadedValuesMap] = useState<Map<P, V>>(new Map)
    const [aggregatedValue, setAggregatedValue] = useState<E>(options.aggregator(new Map))
    const [loaderPromiseData, setLoaderPromiseData] = useState<({
        parameter: P,
        promise: Promise<V>,
    } | null)>(null)
    const [lastLoadingError, setLastLoadingError] = useState<ErrorData>({
        hasLastLoadingError: false,
    })

    const setLoadedValues = (newLoadedValues: Map<P, V> | null) => {
        newLoadedValues = newLoadedValues ?? new Map
        setLoadedValuesMap(newLoadedValues)
        setAggregatedValue(options.aggregator(newLoadedValues))
    }

    const loadParameter = (parameterToLoad: P) => {
        setLoaderPromiseData({
            parameter: parameterToLoad,
            promise: options.loader(parameterToLoad),
        })
    }

    useEffect(() => {
        if (isMounted.current && !loaderPromiseData && options.initializer) {
            const parameter = options.initializer()
            setLoaderPromiseData({
                parameter,
                promise: options.loader(parameter),
            })
        }
    }, [])

    useEffect(() => {
        let isClosed = false

        if (loaderPromiseData) loaderPromiseData.promise
            .then(v => {
                if (!isClosed && isMounted.current) {
                    const newMap = new Map(loadedValuesMap)
                    newMap.set(
                        loaderPromiseData.parameter, v
                    )

                    setLoadedValuesMap(newMap)
                    setAggregatedValue(options.aggregator(newMap))
                    setLastLoadingError({
                        hasLastLoadingError: false,
                    })

                    if (options.onNewValueLoaded)
                        options.onNewValueLoaded(loaderPromiseData.parameter, v)
                }
            })
            .catch(e => {
                if (!isClosed && isMounted.current) {
                    setLastLoadingError({
                        hasLastLoadingError: true,
                        lastLoadingError: e,
                    })

                    if (options.onLoadingError)
                        options.onLoadingError(loaderPromiseData.parameter, e)
                }
            })
            .finally(() => {
                if (!isClosed && isMounted.current) {
                    setLoaderPromiseData(null)
                }
            })

        return () => {
            isClosed = true
        }
    }, [loaderPromiseData?.promise])

    return [
        {
            state: loaderPromiseData !== null ? "pending" : "ready",
            aggregated: aggregatedValue,
            hasError: lastLoadingError.hasLastLoadingError,
            error: lastLoadingError.lastLoadingError,
        },
        setLoadedValues,
        loadParameter,
    ]

}