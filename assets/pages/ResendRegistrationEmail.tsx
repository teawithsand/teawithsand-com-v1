import { Col, Container, Row } from "react-bootstrap"
import * as React from "react"
import ResendRegisterEmailForm from "@app/components/user/ResendRegisterEmailForm"
import { FormattedMessage } from "react-intl"
import { useNavigate } from "react-router"

export default () => {
    const navigate = useNavigate()

    return <Container>
        <Row className="mb-5">
            <Col className="text-center">
                <h1>
                    <FormattedMessage id="page.resend_register_email.title" />
                </h1>
            </Col>
        </Row>
        <Row>
            <Col className="ms-auto me-auto" xs={12} md={6}>
                <ResendRegisterEmailForm onSuccess={() => {
                    
                }} />
            </Col>
        </Row>
    </Container>
}