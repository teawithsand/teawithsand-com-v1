import { confirmRegistration } from "@app/domain/user/nativeRegistration"
import { useErrorExplainer } from "@app/util/explainError"
import { ConstraintViolationBag } from "@app/util/formError"
import { useApiClient } from "@app/util/httpClient"
import { useLoadHelper } from "@app/util/react/formHelper"
import * as React from "react"
import { useCallback } from "react"
import { Button, Form } from "react-bootstrap"
import { FormattedMessage, useIntl } from "react-intl"
import NewErrorBar from "../helper/NewErrorBar"
import LoadingSpinner from "../LoadingSpinner"

export default (
    props: {
        id: string,
        token: string,
        onSuccess?: () => void,
    }
) => {
    const { onSuccess, token, id } = props

    const intl = useIntl()
    const [state, setPromise] = useLoadHelper({
        callbacks: {
            onSuccess: onSuccess ? () => onSuccess() : undefined,
        }
    })
    const explainer = useErrorExplainer()
    const client = useApiClient()

    const onSubmit = useCallback(async (e: any) => {
        e.preventDefault()

        const p = (async () => {
            await confirmRegistration(client, {
                token,
                id,
            })
        })()

        setPromise(p)
    }, [token, id])

    if (state.type === "pending") {
        return <LoadingSpinner />
    }

    let topBar = null
    if (state.error) {
        topBar = <NewErrorBar
            title={intl.formatMessage({ id: "component.confirm_registration_form.error_bar.title" })}
            error={state.error} />
    }

    const explainedError = state.error ? explainer.explainError(state.error) : null
    // const violations = new ConstraintViolationBag(explainedError?.constraintViolations ?? [])

    return <Form onSubmit={onSubmit}>
        {topBar}
        <Button variant="primary" type="submit" className="w-100">
            <FormattedMessage id="component.confirm_registration_form.button.label" />
        </Button>
    </Form>
}