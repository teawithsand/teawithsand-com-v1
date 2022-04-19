import classnames from "@app/util/classnames"
import * as React from "react"
import { Col } from "react-bootstrap"

export type ResponsiveColumnContext = "container" | "modal"

export default (
    props: {
        children?: React.ReactNode,
        className?: string,
        context?: ResponsiveColumnContext,
    }
) => {
    if (props.context === "modal") {
        return <Col className={classnames(props.className, "ms-auto me-auto")}>
            {props.children}
        </Col>
    } else {
        return <Col className={classnames(props.className, "ms-auto me-auto")} xs={12} lg={6}>
            {props.children}
        </Col>
    }
}