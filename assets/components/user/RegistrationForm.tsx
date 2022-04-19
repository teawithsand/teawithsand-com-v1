import { useIsMounted } from "@app/util/mountedHook"
import * as React from "react"
import { useState, useCallback } from "react"
import { Button, Form, InputGroup, } from "react-bootstrap"
import { FormattedMessage, useIntl } from "react-intl"

import { useLoadHelper } from "@app/util/react/formHelper"
import LoadingSpinner from "../LoadingSpinner"
import { ConstraintViolation, useErrorExplainer } from "@app/util/explainError"
import { ConstraintViolationBag, mergeBags } from "@app/util/formError"
import FieldFeedback from "../helper/FieldFeedback"
import RecaptchaV2 from "../RecaptchaV2"
import NewErrorBar from "../helper/NewErrorBar"
import { registerNativeUser } from "@app/domain/user/nativeRegistration"
import { useApiClient } from "@app/util/httpClient"

const PASSWORD_PATH = "password"
const LOGIN_PATH = "login"
const EMAIL_PATH = "email"
const REPEAT_PASSWORD_PATH = "repeat_password"

// TODO(teawithsand): test it
export default (props: {
    onSuccess?: () => void,
}) => {
    const { onSuccess } = props
    const [formData, setFormData] = useState({
        login: "",
        password: "",
        repeatPassword: "",
        email: "",
        captchaToken: "",
        isAgreedRules: false,
    })
    const intl = useIntl()
    const isMounted = useIsMounted()
    const explainer = useErrorExplainer()
    const [state, setPromise] = useLoadHelper({
        callbacks: {
            onSuccess: onSuccess ? () => onSuccess() : undefined,
        }
    })

    const client = useApiClient()

    const onSubmit = useCallback((e: any) => {
        e.preventDefault()
        if (!isMounted.current)
            return;

        // refuse submit with no captcha
        if (!formData.captchaToken)
            return;

        const p = (async () => {
            await registerNativeUser(client, {
                login: formData.login,
                password: formData.password,
                captchaResponse: formData.captchaToken,
                email: formData.email,
            })
        })()

        setPromise(p)
    }, [formData])

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

    let renderedError = null
    if (state.error) {
        renderedError = <NewErrorBar
            title={intl.formatMessage({ id: "component.register_form.error_bar.title" })}
            error={state.error} />
    }

    const onCaptchaChanged = (token: string) => {
        setFormData({ ...formData, captchaToken: token })
    }

    //setVersion(version + 1)

    return <Form onSubmit={onSubmit}>
        {renderedError}
        <Form.Group className="mb-3">
            <Form.Label>
                <FormattedMessage id="component.register_form.login.label" />
            </Form.Label>
            <InputGroup hasValidation>
                <Form.Control
                    required
                    type="text"
                    isInvalid={violations.hasErrorForPath(LOGIN_PATH)}
                    onChange={(v) => setFormData({ ...formData, login: v.target.value })}
                    value={formData.login}
                />
                <FieldFeedback path={LOGIN_PATH} violations={violations} />
            </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Label>
                <FormattedMessage id="component.register_form.email.label" />
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
                <FormattedMessage id="component.register_form.password.label" />
            </Form.Label>
            <InputGroup hasValidation>
                <Form.Control
                    required
                    onChange={(v) => setFormData({ ...formData, password: v.target.value })}
                    isInvalid={violations.hasErrorForPath(PASSWORD_PATH)}
                    type="password"
                    value={formData.password}
                />
                <FieldFeedback path={PASSWORD_PATH} violations={violations} />
            </InputGroup>
        </Form.Group>


        <Form.Group className="mb-3">
            <Form.Label>
                <FormattedMessage id="component.register_form.password_repeat.label" />
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

        <Form.Group className="mb-3">
            <Form.Label>
                <FormattedMessage id="component.register_form.captcha.label" />
            </Form.Label>
            <RecaptchaV2 onToken={onCaptchaChanged} />
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Check
                required
                onChange={(v) => setFormData({ ...formData, isAgreedRules: v.target.checked })}
                label={intl.formatMessage({ id: "component.register_form.agree_rules.label" })}
                type="checkbox"
                checked={formData.isAgreedRules}
            />
        </Form.Group>


        <Button variant="primary" type="submit" className="w-100">
            <FormattedMessage id="component.register_form.button.label" />
        </Button>
    </Form>
}