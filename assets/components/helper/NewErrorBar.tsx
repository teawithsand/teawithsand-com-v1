import { useErrorExplainer } from "@app/util/explainError"
import * as React from "react"
import AlertBar from "./AlertBar"


export default (props: {
    error?: any,
    skipIfFalsy?: boolean,

    title?: string,

    dismissible: boolean,
    onClose: () => void,
} | {
    error?: any,
    skipIfFalsy?: boolean,

    title?: string,

    dismissible?: boolean,
    onClose?: undefined,
}) => {
    const { error, title, skipIfFalsy, dismissible, onClose } = props
    const explainer = useErrorExplainer()
    // const intl = useIntl()
    // intl.formatMessage({ id: "component.new_error_bar.title" })

    if (skipIfFalsy && !error) {
        return <></>
    } else {
        const explained = explainer.explainError(error)
        return <AlertBar
            title={title ?? ""}
            message={explained.message}
            variant="danger"
            onClose={onClose}
            dismissible={dismissible}
        />
    }
} 