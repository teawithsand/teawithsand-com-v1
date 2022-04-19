import { ConstraintViolationBag, PATH_TOP_ERROR } from "@app/util/formError"
import AlertBar from "./AlertBar"
import React from "react"

export default (
    props: {
        title?: string,
        path?: string,
        violations?: ConstraintViolationBag
    }
) => {
    let { violations, path } = props
    if (!violations)
        violations = new ConstraintViolationBag([])
    const messages = violations.messagesForPath(path)
    if (violations.hasErrorForPath(path ?? PATH_TOP_ERROR)) {
        return <AlertBar
            title={props.title ?? ""}
            message={violations.messagesForPath(PATH_TOP_ERROR).join("\n")}
            variant="danger"
        />
    } else {
        return <></>
    }
}