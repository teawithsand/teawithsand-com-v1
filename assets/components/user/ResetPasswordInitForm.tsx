import { resetPasswordInit } from "@app/domain/user/nativePassword"
import { useErrorExplainer } from "@app/util/explainError"
import { ConstraintViolationBag } from "@app/util/formError"
import { useApiClient } from "@app/util/httpClient"
import { useLoadHelper } from "@app/util/react/formHelper"
import * as React from "react"
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap"
import { FormattedMessage, useIntl } from "react-intl"
import AlertBar from "../helper/AlertBar"
import FieldFeedback from "../helper/FieldFeedback"
import NewErrorBar from "../helper/NewErrorBar"
import LoadingSpinner from "../LoadingSpinner"
import RecaptchaV2 from "../RecaptchaV2"

const EMAIL_PATH = "email"

export default (
    props: {
        onSuccess?: () => void,
    }
) => {
    const { onSuccess } = props

    const explainer = useErrorExplainer()
    const intl = useIntl()
    const client = useApiClient()

    const [formData, setFormData] = React.useState({
        captchaToken: "",
        email: "",
    })

    const onCaptchaChanged = (token: string) => {
        setFormData({ ...formData, captchaToken: token })
    }

    const [state, setPromise] = useLoadHelper({
        callbacks: {
            onSuccess: onSuccess ? () => onSuccess() : undefined,
        }
    })


    const onSubmit = React.useCallback((e: any) => {
        e.preventDefault()

        const p = (async () => {
            await resetPasswordInit(client, {
                email: formData.email,
                captchaResponse: formData.captchaToken,
            })
        })()

        setPromise(p)
    }, [formData.email, formData.captchaToken])

    if (state.type === "pending") {
        return <LoadingSpinner />
    }

    const explainedError = state.error ? explainer.explainError(state.error) : null
    const violations = new ConstraintViolationBag(explainedError?.constraintViolations ?? [])

    let topBar = null
    if (state.type === "loaded") {
        topBar = <>
            <Row className="mb-3">
                <Col>
                    <AlertBar variant="success"
                        title={intl.formatMessage({
                            id: "component.forgotten_password_form.success_info.title",
                        })}

                        message={intl.formatMessage({
                            id: "component.forgotten_password_form.success_info.text",
                        }, {
                            "email": formData.email,
                        })} />
                </Col>
            </Row>
        </>
    }

    if (state.error) {
        topBar = <NewErrorBar
            title={intl.formatMessage({ id: "component.forgotten_password_form.error_bar.title" })}
            error={state.error} />
    }



    return <Form onSubmit={onSubmit}>
        {topBar}

        <Row>
            <Col>
                <Form.Group className="mb-3">
                    <Form.Label>
                        <FormattedMessage id="component.forgotten_password_form.email.label" />
                    </Form.Label>
                    <InputGroup hasValidation>
                        <Form.Control
                            required
                            type="email"
                            isInvalid={violations.hasErrorForPath(EMAIL_PATH)}
                            onChange={(v) => setFormData({ ...formData, email: v.target.value })}
                            value={formData.email}
                        />
                        <FieldFeedback path={EMAIL_PATH} violations={violations} />
                    </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>
                        <FormattedMessage id="component.forgotten_password_form.captcha.label" />
                    </Form.Label>
                    <RecaptchaV2 onToken={onCaptchaChanged} />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                    <FormattedMessage id="component.forgotten_password_form.button.label" />
                </Button>
            </Col>
        </Row>
    </Form>
}