import { getAnonymousHttpClient, HttpClient } from "@app/util/httpClient"
import { assertIdValid } from "@app/util/id"

export type PublicProfileInfo = {
    publicName: string
}

export type PrivateProfileInfo = {
    publicName: string,
    email: string,
}

export const makeUserProfileClient = (client: HttpClient) => {
    return {
        getPublicProfileInfo: async (id: string): Promise<PublicProfileInfo> => {
            assertIdValid(id)
            const res = await client
                .get(`/api/v1/profiles/${id}`)
            return res.data
        },

        getPrivateProfileInfo: async (id: string): Promise<PrivateProfileInfo> => {
            assertIdValid(id)
            const res = await client
                .get(`/api/v1/profiles/${id}/details`)
            return res.data
        }
    }
}

