/*
import { State } from "@app/actions/defines"
import { SetAuthTokenWithRefreshTokenAction } from "@app/actions/userAction"
import OperationQueue from "@app/util/operationQueue"
import { Store } from "redux"
import { getAuthTokenFromRefreshToken, getRefreshTokenForNativeUser } from "./token"
import { parseToken } from "./tokenParse"

export type TokenManagerHandle = {
    close: () => void
}

const expirationThreshold = 5000

const tokenOperationQueue = new OperationQueue(2)

const setTokenInterval = (token: string, job: () => Promise<void>): {
    close: () => void
} => {
    const parsedToken = parseToken(token, "auth") // TODO(teawithsand): fixme parse token auth
    const expiresAt = parsedToken.exp
    const now = new Date

    const timeToExpire = (expiresAt - now.getTime())
    const isExpired = timeToExpire < expirationThreshold
    let currentTimeout: any | null = null
    if (!isExpired) {
        currentTimeout = setTimeout(() => {
            currentTimeout = null
            tokenOperationQueue.enqueueOperation(job)
        }, timeToExpire - expirationThreshold)
    } else {
        tokenOperationQueue.enqueueOperation(job)
    }


    const close = () => {
        if (currentTimeout !== null) {
            clearTimeout(currentTimeout)
        }
    }

    return { close: close }
}

/**
 * Manages auth token's expiration.
 * /
 export const manageNewToken = ({
    refreshToken,
    onNewToken,
}: {
    refreshToken: string,
    onNewToken: (newToken: string | null, error: any) => void,
}): TokenManagerHandle => {
    let prevCanceler: (() => void) | null = null
    let isClosed = false

    let jobHandler: (() => Promise<void>) = null

    const job = async () => {
        if (isClosed)
            return
        try {
            if (prevCanceler !== null) {
                prevCanceler()
                prevCanceler = null
            }
            const authToken = await getAuthTokenFromRefreshToken(refreshToken)
            parseToken(authToken, "auth") // check if it's valid

            prevCanceler = setTokenInterval(authToken, jobHandler).close

            onNewToken(authToken, null)
        } catch (e) {
            onNewToken(null, e)
        }
    }

    jobHandler = job

    tokenOperationQueue.enqueueOperation(job)
    return {
        close: () => {
            if (prevCanceler !== null) {
                prevCanceler()
                prevCanceler = null
                isClosed = true
            }
        },
    }
}

export const attachTokenHandle = (store: Store) => {
    store.subscribe(() => {
        const state = store.getState() as State
        let refreshToken = ""
        if (state.userData.type === "logged-in") {
            refreshToken = state.userData.refreshToken
        }

        if (refreshToken !== "") {
            let closer = null
            let isClosed = false
            closer = manageNewToken({
                refreshToken,
                onNewToken: (token, error) => {
                    if (token) {
                        const action: SetAuthTokenWithRefreshTokenAction = {
                            type: "set-auth-token-with-refresh-token",
                            authToken: token ?? "",
                            refreshToken: refreshToken,
                        }
                        store.dispatch(action)
                    }
                }
            }).close
        }
    })
}
*/