import * as React from "react"
import { ConstraintViolationBag } from "@app/util/formError"
import { Form } from "react-bootstrap"

export default (
    props: {
        path: string,
        violations?: ConstraintViolationBag
    }
) => {
    let { violations, path } = props
    if (!violations)
        violations = new ConstraintViolationBag([])
    const messages = violations.messagesForPath(path)
    
    if (messages.length > 0) {
        return <Form.Control.Feedback type="invalid">
            <ul>
                {messages.map(
                    (message) => <li key={message}>
                        {message}
                    </li>
                )}
            </ul>
        </Form.Control.Feedback>
    } else {
        return <></>
    }
}