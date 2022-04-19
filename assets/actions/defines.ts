import Toast from "@app/domain/toast/toast"
import { AcceptCookiesAction, ResetCookiesAction } from "./cookiesAction"
import { SetThemeAction, Theme } from "./themeAction"
import { AddToastAction, RemoveAllToastsAction, RemoveToastAction } from "./toastAction"
import { SetUserDataAction, UserData } from "./userAction"

export type Action = SetThemeAction | SetUserDataAction | AddToastAction | RemoveToastAction | RemoveAllToastsAction | AcceptCookiesAction | ResetCookiesAction

export type State = {
    version: 1,
    theme: Theme,
    userData: UserData,
    toasts: Toast[],

    isAcceptedCookies: boolean,
}

export const initialState: State = {
    version: 1,
    theme: "light",
    userData: {
        type: "not-logged-in",
    },
    toasts: [],
    isAcceptedCookies: false,
}