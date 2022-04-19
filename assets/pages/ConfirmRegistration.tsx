import { useSearchParams } from "react-router-dom"
import * as React from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router"
import { Col, Container, Row } from "react-bootstrap"
import ConfirmRegistrationForm from "@app/components/user/ConfirmRegistrationForm"
import { loginPath } from "./urls"
import { confirmedRegistrationToast } from "@app/domain/toast/commonToast"

export default () => {
    const [searchParams, _] = useSearchParams()
    const intl = useIntl()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const token = searchParams.get("token")
    const id = searchParams.get("id")

    return <Container>
        <Row className="mb-5">
            <Col className="text-center">
                <h1><FormattedMessage id="page.confirm_registration.title" /></h1>
            </Col>
        </Row>
        <Row >
            <Col className="ms-auto me-auto" xs={12} md={6}>
                <ConfirmRegistrationForm
                    token={token}
                    id={id}
                    onSuccess={() => {
                        dispatch(confirmedRegistrationToast(intl).action)
                        navigate(loginPath())
                    }} />
            </Col>
        </Row>
    </Container>
}