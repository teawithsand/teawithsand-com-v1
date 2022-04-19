import { State } from "./defines"

export type ProfileData = {
    id: string,
    publicName: string,
}

export type LoggedUserData = {
    type: "logged-in",
    profile: ProfileData,

    refreshToken: string,
}

export type UserData = {
    type: "not-logged-in",
} | LoggedUserData


export const userDataSelector = (state: State): ProfileData | null => {
    if (state.userData.type !== "logged-in") {
        return null;
    }
    return state.userData.profile
}

export type SetUserDataAction = {
    type: "TWSAPI/user/set-user-data",
    userData: UserData,
}
/*
export type SetSessionUserDataAction = {
    type: "set-session-user-data",
    sessionUserData: SessionUserData,
}

export type SetAuthTokenWithRefreshTokenAction = {
    type: "set-auth-token-with-refresh-token",
    authToken: string,
    refreshToken: string,
}
*/