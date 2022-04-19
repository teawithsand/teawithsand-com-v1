import { loginPath } from "@app/pages/urls"
import React from "react"
import { Button, Col, Row } from "react-bootstrap"
import { FormattedMessage } from "react-intl"
import { useNavigate } from "react-router"

export default () => {
    const navigate = useNavigate()

    return <>
        <Row className="text-center mb-3">
            <Col>
                <h1><FormattedMessage id="component.helper.login_required.title" /></h1>
            </Col>
        </Row>
        <Row>
            <Col className="text-center">
                <Button onClick={() => { navigate(loginPath()) }}>
                    <FormattedMessage id="component.helper.login_required.go_to_login_button_text" />
                </Button>
            </Col>
        </Row>
    </>
}