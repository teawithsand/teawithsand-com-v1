import TopLevelFeedback from "@app/components/helper/TopLevelFeedback"
import { AbstractFormOptions } from "@app/util/formka/AbstractForm"
import { Button, Form, InputGroup } from "react-bootstrap"
import { FormattedMessage, IntlShape } from "react-intl"
import React from "react"
import FieldFeedback from "@app/components/helper/FieldFeedback"
import { isValidLanguageRegex } from "../Utils/LanguageField"
import FormValidator from "@app/util/formka/FormValidator"
import { ConstraintViolationBag } from "@app/util/formError"
import { ConstraintViolation } from "@app/util/explainError"
import { FormRenderer } from "@app/util/formka/FormRenderer"
import { FormDescriptor } from "@app/util/formka/Descriptor"

export interface WordSetRendererOptions extends AbstractFormOptions {
}

export const TITLE_PATH = "title"
export const SOURCE_LANGUAGE_PATH = "sourceLanguage"
export const DESTINATION_LANGUAGE_PATH = "destinationLanguage"
export const DESCRIPTION_PATH = "description"

export const wordSetFormInitialDataFactory = (): WordSetFormData => ({
    description: "",
    title: `Word set #${Math.floor(Math.random() * 10000000)}`,
    destinationLanguage: "en",
    sourceLanguage: "fr",
})

export type WordSetFormData = {
    title: string,
    sourceLanguage: string,
    destinationLanguage: string,
    description: string,
}

export interface WordSetFormValidatorOptions {
    intl: IntlShape,
}

export const wordSetFormValidatorFactory = (options: WordSetFormValidatorOptions): FormValidator<WordSetFormData> => ({
    validate: (data: WordSetFormData) => {
        const violations: ConstraintViolation[] = []

        if (!isValidLanguageRegex.test(data.sourceLanguage)) {
            violations.push({
                message: options.intl.formatMessage({ id: "component.langka.word_set_form.source_language.invalid" }),
                propertyPath: SOURCE_LANGUAGE_PATH,
                code: null,
            })
        }

        if (!isValidLanguageRegex.test(data.destinationLanguage)) {
            violations.push({
                message: options.intl.formatMessage({ id: "component.langka.word_set_form.destination_language.invalid" }),
                propertyPath: DESTINATION_LANGUAGE_PATH,
                code: null,
            })
        }

        // TODO(teawithsand): more local validations here, prefferably export these from backend + use some codegen

        return new ConstraintViolationBag(violations)
    }
})

export const wordSetFormRendererFactory = (
    options: WordSetRendererOptions
): FormRenderer<WordSetFormData> => (props) => {
    return <Form onSubmit={props.handleSubmit}>
        <TopLevelFeedback title={options.topErrorTitle} violations={props.errorBag} />

        <Form.Group className="mb-3">
            <Form.Label>
                <FormattedMessage id="component.langka.word_set_form.title.label" />
            </Form.Label>
            <InputGroup hasValidation>
                <Form.Control
                    required
                    type="text"
                    isInvalid={props.errorBag.hasErrorForPath(TITLE_PATH)}
                    onChange={(v) => props.setFormData({ ...props.formData, title: v.target.value })}
                    value={props.formData.title}
                />
                <FieldFeedback path={TITLE_PATH} violations={props.errorBag} />
            </InputGroup>
        </Form.Group>


        <Form.Group className="mb-3">
            <Form.Label>
                <FormattedMessage id="component.langka.word_set_form.sourceLanguage.label" />
            </Form.Label>
            <InputGroup hasValidation>
                <Form.Control
                    required
                    type="text"
                    isInvalid={props.errorBag.hasErrorForPath(SOURCE_LANGUAGE_PATH)}
                    onChange={(v) => props.setFormData({ ...props.formData, sourceLanguage: v.target.value })}
                    value={props.formData.sourceLanguage}
                />
                <FieldFeedback path={SOURCE_LANGUAGE_PATH} violations={props.errorBag} />
            </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Label>
                <FormattedMessage id="component.langka.word_set_form.destinationLanguage.label" />
            </Form.Label>
            <InputGroup hasValidation>
                <Form.Control
                    required
                    type="text"
                    isInvalid={props.errorBag.hasErrorForPath(DESTINATION_LANGUAGE_PATH)}
                    onChange={(v) => props.setFormData({ ...props.formData, destinationLanguage: v.target.value })}
                    value={props.formData.destinationLanguage}
                />
                <FieldFeedback path={DESTINATION_LANGUAGE_PATH} violations={props.errorBag} />
            </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Label>
                <FormattedMessage id="component.langka.word_set_form.description.label" />
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


        <Button disabled={!props.localErrorBag.empty} variant="primary" type="submit" className="w-100">
            <FormattedMessage id="component.langka.word_set_form.button.label" />
        </Button>
    </Form>
}

export const WordSetFormDescriptorFactory = (options: WordSetRendererOptions & WordSetFormValidatorOptions): FormDescriptor<WordSetFormData> => ({
    render: wordSetFormRendererFactory(options),
    localValidator: wordSetFormValidatorFactory(options),
    initializeFormData: wordSetFormInitialDataFactory,
})