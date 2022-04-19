import { useErrorExplainer } from "@app/util/explainError"
import * as React from "react"
import { Alert } from "react-bootstrap"

/**
 * @deprecated Use NewErrorBar instead
 */
export default (props: {
    error?: any,
    skipIfFalsy?: boolean,
}) => {
    const explainer = useErrorExplainer()

    const { error, skipIfFalsy } = props

    if (skipIfFalsy && !error) {
        return <></>
    } else {
        const explained = explainer.explainError(error)
        return <Alert variant="danger" >
            {explained.message}
        </Alert>
    }
} 