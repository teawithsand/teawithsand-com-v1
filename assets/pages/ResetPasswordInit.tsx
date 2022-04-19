import ResetPasswordInitForm from "@app/components/user/ResetPasswordInitForm"
import * as React from "react"
import { Col, Container, Row } from "react-bootstrap"
import { FormattedMessage } from "react-intl"

export default () => {
    return <Container>
        <Row className="mb-5">
            <Col className="text-center">
                <h1><FormattedMessage id="page.reset_password_init.title" /></h1>
            </Col>
        </Row>
        <Row >
            <Col className="ms-auto me-auto" xs={12} md={6}>
                <ResetPasswordInitForm />
            </Col>
        </Row>
    </Container>
}