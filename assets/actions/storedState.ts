/*
import { State } from "./defines"
import { UserData } from "./userAction"


export const STORED_STATE_STORAGE_KEY = "ss"

/*
const REFRESH_TOKEN_STORAGE_KEY = "rt"

export const persistRefreshToken = (token: string, localStorage: boolean = false) => {
    if (window.sessionStorage)
        window.sessionStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, token)
        
    if (window.localStorage && localStorage)
        window.localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, token)
}

export const clearPersistedToken = () => {
    if (window.localStorage) 
        window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY)
    
    if (window.sessionStorage) 
        window.sessionStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY)
}

export const readPersistedRefreshToken = (): string | null => {
    let token = null
    if (window.sessionStorage) {
        token = window.sessionStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)
    }
    if (token)
        return token

    if (window.localStorage) {
        token = window.localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)
    }

    return token
}
* /

export type StoredState = {
    version: 1,
    userData: UserData,
}

export const makeStoredState = (state: State): StoredState => {
    // this function always produces latest version
    // but user may have old one, which is allowed

    return {
        version: 1,
        userData: state.userData,
    }
}

export const clearStoredState = () => {
    if (window.localStorage)
        window.localStorage.removeItem(STORED_STATE_STORAGE_KEY)

    if (window.sessionStorage)
        window.sessionStorage.removeItem(STORED_STATE_STORAGE_KEY)
}

export const saveStoredState = (storedState: StoredState, target: "local" | "session" | "both") => {
    const serialized = JSON.stringify(storedState)

    if ((target === "both" || target === "session") && window.sessionStorage)
        window.sessionStorage.setItem(STORED_STATE_STORAGE_KEY, serialized)
    else if(window.sessionStorage)
        window.sessionStorage.removeItem(STORED_STATE_STORAGE_KEY)

    if ((target === "both" || target === "local") && window.localStorage)
        window.localStorage.setItem(STORED_STATE_STORAGE_KEY, serialized)
    else if(window.localStorage)
        window.localStorage.removeItem(STORED_STATE_STORAGE_KEY)
}

export const loadStoredState = (): StoredState | null => {
    let storedState = null
    if (window.localStorage) {
        storedState = storedState || window.localStorage.getItem(STORED_STATE_STORAGE_KEY)
    }
    // prefer session storage one
    if (window.sessionStorage) {
        storedState = storedState || window.sessionStorage.getItem(STORED_STATE_STORAGE_KEY)
    }

    if (!storedState)
        return null;

    return JSON.parse(storedState)
}

export const mergeStoredState = (defaultState: State, storedState: StoredState): State => {
    return {
        ...defaultState,
        userData: storedState.userData,
    }
}
*/