import { AddToastAction } from "@app/actions/toastAction"
import { string } from "prop-types"

export type ToastType = "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark"
export const defaultToastType: ToastType = "light"

export type Toast = {
    id: string,
    title: string,
    message: string,
    type: ToastType,
    displayCreatedAtMillis: number,
    orderCreatedAtMillis: number,
    hideAfterMillis?: number,
}

export default Toast

export type ToastWithAction = {
    toast: Toast,
    action: AddToastAction,
}

export const makeAddAction = (toast: Toast): AddToastAction => ({
    type: "TWSAPI/toast/add",
    toast,
})

export const makeToastId = () => {
    return `${Math.round(Math.random() * 1000000)}`
}

export const makeSimpleToast = ({
    title,
    message,
    timeout,
    type,
}: {
    title: string,
    message: string,
    timeout?: number,
    type?: ToastType
}): Toast => {
    const now = new Date()
    if (timeout !== undefined) {
        return {
            id: makeToastId(),
            title,
            message,
            displayCreatedAtMillis: now.getTime(),
            orderCreatedAtMillis: now.getTime(),
            hideAfterMillis: timeout,
            type: type ?? defaultToastType,
        }
    } else {
        return {
            id: makeToastId(),
            title,
            message,
            displayCreatedAtMillis: now.getTime(),
            orderCreatedAtMillis: now.getTime(),
            type: type ?? defaultToastType,
        }
    }
}

export const makeSimpleToastWithAction = ({
    title,
    message,
    timeout,
    type
}: {
    title: string,
    message: string,
    timeout?: number,
    type?: ToastType,
}): ToastWithAction => {
    const now = new Date()
    let toast: Toast
    if (timeout !== undefined) {
        toast = {
            id: makeToastId(),
            title,
            message,
            displayCreatedAtMillis: now.getTime(),
            orderCreatedAtMillis: now.getTime(),
            hideAfterMillis: timeout,
            type: type ?? defaultToastType,
        }
    } else {
        toast = {
            id: makeToastId(),
            title,
            message,
            displayCreatedAtMillis: now.getTime(),
            orderCreatedAtMillis: now.getTime(),
            type: type ?? defaultToastType,
        }
    }

    return {
        toast,
        action: makeAddAction(toast),
    }
}