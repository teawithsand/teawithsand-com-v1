import { SetUserDataAction } from "@app/actions/userAction"
import ChangePasswordForm from "@app/components/user/ChangePasswordForm"
import { changedPasswordToast } from "@app/domain/toast/commonToast"
import * as React from "react"
import { Col, Container, Row } from "react-bootstrap"
import { FormattedMessage, useIntl } from "react-intl"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router"
import { loginPath } from "./urls"

export default () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const intl = useIntl()

    return <Container>
        <Row className="mb-5">
            <Col className="text-center">
                <h1>
                    <FormattedMessage id="page.change_password.title" />
                </h1>
            </Col>
        </Row>
        <Row>
            <Col className="ms-auto me-auto" xs={12} md={6}>
                <ChangePasswordForm onSuccess={async () => {
                    navigate(loginPath())
                    const action: SetUserDataAction = {
                        type: "TWSAPI/user/set-user-data",
                        userData: {
                            type: "not-logged-in",
                        }
                    }

                    dispatch(action)
                    dispatch(changedPasswordToast(intl).action)
                }} />
            </Col>
        </Row>
    </Container>
}