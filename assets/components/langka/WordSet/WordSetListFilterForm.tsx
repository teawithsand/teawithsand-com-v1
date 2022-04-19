import TopLevelFeedback from "@app/components/helper/TopLevelFeedback"
import { AbstractFormOptions } from "@app/util/formka/AbstractForm"
import { Button, Form, InputGroup } from "react-bootstrap"
import { FormattedMessage, IntlShape } from "react-intl"
import React from "react"
import FieldFeedback from "@app/components/helper/FieldFeedback"
import FormValidator from "@app/util/formka/FormValidator"
import { ConstraintViolationBag } from "@app/util/formError"
import { ConstraintViolation } from "@app/util/explainError"
import { FormRenderer } from "@app/util/formka/FormRenderer"

export interface WordSetListFilterFormRendererOptions extends AbstractFormOptions {
    intl: IntlShape
}

export const TITLE_PATH = "title"
export const ONWER_PATH = "owner"
export const SORT_PATH = "sort"

export type WordSetListFilterFormSortValue = "title_asc" | "title_desc" | "created_at_asc" | "created_at_desc"

export type WordSetListFilterFormData = {
    title: string,
    owner: string,
    sort: WordSetListFilterFormSortValue,
}

export const wordSetListFilterFormValidatorFactory = (options: {
    intl: IntlShape,
}): FormValidator<WordSetListFilterFormData> => ({
    validate: (data: WordSetListFilterFormData) => {
        const violations: ConstraintViolation[] = []

        return new ConstraintViolationBag(violations)
    }
})

export const wordSetListFilterFormRendererFactory = (
    options: WordSetListFilterFormRendererOptions
): FormRenderer<WordSetListFilterFormData> => (props) => {
    const { intl } = options
    return <Form onSubmit={props.handleSubmit}>
        <TopLevelFeedback title={options.topErrorTitle} violations={props.errorBag} />

        <Form.Group className="mb-3">
            <Form.Label>
                <FormattedMessage id="component.langka.word_set_list_filter_form.title.label" />
            </Form.Label>
            <InputGroup hasValidation>
                <Form.Control
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
                <FormattedMessage id="component.langka.word_set_list_filter_form.owner.label" />
            </Form.Label>
            <InputGroup hasValidation>
                <Form.Control
                    type="text"
                    isInvalid={props.errorBag.hasErrorForPath(ONWER_PATH)}
                    onChange={(v) => props.setFormData({ ...props.formData, owner: v.target.value })}
                    value={props.formData.owner}
                />
                <FieldFeedback path={ONWER_PATH} violations={props.errorBag} />
            </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Select
                value={props.formData.sort}
                onChange={(v) => props.setFormData({ ...props.formData, sort: v.target.value as WordSetListFilterFormSortValue })}
            >
                <option value="title_asc">
                    {intl.formatMessage({ id: "component.langka.word_set_tutle_list_filter_form.sort.title_asc" })}
                </option>
                <option value="title_desc">
                    {intl.formatMessage({ id: "component.langka.word_set_tutle_list_filter_form.sort.title_desc" })}
                </option>
                <option value="created_at_asc">
                    {intl.formatMessage({ id: "component.langka.word_set_tutle_list_filter_form.sort.created_at_asc" })}
                </option>
                <option value="created_at_desc">
                    {intl.formatMessage({ id: "component.langka.word_set_tutle_list_filter_form.sort.created_at_desc_desc" })}
                </option>
            </Form.Select>
        </Form.Group>

        <Button disabled={!props.localErrorBag.empty} variant="primary" type="submit" className="w-100">
            <FormattedMessage id="component.langka.word_set_list_filter_form.button.label" />
        </Button>
    </Form>
}   