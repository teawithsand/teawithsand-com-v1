import { useStoreDispatch } from "@app/actions/store"
import { loginNativeUser } from "@app/domain/user/login"
import userOperationQueue from "@app/domain/user/queue"
import { initForgottenPasswordPath, registerPath } from "@app/pages/urls"
import { useIsMounted } from "@app/util/mountedHook"
import * as React from "react"
import { useState, useCallback } from "react"
import { Button, Col, Form, Row, } from "react-bootstrap"
import { FormattedMessage, useIntl } from "react-intl"
import { useNavigate } from "react-router"
import NewErrorBar from "../helper/NewErrorBar"
import LoadingSpinner from "../LoadingSpinner"


export default (props: {
    onSuccess?: () => Promise<void>,
}) => {
    const navigate = useNavigate()
    const { onSuccess } = props
    const [formData, setFormData] = useState({
        login: "",
        password: "",
    })
    const [isPending, setIsPending] = useState(false)
    const [errorData, setErrorData] = useState(null)
    const dispatch = useStoreDispatch()
    const intl = useIntl()

    const {
        login,
        password
    } = formData

    const isMounted = useIsMounted()

    const onSubmit = useCallback(async (e: any) => {
        e.preventDefault()

        if (isMounted.current) {
            setIsPending(true)

            userOperationQueue.enqueueOperation(async () => {
                if (isMounted.current)
                    setIsPending(true)

                try {
                    const result = await loginNativeUser({
                        login,
                        password,
                    })

                    if (isMounted.current) {
                        dispatch(result.action)

                        if (onSuccess)
                            await onSuccess()
                    }
                } catch (e) {
                    // TODO(teawithsand logging here)
                    if (isMounted.current)
                        setErrorData(e)
                } finally {
                    if (isMounted.current)
                        setIsPending(false)
                }
            })
        }
    }, [login, password, isMounted])

    const onClickResetPassword = React.useCallback(() => {
        navigate(initForgottenPasswordPath())
    }, [])

    const onClickRegister = useCallback(() => {
        navigate(registerPath())
    }, [])

    if (isPending) {
        return <LoadingSpinner />
    }

    let renderedError = null
    if (errorData) {
        renderedError = <NewErrorBar
            title={intl.formatMessage({ id: "component.login_form.error_bar.title" })}
            error={errorData} />
    }

    return <>
        <Row className="mb-2">
            <Col>
                <Form onSubmit={onSubmit}>
                    {renderedError}
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>
                            <FormattedMessage id="component.login_form.login.label" />
                        </Form.Label>
                        <Form.Control
                            type="text"
                            placeholder={intl.formatMessage({ id: "component.login_form.login.placeholder" })}
                            value={login}
                            onChange={(e) => setFormData({
                                ...formData,
                                login: e.target.value,
                            })}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>
                            <FormattedMessage id="component.login_form.password.label" />
                        </Form.Label>
                        <Form.Control
                            type="password"
                            placeholder={intl.formatMessage({ id: "component.login_form.password.placeholder" })}
                            value={password}
                            onChange={(e) => setFormData({
                                ...formData,
                                password: e.target.value,
                            })}
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100">
                        <FormattedMessage id="component.login_form.button.label" />
                    </Button>
                </Form>
            </Col>
        </Row>
        
        <Row className="mb-3">
            <Col>
                <Button variant="secondary" className="d-block w-100" onClick={onClickResetPassword}>
                    <FormattedMessage id="page.login.reset_password" />
                </Button>
            </Col>
        </Row>
        <Row>
            <Col>
                <Button variant="secondary" className="d-block w-100" onClick={onClickRegister}>
                    <FormattedMessage id="page.login.register" />
                </Button>
            </Col>
        </Row>
    </>
}