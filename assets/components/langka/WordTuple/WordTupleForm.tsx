import FieldFeedback from "@app/components/helper/FieldFeedback"
import TopLevelFeedback from "@app/components/helper/TopLevelFeedback"
import { ConstraintViolation } from "@app/util/explainError"
import { ConstraintViolationBag, PATH_TOP_ERROR } from "@app/util/formError"
import { AbstractFormOptions } from "@app/util/formka/AbstractForm"
import { FormDescriptor } from "@app/util/formka/Descriptor"
import { FormRenderer } from "@app/util/formka/FormRenderer"
import FormValidator from "@app/util/formka/FormValidator"
import React from "react"
import { Button, Form, InputGroup } from "react-bootstrap"
import { FormattedMessage, IntlShape } from "react-intl"

export type WordTupleFormData = {
    sourceWord: string,
    destinationWords: string[],
    description: string,
}


const DestinationWordsField = (
    props: {
        violations?: ConstraintViolationBag,
        constraintViolationPath?: string,

        onChanged?: (words: string[]) => void,

        value?: string[],

        pattern?: string,
        isValid?: (word: string) => boolean,
    }
) => {
    const [isSorted, setIsSorted] = React.useState(false)

    let words = [...(props.value ?? [])]
    if (words.length === 0 || words.length > 0 && words[words.length - 1] !== "") {
        words.push("")
    }

    const onChanged = props.onChanged ?? ((w) => { })

    const onWordChanged = (newValue: string, index: number) => {
        setIsSorted(false)

        let newWords = [...words]
        newWords[index] = newValue

        // newWords = newWords.filter(s => s.length > 0)
        if (newWords.length > 0 && newWords[newWords.length - 1] === "")
            newWords.pop()

        onChanged(newWords)
    }


    return <Form.Group className="mb-3">
        <Form.Label>
            <FormattedMessage id="component.langka.destination_words_field.label" />
        </Form.Label>
        <InputGroup className="mb-1">
            <Button className="w-100" variant="outline-secondary" onClick={(e) => {
                e.preventDefault()

                const newWords = [...words]
                if (newWords.length > 0 && newWords[newWords.length - 1] === "")
                    newWords.pop()

                // JS sort with capital letters is not sane, but logical
                if (isSorted) {
                    newWords.sort((b, a) => a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase()))
                    setIsSorted(false)
                } else {
                    newWords.sort((a, b) => a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase()))
                    setIsSorted(true)
                }

                onChanged(newWords)
            }}>
                {isSorted ? <FormattedMessage id="component.langka.destination_words_field.sort_desc" /> : <FormattedMessage id="component.langka.destination_words_field.sort_asc" />}
            </Button>
        </InputGroup>
        {words.map((word, index) => <InputGroup hasValidation key={`${index}`}>
            <InputGroup.Text>{`#${index + 1}`}</InputGroup.Text>
            <Form.Control
                type="text"
                isInvalid={props.isValid ? !props.isValid(word) : false}
                onChange={(e) => {
                    onWordChanged(e.target.value, index)
                }}
                pattern={props.pattern}
                value={word}
                onBlur={() => {
                    if (words[index] === "") {
                        const newWords = [...words]
                        newWords.splice(index, 1)
                        onChanged(newWords)
                    }
                }}
            />
            {/* TODO(teawithsand): make this button delete icon 
            <Button variant="danger">
                <FormattedMessage id="component.langka.destination_words_field.delete_word" />
            </Button>
            */}
        </InputGroup>)}


        {/* 
            TODO(teawithsnad): figure out how to do validation
            <FieldFeedback path={props.constraintViolationPath ?? ""} violations={props.violations ?? new ConstraintViolationBag([])} />
        */}
    </Form.Group>
}

export const SOURCE_WORD_PATH = "sourceWord"
export const DESTINATION_WORDS_PATH = "destinationWords"
export const DESCRIPTION_PATH = "description"

export interface WordTupleFormValidatorOptions {
    intl: IntlShape,
}

export const wordTupleFormValidatorFactory = (options: WordTupleFormValidatorOptions): FormValidator<WordTupleFormData> => ({
    validate: (data: WordTupleFormData) => {
        const violations: ConstraintViolation[] = []

        if (data.destinationWords.some(w => w.includes("|"))) {
            violations.push({
                propertyPath: DESTINATION_WORDS_PATH,
                message: options.intl.formatMessage({ id: "component.langka.word_tuple_form.destination_words.contains_separator_char" }),
                code: null,
            })
        }

        // TODO(teawithsand): perform local validations here
        return new ConstraintViolationBag(violations)
    }
})

export interface WordTupleRendererOptions extends AbstractFormOptions {

}

export const wordTupleFormInitialDataFactory = (): WordTupleFormData => ({
    description: "",
    destinationWords: [],
    sourceWord: "",
})


export const wordTupleFormRendererFactory = (
    options: WordTupleRendererOptions
): FormRenderer<WordTupleFormData> => (props) => {
    return <Form onSubmit={props.handleSubmit}>
        <TopLevelFeedback title={options.topErrorTitle} violations={props.errorBag} />

        <Form.Group className="mb-3">
            <Form.Label>
                <FormattedMessage id="component.langka.word_tuple_form.source_word.label" />
            </Form.Label>
            <InputGroup hasValidation>
                <Form.Control
                    required
                    type="text"
                    isInvalid={props.errorBag.hasErrorForPath(SOURCE_WORD_PATH)}
                    onChange={(v) => props.setFormData({ ...props.formData, sourceWord: v.target.value })}
                    value={props.formData.sourceWord}
                />
                <FieldFeedback path={SOURCE_WORD_PATH} violations={props.errorBag} />
            </InputGroup>
        </Form.Group>

        <DestinationWordsField
            violations={props.errorBag}
            constraintViolationPath={DESTINATION_WORDS_PATH}
            onChanged={(words) => props.setFormData({ ...props.formData, destinationWords: words })}
            value={props.formData.destinationWords}
        />

        <Form.Group className="mb-3">
            <Form.Label>
                <FormattedMessage id="component.langka.word_tuple_form.description.label" />
            </Form.Label>
            <InputGroup hasValidation>
                <Form.Control
                    as="textarea"
                    isInvalid={props.errorBag.hasErrorForPath(DESCRIPTION_PATH)}
                    onChange={(v) => props.setFormData({ ...props.formData, description: v.target.value })}
                    value={props.formData.description}
                />
                <FieldFeedback path={DESCRIPTION_PATH} violations={props.errorBag} />
            </InputGroup>
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
            <FormattedMessage id="component.langka.word_tuple_form.button.label" />
        </Button>
    </Form>
}

export const wordTupleFormDescriptorFactroy = (options: WordTupleFormValidatorOptions & WordTupleRendererOptions): FormDescriptor<WordTupleFormData> => ({
    initializeFormData: wordTupleFormInitialDataFactory,
    render: wordTupleFormRendererFactory(options),
    localValidator: wordTupleFormValidatorFactory(options),
})