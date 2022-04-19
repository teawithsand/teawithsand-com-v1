import { useState } from "react"

export type AutonomousModalResultMessage<D> = {
    type: "success",
    data: D,
} | {
    type: "error",
    error: any,
}

export interface AutonomousModalProps<D, M> {
    data: D | undefined,
    sendMessage: (msg: M) => void,
    hide: () => void,
}

export interface AutonomousModalHelper<D, M> extends AutonomousModalProps<D, M> {
    setData: (data: D) => void,
    isShown: boolean,
}

export const useAutonomousModalHelper = <D, M>(callbacks: {
    onModalMessage?: (msg: M) => void,
    onModalClosed?: () => void,
}): AutonomousModalHelper<D, M> => {
    const [data, setData] = useState<D | undefined>(undefined)

    return {
        data,
        setData,
        isShown: data !== undefined,

        sendMessage: (msg: M) => {
            if (callbacks.onModalMessage)
                callbacks.onModalMessage(msg)
        },
        hide: () => {
            if (data !== undefined) {
                if (callbacks.onModalClosed) {
                    callbacks.onModalClosed()
                }
            }
            
            setData(undefined)
        }
    }
}