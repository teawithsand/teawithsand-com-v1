import { useSearchParams } from "react-router-dom"
import * as React from "react"
import { Col, Container, Row } from "react-bootstrap"
import AlertBar from "@app/components/helper/AlertBar"
import { FormattedMessage, useIntl } from "react-intl"
import ResetPasswordFinalizeForm from "@app/components/user/ResetPasswordFinalizeForm"
import { parseToken } from "@app/domain/user/tokenParse"
import { useNavigate } from "react-router"
import { loginPath } from "./urls"
import { useDispatch } from "react-redux"
import { resettedPasswordToast } from "@app/domain/toast/commonToast"

export default () => {
    const [searchParams, _] = useSearchParams()
    const intl = useIntl()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const token = searchParams.get("token")
    const id = searchParams.get("id")

    const parsedToken = token ? parseToken(token, "resetPassword") : null

    let errorBar = null
    if (!id || !token) {
        errorBar = <AlertBar
            variant="danger"
            message={
                intl.formatMessage({ id: "page.reset_password_finalize.invalid_parameters" })
            } />
    } else if (parsedToken.isExpiredAt()) {
        <AlertBar
            variant="danger"
            message={
                intl.formatMessage({ id: "page.reset_password_finalize.token_expired" })
            } />
    }

    const onSuccess = async () => {
        // TODO(teawithsand): here display toast + navigate
        navigate(loginPath());
        dispatch(resettedPasswordToast(intl).action)
    }

    return <Container>
        <Row className="mb-5">
            <Col className="text-center">
                <h1><FormattedMessage id="page.reset_password_finalize.title" /></h1>
            </Col>
        </Row>
        <Row>
            <Col className="ms-auto me-auto" xs={12} md={6}>
                {errorBar ? errorBar : <ResetPasswordFinalizeForm
                    onSuccess={onSuccess}
                    token={token}
                    id={id}
                />}
            </Col>
        </Row>
    </Container>

}