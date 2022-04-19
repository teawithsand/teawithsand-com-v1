import { persistor } from "@app/actions/store"
import LoginForm from "@app/components/user/LoginForm"
import * as React from "react"
import {  Col, Container, Row } from "react-bootstrap"
import { FormattedMessage } from "react-intl"
import { useNavigate } from "react-router-dom"
import { homePath } from "./urls"

export default () => {
    const navigate = useNavigate()

    return <Container>
        <Row className="mb-5">
            <Col className="text-center">
                <h1>
                    <FormattedMessage id="page.login.title" />
                </h1>
            </Col>
        </Row>
        <Row className="mb-2">
            <Col className="ms-auto me-auto" xs={12} md={6}>
                <LoginForm onSuccess={async () => {
                    await persistor.flush()
                    navigate(homePath())
                }} />
            </Col>
        </Row>
    </Container>
}