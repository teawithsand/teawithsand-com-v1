import * as React from "react"
import { Col, Row } from "react-bootstrap"
import { FormattedMessage } from "react-intl"

import loading from "../images/loading.svg"
import ImageUtil from "./util/ImageUtil"


export default () => {
    // const intl = useIntl()
    
    return <Row>
        <Col>
            {/*
            This causes
            alt={intl.formatMessage({
                id: "component.loading_spinner.loading_alt"
            })}
            */}
            <ImageUtil src={loading} className="spinner--infinite d-block ms-auto me-auto" />
            <div className="text-center">
                {<FormattedMessage
                    id="component.loading_spinner.loading"
                />}
            </div>
        </Col>
    </Row>
}