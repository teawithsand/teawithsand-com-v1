import { useErrorExplainer } from "@app/util/explainError"
import * as React from "react"
import { Alert } from "react-bootstrap"

export type AlertVariant = 'primary' |
    'secondary' |
    'success' |
    'danger' |
    'warning' |
    'info' |
    'light' |
    'dark'

const renderMessage = (msg: string | string[]) => {
    if (typeof msg === "string")
        return msg
    if (msg instanceof Array && msg.length === 1)
        return msg[0]
    return <ul>
        {msg.map((v, i) => <li key={v}>{v}</li>)}
    </ul>
}

export default (props: {
    variant: AlertVariant,

    message?: string | string[],
    title?: string,

    dismissible: boolean,
    onClose: () => void,
} | {
    variant: AlertVariant,

    message?: string | string[],
    title?: string,

    dismissible?: boolean,
    onClose?: undefined,
}) => {
    const { message, variant, dismissible, onClose } = props
    let { title } = props

    if (dismissible) {
        return <Alert variant={variant} onClose={onClose} dismissible className="text-wrap">
            {title ? <Alert.Heading className="text-wrap">{title}</Alert.Heading> : null}
            <span className="text-wrap">
                {renderMessage(message)}
            </span>
        </Alert>
    } else {
        return <Alert variant={variant} className="text-wrap">
            {title ? <Alert.Heading className="text-wrap">{title}</Alert.Heading> : null}
            <span className="text-wrap">
                {renderMessage(message)}
            </span>
        </Alert>
    }
} 