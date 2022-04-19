import { userDataSelector } from "@app/actions/userAction"
import { changePassword } from "@app/domain/user/nativePassword"
import { ConstraintViolation, useErrorExplainer } from "@app/util/explainError"
import { ConstraintViolationBag, mergeBags } from "@app/util/formError"
import { useApiClient } from "@app/util/httpClient"
import { useLoadHelper } from "@app/util/react/formHelper"
import * as React from "react"
import { useCallback, useState } from "react"
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap"
import { FormattedMessage, useIntl } from "react-intl"
import { useSelector } from "react-redux"
import FieldFeedback from "../helper/FieldFeedback"
import LoadingSpinner from "../LoadingSpinner"

const PASSWORD_PATH = "password"
const REPEAT_PASSWORD_PATH = "repeatPassword"

export default (
    props: {
        onSuccess?: () => Promise<void>,
    }
) => {
    const { onSuccess } = props
    
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
    const userData = useSelector(userDataSelector)

    const onSubmit = useCallback(async (e: any) => {
        e.preventDefault()

        const p = (async () => {
            await changePassword(
                client,
                userData.id,
                formData.password
            )
        })()

        setPromise(p)
    }, [formData.password, userData.id])

    if (!userData) {
        // TODO(teawithsand): error bar explaining that user must be logged in
        // return <NewErrorBar />
        return <></>
    }

    if (state.type === "pending") {
        return <LoadingSpinner />
    }

    const localValidateForm = (): ConstraintViolationBag => {
        let violations: ConstraintViolation[] = []

        if (formData.password !== formData.repeatPassword) {
            violations.push({
                code: null,
                message: intl.formatMessage({ id: "validator.user.password.mismatch_repeat" }),
                propertyPath: REPEAT_PASSWORD_PATH,
            })
        }

        return new ConstraintViolationBag(violations)
    }

    const explainedError = state.error ? explainer.explainError(state.error) : null
    const violations = mergeBags(
        new ConstraintViolationBag(explainedError?.constraintViolations ?? []),
        localValidateForm(),
    )

    return <>
        <Row>
            <Col>
                <Form onSubmit={onSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>
                            <FormattedMessage id="component.change_password_form.password.label" />
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
                            <FormattedMessage id="component.change_password_form.repeat_password.label" />
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
                        <FormattedMessage id="component.change_passsword_form.button.label" />
                    </Button>
                </Form>
            </Col>
        </Row>
    </>
}