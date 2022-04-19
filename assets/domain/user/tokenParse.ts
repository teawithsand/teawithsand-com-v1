import jwt_decode from "jwt-decode"
import { string } from "prop-types"

export type TokenKind = "refresh" | "resetPassword" /* | "auth"*/

export type ParsedJwt = {
    exp: number,
    iat: number,
    nce: string,
    uid: string,

    tokenString: string,

    kind: TokenKind,

    isExpiredAt: (date?: Date) => boolean,
    isValidAt: (date?: Date) => boolean
}

export const parseToken = (token: string, kind: TokenKind): ParsedJwt => {
    const res = jwt_decode<any>(token)

    const isExpiredAt = (date?: Date) => {
        let newDate = date ?? new Date()
        const expiration = new Date(res.exp * 1000)

        return newDate >= expiration
    }

    const isValidAt = (date?: Date) => {
        return !isExpiredAt(date)
    }

    return {
        tokenString: token,

        exp: res.exp,
        iat: res.iat,
        nce: res.nce,
        uid: res.uid,

        kind,
        
        isExpiredAt,
        isValidAt,
    }
}