import { Action, State } from "./defines";

export default (state: State, action: Action): State => {
    switch (action.type) {
        case "TWSAPI/theme/set-theme":
            return {
                ...state,
                theme: action.theme,
            }
        case "TWSAPI/user/set-user-data":
            return {
                ...state,
                userData: action.userData,
            }
        case "TWSAPI/toast/add":
            return {
                ...state,
                toasts: [...state.toasts, action.toast]
            }
        case "TWSAPI/toast/remove":
            return {
                ...state,
                toasts: state.toasts.filter((t) => t != action.toast)
            }
        case "TWSAPI/toast/remove-all":
            return {
                ...state,
                toasts: [],
            }
        case "TWSAPI/cookies/accept":
            return {
                ...state,
                isAcceptedCookies: true,
            }
        case "TWSAPI/cookies/reset":
            return {
                ...state,
                isAcceptedCookies: false,
            }
        default:
            return state
    }
}