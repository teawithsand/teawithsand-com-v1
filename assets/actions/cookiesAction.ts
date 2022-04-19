import { State } from "./defines";

export type AcceptCookiesAction = {
    type: "TWSAPI/cookies/accept",
}

export type ResetCookiesAction = {
    type: "TWSAPI/cookies/reset",
}


export const acceptedCookiesSelector = (state: State) => state.isAcceptedCookies