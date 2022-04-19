import { persistor } from "@app/actions/store"
import ResponsiveColumn from "@app/components/helper/ResponsiveColumn"
import RegistrationForm from "@app/components/user/RegistrationForm"
import * as React from "react"
import { Button, Col, Container, Row } from "react-bootstrap"
import { FormattedMessage } from "react-intl"
import { useNavigate } from "react-router"
import { afterRegisterPath, homePath } from "./urls"

export default () => {
    const navigate = useNavigate()

    return <Container>
        <Row className="mb-5">
            <Col className="text-center">
                <h1>
                    <FormattedMessage id="page.register.title" />
                </h1>
            </Col>
        </Row>
        {
            /*

            <Row>   
            <Col className="ms-auto me-auto" xs={12} md={6}>
                <RegistrationForm onSuccess={async () => {
                    await persistor.flush()
                    navigate(afterRegisterPath())
                }} />
            </Col>
        </Row>
            */
        }
           <ResponsiveColumn className="text-center">
                <h2>
                    <FormattedMessage id="page.register.disabled" />
                </h2>
                <p>
                    <FormattedMessage id="page.register.disabled.explanation" />
                </p>

                <Button onClick={() => navigate(homePath())} className="w-100">
                    <FormattedMessage id="page.register.disabled.go_home" />
                </Button>
            </ResponsiveColumn>
    </Container>
}