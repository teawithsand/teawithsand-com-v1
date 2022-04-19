import { HttpClient } from "@app/util/httpClient";
import { assertIdValid } from "@app/util/id";

export type RegistrationData = {
    login: string,
    password: string,
    email: string,
    captchaResponse: string,
}

export const registerNativeUser = async (client: HttpClient, data: RegistrationData): Promise<void> => {
    await client.post("/api/v1/registrations", data)
}
export type ResendRegistrationEmailData = {
    login: string,
    email: string,
    captchaResponse: string
}

export const resendRegistrationEmail = async (client: HttpClient, data: ResendRegistrationEmailData): Promise<void> => {
    await client.post("/api/v1/registration/resend-email", data)
}

export type ConfirmRegistrationData = {
    token: string,
    id: string
}

export const confirmRegistration = async (client: HttpClient, data: ConfirmRegistrationData): Promise<void> => {
    assertIdValid(data.id)

    await client.post("/api/v1/registrations/" + data.id + "/confirm", {
        emailConfirmNonce: data.token,
    })
}