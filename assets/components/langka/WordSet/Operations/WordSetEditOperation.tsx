import React from "react"
import { userDataSelector } from "@app/actions/userAction"
import LoginRequiredBar from "@app/components/helper/LoginRequiredBar"
import { useSelector } from "react-redux"
import { Container, Row } from "react-bootstrap"
import ActionFormComponent from "@app/components/Formka/ActionFormComponent"
import { useIntl } from "react-intl"
import { wordSetFormRendererFactory, wordSetFormValidatorFactory } from "@app/components/langka/WordSet/WordSetForm"
import ResponsiveColumn, { ResponsiveColumnContext } from "@app/components/helper/ResponsiveColumn"
import { makeWordSetClient } from "@app/domain/langka/api/wordset"
import { useApiClient } from "@app/util/httpClient"
import { useNavigate } from "react-router"
import { useErrorExplainer } from "@app/util/explainError"
import { WordSetId } from "@app/domain/langka/definitons"
import { useNewLoadHelper } from "@app/util/react/newLoadHelper"
import LoadingSpinner from "@app/components/LoadingSpinner"
import AlertBar from "@app/components/helper/AlertBar"

export interface WordSetEditOperationCallbacks {
    onLoadingError?: (error: any) => void,
    onOperatingError?: (error: any) => void,
    onSuccess?: () => void,
}

export default (props: { id: WordSetId, callbacks: WordSetEditOperationCallbacks, context?: ResponsiveColumnContext }) => {
    const userData = useSelector(userDataSelector)

    const client = useApiClient()
    const navigate = useNavigate()
    const explainer = useErrorExplainer()
    const intl = useIntl()

    const { id, context, callbacks } = props

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
        parameterInitializer: () => id
    })

    if (wordSetLoader.type === "loaded") {
        return <Row>
            <ResponsiveColumn context={context}>
                <ActionFormComponent
                    localValidator={wordSetFormValidatorFactory({ intl })}
                    initializeFormData={() => ({
                        description: wordSetLoader.value.description,
                        title: wordSetLoader.value.title,
                        destinationLanguage: wordSetLoader.value.destinationLanguage,
                        sourceLanguage: wordSetLoader.value.sourceLanguage,
                    })}
                    renderer={wordSetFormRendererFactory({})}
                    onSubmit={async (data) => {
                        try {
                            await wordSetClient.putWordSet(id, {
                                description: data.description,
                                destinationLanguage: data.destinationLanguage,
                                sourceLanguage: data.sourceLanguage,
                                title: data.title
                            })
                        } catch (e) {
                            if (callbacks.onOperatingError)
                                callbacks.onOperatingError(e)
                            throw e
                        }


                        if (callbacks.onSuccess)
                            callbacks.onSuccess()
                        /*
                        // TODO(teawithsand): display toast here

                        navigate(showWordSetPath(id, {
                            type: "secret",
                        }))
                        */
                    }}
                />
            </ResponsiveColumn>
        </Row>
    } else if (wordSetLoader.type === "error") {
        const explained = explainer.explainError(wordSetLoader.error)
        return <AlertBar
            variant="danger"
            title={intl.formatMessage({ id: "component.langka.operation.word_set_edit.top_error" })}
            message={explained.message}
        />
    } else {
        return <LoadingSpinner />
    }
}   