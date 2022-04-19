import { LANGUAGES } from "@app/domain/langka/languages"
import * as React from "react"
import { Form } from "react-bootstrap"

export default (
    props: {
        size?: "lg" | "sm",
        onChange?: (twoLetterCode: string) => void,
        isValid?: boolean,
        isInvalid?: boolean,
        value?: string,
        filter?: (languages: typeof LANGUAGES) => typeof LANGUAGES,
    }
) => {
    return <Form.Select size={props.size} value={props.value} onChange={(e) => {
        if (props.onChange) {
            props.onChange(e.target.value)
        }
    }}
        isValid={props.isValid}
        isInvalid={props.isInvalid}
    >
        {(props.filter ? props.filter(LANGUAGES) : LANGUAGES).map(l => <option value={l.twoLetterCode} key={l.twoLetterCode}>
            {`${l.twoLetterCode} - ${l.englishName}`}
        </option>)}
    </Form.Select>
}