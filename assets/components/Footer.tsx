import { Container, } from "react-bootstrap"
import * as React from "react"
import { useSelector } from "react-redux"
import { themeSelector } from "@app/actions/themeAction"
import { FormattedMessage } from "react-intl"

export default () => {
    const theme = useSelector(themeSelector);

    return <footer className="mt-auto mb-5">
        <Container className="text-end text-muted">
            <hr></hr>
            <FormattedMessage id="common.footer" />
        </Container>
    </footer>
}