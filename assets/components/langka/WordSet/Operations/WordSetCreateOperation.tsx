import React from "react"
import { userDataSelector } from "@app/actions/userAction"
import LoginRequiredBar from "@app/components/helper/LoginRequiredBar"
import { useSelector } from "react-redux"
import { Row } from "react-bootstrap"
import ActionFormComponent from "@app/components/Formka/ActionFormComponent"
import { useIntl } from "react-intl"
import { wordSetFormInitialDataFactory, wordSetFormRendererFactory, wordSetFormValidatorFactory } from "@app/components/langka/WordSet/WordSetForm"
import ResponsiveColumn, { ResponsiveColumnContext } from "@app/components/helper/ResponsiveColumn"
import { makeWordSetClient } from "@app/domain/langka/api/wordset"
import { useApiClient } from "@app/util/httpClient"
import { useNavigate } from "react-router"
import { useErrorExplainer } from "@app/util/explainError"
import { WordSetId } from "@app/domain/langka/definitons"

export interface WordSetCreateOperationCallbacks {
    onLoadingError?: (error: any) => void,
    onOperatingError?: (error: any) => void,
    onSuccess?: (id: WordSetId) => void,
}

export default (props: { callbacks: WordSetCreateOperationCallbacks, context?: ResponsiveColumnContext }) => {
    const userData = useSelector(userDataSelector)

    const client = useApiClient()
    const navigate = useNavigate()
    const explainer = useErrorExplainer()
    const intl = useIntl()

    const { context, callbacks } = props

    if (!userData) {
        return <LoginRequiredBar />
    }

    const wordSetClient = makeWordSetClient(client)

    return <Row>
        <ResponsiveColumn context={context}>
            <ActionFormComponent
                localValidator={wordSetFormValidatorFactory({ intl })}
                initializeFormData={wordSetFormInitialDataFactory}
                renderer={wordSetFormRendererFactory({})}
                onSubmit={async (data) => {
                    let id: WordSetId
                    try {
                        id = await wordSetClient.postWordSet({
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
                        callbacks.onSuccess(id)
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
}   