import { Toast } from "@app/domain/toast/toast";
import { State } from "./defines";

export type AddToastAction = {
    type: "TWSAPI/toast/add",
    toast: Toast,
}

export type RemoveToastAction = {
    type: "TWSAPI/toast/remove",
    toast: Toast,
}

export type RemoveAllToastsAction = {
    type: "TWSAPI/toast/remove-all",
}

export const toastSelector = (state: State) => state.toasts