import { LoggedUserData, SetUserDataAction } from "@app/actions/userAction";
import { getAnonymousHttpClient, HttpClient } from "@app/util/httpClient";
import { dropCookieToken as clearCookieToken, readCookieToken } from "./cookieload";
import { makeUserProfileClient as makeUserProfileApiClient } from "./profile";
import { getRefreshTokenForNativeUser } from "./token";
import { parseToken } from "./tokenParse";

export type UserLoginResult = {
    userData: LoggedUserData,
    action: SetUserDataAction,
}

export const loginUserFromRefreshToken = async (client: HttpClient, refreshToken: string): Promise<UserLoginResult> => {
    const parsedToken = parseToken(refreshToken, "refresh")
    const profileApi = makeUserProfileApiClient(client)
    const profileData = await profileApi.getPublicProfileInfo(parsedToken.uid)

    const userData: LoggedUserData = {
        type: "logged-in",
        profile: {
            ...profileData,
            id: parsedToken.uid,
        },
        refreshToken,
    }

    return {
        userData,
        action: {
            type: "TWSAPI/user/set-user-data",
            userData,
        }
    }
}

export const loginCookieTokenUser = async (client?: HttpClient): Promise<UserLoginResult | null> => {
    client = client ?? getAnonymousHttpClient()
    const refreshToken = readCookieToken()
    if (!refreshToken) {
        return null
    }

    clearCookieToken()

    const parsed = parseToken(refreshToken, "refresh")
    if (parsed.isExpiredAt()) {
        return null
    }


    return await loginUserFromRefreshToken(client, refreshToken)
}

export const loginNativeUser = async ({
    login,
    password,
    client,
}: {
    login: string,
    password: string,
    client?: HttpClient,
}): Promise<UserLoginResult> => {
    const refreshToken = await getRefreshTokenForNativeUser({
        login, password
    })

    client = client ?? getAnonymousHttpClient()

    return loginUserFromRefreshToken(client, refreshToken)
}

export const logoutUser = (): {
    action: SetUserDataAction,
} => ({
    action: {
        type: "TWSAPI/user/set-user-data",
        userData: {
            type: "not-logged-in",
        }
    },
})