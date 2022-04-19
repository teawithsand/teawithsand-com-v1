import { HttpClient } from "@app/util/httpClient";
import { assertIdValid } from "@app/util/id";

export type RegistrationData = {
    login: string,
    password: string,
    email: string,
    captchaResponse: string,
}

export const changePassword = async (client: HttpClient, uid: string, password: string): Promise<void> => {
    assertIdValid(uid)

    await client.post("/api/v1/profiles/" + uid + "/native/change-password", {
        password,
    })
}

export const resetPasswordInit = async (client: HttpClient, data: {
    email: string,
    captchaResponse: string,
    publicName?: undefined
}/*
 | {
    email?: undefined,
    publicName: string,
}
*/) => {
    // for now public name variant is NIY

    await client.post("/api/v1/profile/native/reset-password/init", {
        ...data,
    })
}



export const resetPasswordFinalize = async (client: HttpClient, data: {
    id: string,
    token: string,
    password: string,
}) => {
    assertIdValid(data.id)
    // for now public name variant is NIY

    await client.post("/api/v1/profiles/" + data.id + "/native/reset-password/finalize", {
        token: data.token,
        password: data.password,
    })
}

