import React from "react"
import { userDataSelector } from "@app/actions/userAction"
import LoginRequiredBar from "@app/components/helper/LoginRequiredBar"
import { useSelector } from "react-redux"
import { Button, Col, Container, Row } from "react-bootstrap"
import ActionFormComponent from "@app/components/Formka/ActionFormComponent"
import { FormattedMessage, useIntl } from "react-intl"
import { wordSetFormRendererFactory, wordSetFormValidatorFactory } from "@app/components/langka/WordSet/WordSetForm"
import ResponsiveColumn, { ResponsiveColumnContext } from "@app/components/helper/ResponsiveColumn"
import { makeWordSetClient } from "@app/domain/langka/api/wordset"
import { useApiClient } from "@app/util/httpClient"
import { useNavigate } from "react-router"
import { useErrorExplainer } from "@app/util/explainError"
import { WordSetId, WordSetSecretDetails } from "@app/domain/langka/definitons"
import { useNewLoadHelper } from "@app/util/react/newLoadHelper"
import LoadingSpinner from "@app/components/LoadingSpinner"
import AlertBar from "@app/components/helper/AlertBar"
import { useLoadHelper } from "@app/util/react/formHelper"

export interface WordSetDeleteOperationCallbacks {
    onCancelClick?: () => void,
    onLoadingError?: (error: any) => void,
    onOperatingError?: (error: any) => void,
    onSuccess?: () => void,
}

export default (props: { id: WordSetId, callbacks: WordSetDeleteOperationCallbacks, context?: ResponsiveColumnContext}) => {
    const explainer = useErrorExplainer()
    const intl = useIntl()

    const client = useApiClient()
    const userData = useSelector(userDataSelector)
    const wordSetClient = makeWordSetClient(client)


    const { id, callbacks , context} = props

    const [wordSetLoader, _] = useNewLoadHelper({
        loader: async (id) => {
            try {
                return await wordSetClient.getWordSetSecretDetails(id)
            } catch (e) {
                if (callbacks.onLoadingError)
                    callbacks.onLoadingError(e)

                throw e
            }
        },
        parameterInitializer: () => id
    })
    const [deleteHelper, setPromise] = useLoadHelper({})

    if (!userData) {
        return <LoginRequiredBar />
    }

    if (wordSetLoader.type === "pending" || deleteHelper.type === "pending") {
        return <LoadingSpinner />
    } else if (wordSetLoader.type === "error" || deleteHelper.type === "error") {
        const explained = explainer.explainError(wordSetLoader.error ?? deleteHelper.error)
        return <AlertBar
            variant="danger"
            title={intl.formatMessage({ id: "component.langka.operation.word_set_delete.top_error" })}
            message={explained.message}
        />
    }


    const onDeleteClick = () => {
        setPromise((async () => {
            try {
                await wordSetClient.deleteWordSet(id)
                if (callbacks.onSuccess)
                    callbacks.onSuccess()
            } catch (e) {
                if (callbacks.onOperatingError)
                    callbacks.onOperatingError(e)
            }
        })())
    }

    return <>
        <Row className="mb-3">
            <ResponsiveColumn context={context}>
                <FormattedMessage id="component.langka.operation.word_set_delete.word_set_title.prefix" />
                {" "}
                <b>{wordSetLoader.value.title}</b>
            </ResponsiveColumn>
        </Row>
        <Row className="text-center mb-2">
            <ResponsiveColumn context={context}>
                <Button className="w-100" onClick={() => {
                    callbacks.onCancelClick()
                }}>
                    <FormattedMessage id="component.langka.operation.word_set_delete.cancel_button.label" />
                </Button>
            </ResponsiveColumn>
        </Row>
        <Row className="text-center mb-2">
            <ResponsiveColumn context={context}>
                <Button className="w-100" variant="danger" onClick={onDeleteClick}>
                    <FormattedMessage id="component.langka.operation.word_set_delete.confirm_button.label" />
                </Button>
            </ResponsiveColumn>
        </Row>
    </>
}   