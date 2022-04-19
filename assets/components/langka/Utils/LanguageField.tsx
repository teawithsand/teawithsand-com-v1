import { LANGUAGES } from "@app/domain/langka/languages"
import * as React from "react"
import { Form, InputGroup } from "react-bootstrap"
import { FormattedMessage, useIntl } from "react-intl"

export const languageCodes = LANGUAGES.map(l => l.twoLetterCode)
export const isValidLanguageRegex = new RegExp(`^(${languageCodes.join("|")})$`)
export const isValidLanguagePattern =`^(${languageCodes.join("|")})$`
/**
 * @deprecated use manual input/select fields
 */
export default (
    props: {
        onChange?: (twoLetterCode: string) => void,
        isValid?: boolean,
        isInvalid?: boolean,
        value?: string,
        label?: string,
        filter?: (languages: typeof LANGUAGES) => typeof LANGUAGES,
    }
) => {
    const intl = useIntl()

    const [value, setValue] = React.useState(props.value ?? "")

    const isValid = (props.isValid ?? true) && isValidLanguageRegex.test(value)
    const isInvalid = (props.isInvalid ?? false) || !isValidLanguageRegex.test(value)
    const reallyIsInvalid = !isValid || isInvalid

    // TODO(teawithsand): add validation notice and stuff here
    return <Form.Group>
        <Form.Label>
            {props.label} {/* <FormattedMessage id="component.langka.language_field.label" /> */}
        </Form.Label>
        <InputGroup hasValidation>
            <Form.Control
                value={props.value}
                onChange={(e) => {
                    setValue(e.target.value)
                    if (props.onChange) {
                        props.onChange(e.target.value)
                    }
                }}
                pattern={isValidLanguagePattern}
                isInvalid={reallyIsInvalid}
                placeholder={intl.formatMessage({ id: "component.langka.language_field.placeholder" })}
            ></Form.Control>
            {reallyIsInvalid ? <Form.Control.Feedback type="invalid">
                <ul>
                    <FormattedMessage id="component.langka.language_field.invalid_message" />
                </ul>
            </Form.Control.Feedback> : null}
        </InputGroup>
    </Form.Group>
}