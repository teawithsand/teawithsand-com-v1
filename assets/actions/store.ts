import { useDispatch } from "react-redux"
import { applyMiddleware, createStore } from "redux"
import { State } from "./defines"
import rootReducer from "./rootReducer"
import { initialState } from "./defines"

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import {
    createStateSyncMiddleware,
} from "redux-state-sync";
import { PersistPartial } from "redux-persist/es/persistReducer"

export const makeDefaultState = (): State => {
    return initialState
}

let wasCalled = false
const configureStore = () => {
    if (wasCalled)
        throw new Error("this fn can be called only once");
    wasCalled = true

    const initialState = makeDefaultState()

    const reducer = persistReducer({
        key: "root",
        storage,
        blacklist: ["toasts"],
        throttle: 3000,
    }, rootReducer)

    const store = createStore(
        reducer,
        initialState as (State & PersistPartial),
        applyMiddleware(createStateSyncMiddleware({
            predicate: (action) => {
                if (/^persist\//i.test(action.type))
                    return false;

                if (/^TWSAPI\/toast/i.test(action.type))
                    return false;

                return true;
            }
        }))
    )

    const persistor = persistStore(store as any)

    return { persistor, store: store as any }
}

// TODO(teawithsand): make this typed
export const useStoreDispatch =
    () => useDispatch()

const res = configureStore()

export default () => res

const { store, persistor } = res
export { store, persistor } 