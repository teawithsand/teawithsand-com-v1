import { getAnonymousHttpClient } from "@app/util/httpClient"

/*
export const getAuthTokenFromRefreshToken = async (token: string): Promise<string> => {
    const response = await getApiHttpClient().post("/api/v1/token/refresh/exchange", {
        token,
    })

    return response.data.token
}
*/

export const getRefreshTokenForNativeUser = async ({
    login,
    password
}: {
    login: string,
    password: string
}): Promise<string> => {
    const response = await getAnonymousHttpClient().post("/api/v1/token/refresh/issue", {
        login,
        password,
    })

    return response.data.token
}