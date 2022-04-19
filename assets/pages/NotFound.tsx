import * as React from "react"
import { Button, Col, Container, Row } from "react-bootstrap"
import { FormattedMessage } from "react-intl"
import { useNavigate } from "react-router"
import { homePath } from "./urls"

export default () => {
    const navigate = useNavigate()

    return <Container>
        <Row className="text-center mb-3">
            <Col>
                <h1><FormattedMessage id="page.not_found.title" /></h1>
            </Col>
        </Row>
        <Row className="text-center">
            <Col>
                <Button onClick={() => navigate(homePath())}>
                    <FormattedMessage id="page.not_found.go_home" />
                </Button>
            </Col>
        </Row>
    </Container>
}