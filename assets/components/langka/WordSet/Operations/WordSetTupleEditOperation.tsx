import React from "react"
import { userDataSelector } from "@app/actions/userAction"
import LoginRequiredBar from "@app/components/helper/LoginRequiredBar"
import { useSelector } from "react-redux"
import { Row } from "react-bootstrap"
import ActionFormComponent from "@app/components/Formka/ActionFormComponent"
import { useIntl } from "react-intl"
import ResponsiveColumn, { ResponsiveColumnContext } from "@app/components/helper/ResponsiveColumn"
import { makeWordSetClient } from "@app/domain/langka/api/wordset"
import { useApiClient } from "@app/util/httpClient"
import { ExplainedError, useErrorExplainer } from "@app/util/explainError"
import { WordSetId, WordTupleId, WordTupleSummary } from "@app/domain/langka/definitons"
import { useNewLoadHelper } from "@app/util/react/newLoadHelper"
import LoadingSpinner from "@app/components/LoadingSpinner"
import AlertBar from "@app/components/helper/AlertBar"
import { wordTupleFormDescriptorFactroy } from "../../WordTuple/WordTupleForm"
import { parseWordTupleDestinationWords } from "@app/domain/langka/wordtuple"

export interface WordSetTupleEditOperationCallbacks {
    onLoadingError?: (error: any) => void,
    onOperatingError?: (error: any) => void,
    onSuccess?: () => void,
}

export default (props: {
    wordSetId: WordSetId,
    wordTupleId: WordTupleId,
    callbacks: WordSetTupleEditOperationCallbacks,
    context?: ResponsiveColumnContext
}) => {
    const userData = useSelector(userDataSelector)

    const client = useApiClient()
    const explainer = useErrorExplainer()
    const intl = useIntl()

    const { wordSetId, wordTupleId, context, callbacks } = props

    if (!userData) {
        return <LoginRequiredBar />
    }

    const wordSetClient = makeWordSetClient(client)

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

    let wordTuple: WordTupleSummary | null = null
    let wordTupleError: ExplainedError | null = null
    if (wordSetLoader.type === "loaded") {
        wordTuple = wordSetLoader.value.wordTuples.find((tuple) => tuple.id === wordTupleId)
        if (!wordTuple) {
            wordTupleError = {
                message: intl.formatMessage({ id: "component.langka.operation.operation.word_set_tuple_edit.no_tuple_error" })
            }
        }
    }

    if (wordSetLoader.type === "error" || wordTupleError) {
        const explained = wordTupleError ?? explainer.explainError(wordSetLoader.error)
        return <AlertBar
            variant="danger"
            title={intl.formatMessage({ id: "component.langka.operation.word_set_tuple_edit.top_error" })}
            message={explained.message}
        />
    } else if (wordSetLoader.type === "loaded") {
        const formDescriptor = wordTupleFormDescriptorFactroy({
            intl,
            topErrorTitle: intl.formatMessage({ id: "component.langka.operation.word_set_tuple_edit.form.top_error_title" })
        })

        return <Row>
            <ResponsiveColumn context={context}>
                <ActionFormComponent
                    localValidator={formDescriptor.localValidator}
                    initializeFormData={() => ({
                        sourceWord: wordTuple.sourceWord,
                        destinationWords: parseWordTupleDestinationWords(wordTuple.destinationWords),
                        description: wordTuple.description,
                    })}
                    renderer={formDescriptor.render}

                    onSubmit={async (data) => {
                        try {
                            await wordSetClient.putWordTuple(wordTupleId, {
                                sourceWord: data.sourceWord,
                                // TODO(teawithsand): move this join to some component handling domain logic
                                destinationWords: data.destinationWords.join("|"),
                                description: data.description,
                            })
                        } catch (e) {
                            if (callbacks.onOperatingError)
                                callbacks.onOperatingError(e)
                            throw e
                        }

                        if (callbacks.onSuccess)
                            callbacks.onSuccess()
                    }}
                />
            </ResponsiveColumn>
        </Row>
    } else {
        return <LoadingSpinner />
    }
}   