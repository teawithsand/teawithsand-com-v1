/*
 * Contains components for hack that I am using for logging in use from socials. 
 * Instead of doing some propper transfer of token, which backends receives I write it into a cookie.
 * Such cookie should be erased ASAP and token should be written into local storage, where user login token is intended to live.
 */

import Cookies from "universal-cookie/es6"

const transferCookieName = "rtt"

export const readCookieToken = (): string | null => {
    const cookies = new Cookies()
    const token = cookies.get(transferCookieName) || null

    return token
}

export const dropCookieToken = () => {
    const cookies = new Cookies()
    cookies.remove(transferCookieName)
}
