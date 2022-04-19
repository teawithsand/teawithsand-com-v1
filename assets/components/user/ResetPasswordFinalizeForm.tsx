import { resetPasswordFinalize } from "@app/domain/user/nativePassword"
import { ConstraintViolation, useErrorExplainer } from "@app/util/explainError"
import { ConstraintViolationBag, mergeBags } from "@app/util/formError"
import { useApiClient } from "@app/util/httpClient"
import { simpleSleep, sleep } from "@app/util/promise"
import { useLoadHelper } from "@app/util/react/formHelper"
import * as React from "react"
import { useCallback, useState } from "react"
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap"
import { FormattedMessage, useIntl } from "react-intl"
import AlertBar from "../helper/AlertBar"
import FieldFeedback from "../helper/FieldFeedback"
import NewErrorBar from "../helper/NewErrorBar"
import LoadingSpinner from "../LoadingSpinner"

const PASSWORD_PATH = "password"
const REPEAT_PASSWORD_PATH = "repeatPassword"

export default (
    props: {
        id: string,
        token: string,
        onSuccess?: () => Promise<void>,
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
    const [formData, setFormData] = useState({
        password: "",
        repeatPassword: "",
    })

    const client = useApiClient()

    const onSubmit = useCallback(async (e: any) => {
        e.preventDefault()

        const p = (async () => {
            await resetPasswordFinalize(
                client,
                {
                    id,
                    token,
                    password: formData.password,
                }
            )
        })()

        setPromise(p)
    }, [formData.password, token, id])

    if (state.type === "pending") {
        return <LoadingSpinner />
    }

    const localValidateForm = (): ConstraintViolationBag => {
        let violations: ConstraintViolation[] = []

        if (formData.password !== formData.repeatPassword) {
            violations.push({
                code: null,
                message: intl.formatMessage({ id: "component.user.reset_password_finalize_form.repeat_password.mismatch" }),
                propertyPath: REPEAT_PASSWORD_PATH,
            })
        }

        return new ConstraintViolationBag(violations)
    }

    let topBar = null
    if (state.error) {
        topBar = <NewErrorBar
            title={intl.formatMessage({ id: "component.register_form.error_bar.title" })}
            error={state.error} />
    }

    const explainedError = state.error ? explainer.explainError(state.error) : null
    const violations = mergeBags(
        new ConstraintViolationBag(explainedError?.constraintViolations ?? []),
        localValidateForm(),
    )

    return <Form onSubmit={onSubmit}>
        {topBar}

        <Form.Group className="mb-3">
            <Form.Label>
                <FormattedMessage id="component.reset_password_finalize_form.password.label" />
            </Form.Label>
            <InputGroup hasValidation>
                <Form.Control
                    required
                    onChange={(v) => setFormData({ ...formData, password: v.target.value })}
                    type="password"
                    isInvalid={violations.hasErrorForPath(PASSWORD_PATH)}
                    value={formData.password}
                />
                <FieldFeedback path={PASSWORD_PATH} violations={violations} />
            </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Label>
                <FormattedMessage id="component.reset_password_finalize_form.repeat_password.label" />
            </Form.Label>
            <InputGroup hasValidation>
                <Form.Control
                    required
                    onChange={(v) => setFormData({ ...formData, repeatPassword: v.target.value })}
                    type="password"
                    isInvalid={violations.hasErrorForPath(REPEAT_PASSWORD_PATH)}
                    value={formData.repeatPassword}
                />
                <FieldFeedback path={REPEAT_PASSWORD_PATH} violations={violations} />
            </InputGroup>
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
            <FormattedMessage id="component.reset_password_finalize_form.button.label" />
        </Button>
    </Form>
}