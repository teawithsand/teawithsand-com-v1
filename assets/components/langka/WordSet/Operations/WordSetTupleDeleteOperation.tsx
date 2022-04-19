

import React from "react"
import { userDataSelector } from "@app/actions/userAction"
import LoginRequiredBar from "@app/components/helper/LoginRequiredBar"
import { useSelector } from "react-redux"
import { Button, Row } from "react-bootstrap"
import { FormattedMessage, useIntl } from "react-intl"
import ResponsiveColumn, { ResponsiveColumnContext } from "@app/components/helper/ResponsiveColumn"
import { makeWordSetClient } from "@app/domain/langka/api/wordset"
import { useApiClient } from "@app/util/httpClient"
import { ExplainedError, useErrorExplainer } from "@app/util/explainError"
import { WordSetId, WordTupleId } from "@app/domain/langka/definitons"
import { useNewLoadHelper } from "@app/util/react/newLoadHelper"
import LoadingSpinner from "@app/components/LoadingSpinner"
import AlertBar from "@app/components/helper/AlertBar"
import { useLoadHelper } from "@app/util/react/formHelper"
import { parseWordTupleDestinationWords } from "@app/domain/langka/wordtuple"

export interface WordSetTupleDeleteOperationCallbacks {
    onCancelClick?: () => void,
    onLoadingError?: (error: any) => void,
    onOperatingError?: (error: any) => void,
    onSuccess?: () => void,
}

export default (props: {
    wordSetId: WordSetId,
    wordTupleId: WordTupleId,
    callbacks: WordSetTupleDeleteOperationCallbacks,
    context?: ResponsiveColumnContext
}) => {
    const explainer = useErrorExplainer()
    const intl = useIntl()

    const client = useApiClient()
    const userData = useSelector(userDataSelector)
    const wordSetClient = makeWordSetClient(client)


    const { wordSetId, wordTupleId, callbacks, context } = props

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
        parameterInitializer: () => wordSetId
    })
    const [deleteHelper, setPromise] = useLoadHelper({})

    if (!userData) {
        return <LoginRequiredBar />
    }

    let wordTuple = null
    let wordTupleError: ExplainedError | null = null
    if (wordSetLoader.type === "loaded") {
        wordTuple = wordSetLoader.value.wordTuples.find((tuple) => tuple.id === wordTupleId)
        if (!wordTuple) {
            wordTupleError = {
                message: intl.formatMessage({ id: "component.langka.operation.operation.word_set_tuple_delete.no_tuple_error" })
            }
        }
    }

    if (wordSetLoader.type === "pending" || deleteHelper.type === "pending") {
        return <LoadingSpinner />
    } else if (wordSetLoader.type === "error" || deleteHelper.type === "error" || wordTupleError) {
        const explained = wordTupleError ?? explainer.explainError(wordSetLoader.error ?? deleteHelper.error)
        return <AlertBar
            variant="danger"
            title={intl.formatMessage({ id: "component.langka.operation.operation.word_set_tuple_delete.top_error" })}
            message={explained.message}
        />
    }

    const onDeleteClick = () => {
        setPromise((async () => {
            try {
                await wordSetClient.deleteWordTuple(wordTupleId)
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
                <FormattedMessage id="component.langka.operation.word_set_tuple_delete.word_tuple.prefix" />
                <br />
                <b>{wordTuple.sourceWord}</b>
                <br />
                <b>{parseWordTupleDestinationWords(wordTuple.destinationWords).join(" ")}</b>
            </ResponsiveColumn>
        </Row>
        <Row className="text-center mb-2">
            <ResponsiveColumn context={context}>
                <Button className="w-100" onClick={() => {
                    if (callbacks.onCancelClick)
                        callbacks.onCancelClick()
                }}>
                    <FormattedMessage id="component.langka.operation.word_set_tuple_delete.cancel_button.label" />
                </Button>
            </ResponsiveColumn>
        </Row>
        <Row className="text-center mb-2">
            <ResponsiveColumn context={context}>
                <Button className="w-100" variant="danger" onClick={onDeleteClick}>
                    <FormattedMessage id="component.langka.operation.word_set_tuple_delete.confirm_button.label" />
                </Button>
            </ResponsiveColumn>
        </Row>
    </>
}   