import { Toast, ToastContainer, } from "react-bootstrap"
import * as React from "react"
import { useDispatch, useSelector } from "react-redux"
import { FormattedMessage } from "react-intl"
import ToastData from "@app/domain/toast/toast"
import { RemoveAllToastsAction, RemoveToastAction, toastSelector } from "@app/actions/toastAction"
import DisplayedToast from "./DisplayedToast"
import useWindowDimensions from "@app/util/windowDimesionsHook"


const ToastDisplay = (
    props: {
        toasts: ToastData[],
    },
) => {
    // note: for now toasts are not redux managed
    // in fact they are simple post and forget messages
    // we can do it without redux

    // TODO(teawithsand): make this sort stable
    const initialToasts = [...props.toasts].sort((a, b) => a.orderCreatedAtMillis - b.orderCreatedAtMillis)
    const dispatch = useDispatch()

    const { height } = useWindowDimensions()


    const onClear = () => {
        const action: RemoveAllToastsAction = {
            type: "TWSAPI/toast/remove-all"
        }
        dispatch(action)
    }

    let operatedToasts
    let additionalInfo = null
    let moreMessages
    if (height > 1080 - 100) {
        moreMessages = 5
    } else {
        moreMessages = 1
    }
    if (initialToasts.length > moreMessages) {
        operatedToasts = initialToasts.slice(0, moreMessages)
        additionalInfo = <Toast key={"ai"} onClose={onClear}>
            <Toast.Header>
                <FormattedMessage id="app.toast.more_messages_clear_all" values={{
                    count: initialToasts.length - moreMessages,
                }} />
            </Toast.Header>
        </Toast>
    } else {
        operatedToasts = initialToasts
    }


    const onRemoved = (toast: ToastData) => {
        const action: RemoveToastAction = {
            type: "TWSAPI/toast/remove",
            toast,
        }
        dispatch(action)
    }

    const timeOutToast = operatedToasts.find((t) => t.hideAfterMillis !== undefined)

    /*
    if (isFinite(firstTimeOutIndex) && isFinite(firstHideAfterMillis)) {
        setTimeout(() => {
            onRemoved(firstTimeOutIndex)
        }, firstHideAfterMillis)
    } else {
        setTimeout(() => { }, 0) // noop here, nothing to remove
    }
    */

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            if (timeOutToast !== undefined) {
                onRemoved(timeOutToast)
            }
        }, timeOutToast?.hideAfterMillis ? timeOutToast.hideAfterMillis as number : 0)

        return () => clearTimeout(timeout)
    }, [timeOutToast])

    return <ToastContainer position="bottom-end" className="mb-2 me-2 ms-2 position-fixed">
        {additionalInfo}
        {operatedToasts.map((v, i) => <DisplayedToast
            toastData={v}
            key={i}
            progressDsappearAfterMillis={v === timeOutToast ? v.hideAfterMillis : undefined}
            onRemoved={() => onRemoved(v)} />)}
    </ToastContainer>
}

export const ReduxToastDisplay = () => {
    const toasts = useSelector(toastSelector)

    return <ToastDisplay toasts={toasts} />
}


export default ToastDisplay