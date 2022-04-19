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
import { useErrorExplainer } from "@app/util/explainError"
import { WordSetId } from "@app/domain/langka/definitons"
import { useNewLoadHelper } from "@app/util/react/newLoadHelper"
import LoadingSpinner from "@app/components/LoadingSpinner"
import AlertBar from "@app/components/helper/AlertBar"
import { wordTupleFormDescriptorFactroy } from "../../WordTuple/WordTupleForm"

export interface WordSetTupleAddOperationCallbacks {
    onLoadingError?: (error: any) => void,
    onOperatingError?: (error: any) => void,
    onSuccess?: () => void,
}

export default (props: { wordSetId: WordSetId, callbacks: WordSetTupleAddOperationCallbacks, context?: ResponsiveColumnContext }) => {
    const userData = useSelector(userDataSelector)

    const client = useApiClient()
    const explainer = useErrorExplainer()
    const intl = useIntl()

    const { wordSetId, context, callbacks } = props

    if (!userData) {
        return   <LoginRequiredBar />
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


    if (wordSetLoader.type === "loaded") {
        const formDescriptor = wordTupleFormDescriptorFactroy({
            intl,
            topErrorTitle: intl.formatMessage({ id: "component.langka.word_set_add_tuple_operation.form.top_error_title" })
        })
        
        return <Row>
            <ResponsiveColumn context={context}>
                <ActionFormComponent
                    localValidator={formDescriptor.localValidator}
                    initializeFormData={formDescriptor.initializeFormData}
                    renderer={formDescriptor.render}

                    onSubmit={async (data) => {
                        try {
                            await wordSetClient.postWordTuple({
                                sourceWord: data.sourceWord,
                                // TODO(teawithsand): move this join to some component handling domain logic
                                destinationWords: data.destinationWords.join("|"),
                                description: data.description,
                                wordSet: wordSetId,
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
    } else if (wordSetLoader.type === "error") {
        const explained = explainer.explainError(wordSetLoader.error)
        return <AlertBar
            variant="danger"
            title={intl.formatMessage({ id: "component.langka.word_set_add_tuple_operation.top_error" })}
            message={explained.message}
        />
    } else {
        return <LoadingSpinner />
    }
}   