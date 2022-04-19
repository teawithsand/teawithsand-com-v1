import { useEffect, useState } from "react"

export type UserActionHelperLastSubmitInfo<D, R> = {
    type: "idle",
    pageInfo?: undefined,
    error?: undefined,
    result?: undefined
} | {
    type: "pending",
    submitData: D,
    result?: undefined,
    error?: undefined,
} | {
    type: "ok",
    submitData: D,
    result: R,
    error?: undefined,
} | {
    type: "error",
    submitData: D,
    result?: undefined,
    error?: undefined,
}

export type UserActionHelperOperations<D> = {
    submit: (data: D) => void
}

export type UserActionHelper<D, R> = [
    UserActionHelperLastSubmitInfo<D, R>,
    UserActionHelperOperations<D>
]

export interface UserActionHelperOptions<D, PA, R> {
    handler: (data: D, parameters: PA) => Promise<R>
}

/**
 * Loaded, which loads multiple smaller resources and folds them into single bigger one.
 * It resets it's state, when one of parameters is changed.
 */
export const useUserActionHelper = <D, R, PA extends Array<any>>(
    options: UserActionHelperOptions<D, PA, R>,
    parameters: PA,
): UserActionHelper<D, R> => {
    const [loadQueue, setLoadQueue] = useState<D[]>([])
    const [lastLoadInfo, setLastLoadInfo] = useState<UserActionHelperLastSubmitInfo<D, R>>({
        type: "idle",
    })

    const getQueueElementAndLoad = async (isClosed: { current: boolean }) => {
        if (isClosed.current)
            return

        if (loadQueue.length === 0)
            return
        const submitData = loadQueue[0]
        setLastLoadInfo({
            type: "pending",
            submitData,
        })

        try {
            try {
                const v = await options.handler(submitData, parameters)
                if (!isClosed.current) {
                    setLastLoadInfo({
                        type: "ok",
                        submitData,
                        result: v,
                    })
                }
            } catch (e) {
                if (!isClosed.current) {
                    setLastLoadInfo({
                        type: "error",
                        submitData,
                        error: e,
                    })
                }
            }
        } finally {
            if (!isClosed.current) {
                const newQueue = [...loadQueue]
                newQueue.shift()
                setLoadQueue(newQueue)
            }
        }
    }

    useEffect(() => {
        let isClosed = { current: false }

        if (loadQueue.length > 0) {
            getQueueElementAndLoad(isClosed)
        }

        return () => {
            isClosed.current = true
        }
    }, [loadQueue])


    const opSubmit = (submitData: D) => {
        setLoadQueue([...loadQueue, submitData])
    }

    return [
        lastLoadInfo,
        {
            submit: opSubmit,
        }
    ]
}