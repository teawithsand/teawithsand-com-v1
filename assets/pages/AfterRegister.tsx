import * as React from "react"
import { Button, Col, Container, Row } from "react-bootstrap"
import { FormattedMessage } from "react-intl"
import { useNavigate } from "react-router"
import { loginPath } from "./urls"

export default () => {
    const navigate = useNavigate()

    // TODO(teawithsand): display here resend email button or sth like that
    //  resending registration email requires captcha + email + login, so require user to retype these in such case

    return <Container>
        <Row className="mb-5">
            <Col className="text-center">
                <h1><FormattedMessage id="page.after_register.title" /></h1>
                <p><FormattedMessage id="page.after_register.text" /></p>
            </Col>
        </Row>
        <Row>
            <Col className="ms-auto me-auto" xs={12} md={6}>
                <Button className="w-100" onClick={() => navigate(loginPath())}>
                    <FormattedMessage id="page.after_register.to_login" />
                </Button>
            </Col>
        </Row>
    </Container>
}