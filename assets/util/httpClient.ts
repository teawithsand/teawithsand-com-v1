import { State } from "@app/actions/defines"
import axios, { Axios, AxiosRequestConfig } from "axios"
import { useSelector } from "react-redux"

// TODO(teawithsand): attach these headers only to local request to /api* urls
/*
axios.interceptors.request.use(function (config: AxiosRequestConfig) {
    config = config ?? {}

    if (config.url) {
        const url = new URL(config.url)

    }
    /*
    config.headers = {
        "content-type": "application/json",
        "accept": "application/json",
        ...config.headers,
    }
    * /

    return config
}, (error) => error)
*/
/*

let apiToken = ""
export const setApiToken = (token: string) => {
    apiToken = token
}

export const unsetApiToken = () => setApiToken("")
*/

export const getAnonymousHttpClient = (config?: AxiosRequestConfig): Axios => {
    config = {
        timeout: 10_000,
        ...config,

        /*
         headers: {
             "accept": "application/json",
             ...config.headers
         },
         */

    }
    return axios.create(config)
}

export type HttpClient = Axios

/**
 * React hook for using API client.
 */
export const useApiClient = (): HttpClient => {
    const refreshToken = useSelector((state: State) => {
        if (state.userData.type === "logged-in")
            return state.userData.refreshToken
        return ""
    })

    if (refreshToken) {
        return getAnonymousHttpClient({
            headers: {
                "Authorization": `Bearer ${refreshToken}`,
                "Accept": "application/json",
            }
        })
    } else {
        return getAnonymousHttpClient({
            headers: {
                "Accept": "application/json",
            }
        })
    }
}