import { useState } from "react"

export type ModalHelperReturn<D> = {
    show(data: D): void
    hide(): void

    isShow: boolean,
    state: "shown",
    data: D,
} | {
    show(data: D): void
    hide(): void

    isShow: boolean,
    state: "hidden",
    data?: undefined,
}

export interface ModalHelperOptions {
    // defaults to false
    isShow?: boolean
}

// TODO(teawithsand): special hooks to redux state store to prevent multiple dialogs at the same time

export const useModalHelper = <D>(options: ModalHelperOptions): ModalHelperReturn<D> => {
    const [showModal, setShowModal] = useState(options.isShow ?? false)
    const [showData, setShowData] = useState<D>(undefined)
    const show = (data: D) => {
        setShowData(data)
        setShowModal(true)
    }
    const hide = () => {
        setShowModal(false)
    }

    if (showModal) {
        return {
            show,
            hide,
            isShow: true,
            state: "shown",
            data: showData as D,
        }
    } else {
        return {
            show,
            hide,
            isShow: false,
            state: "hidden",
        }
    }
}