import WordSetView from "@app/components/langka/WordSet/WordSetView"
import { WordSetId, WordSetPublicDetails, WordSetSecretDetails, WordTupleId } from "@app/domain/langka/definitons"
import { Container } from "react-bootstrap"
import React, { useState } from "react"
import { useNewLoadHelper } from "@app/util/react/newLoadHelper"
import { useApiClient } from "@app/util/httpClient"
import { makeWordSetClient } from "@app/domain/langka/api/wordset"
import { useErrorExplainer } from "@app/util/explainError"
import AlertBar from "@app/components/helper/AlertBar"
import { useIntl } from "react-intl"
import LoadingSpinner from "@app/components/LoadingSpinner"
import { useNavigate, useParams } from "react-router"
import { useAutonomousModalHelper } from "@app/util/react/modal/autonomousModal"
import { WordSetDeleteOperationCallbacks } from "@app/components/langka/WordSet/Operations/WordSetDeleteOperation"
import WordSetDeleteModal from "@app/components/langka/WordSet/Modals/WordSetDeleteModal"
import WordSetEditModal from "@app/components/langka/WordSet/Modals/WordSetEditModal"
import { WordSetEditOperationCallbacks } from "@app/components/langka/WordSet/Operations/WordSetEditOperation"
import WordSetTupleDeleteModal from "@app/components/langka/WordSet/Modals/WordSetTupleDeleteModal"
import WordSetTupleAddModal from "@app/components/langka/WordSet/Modals/WordSetTupleAddModal"
import { WordSetTupleAddOperationCallbacks } from "@app/components/langka/WordSet/Operations/WordSetTupleAddOperation"
import { WordSetTupleDeleteOperationCallbacks } from "@app/components/langka/WordSet/Operations/WordSetTupleDeleteOperation"
import WordSetTupleEditModal from "@app/components/langka/WordSet/Modals/WordSetTupleEditModal"
import { WordSetTupleEditOperationCallbacks } from "@app/components/langka/WordSet/Operations/WordSetTupleEditOperation"
import { useSelector } from "react-redux"
import { userDataSelector } from "@app/actions/userAction"
import WordSetPublishModal from "@app/components/langka/WordSet/Modals/WordSetPublishModal"
import { WordSetPublishOperationCallbacks } from "@app/components/langka/WordSet/Operations/WordSetPublishOperation"

export default (props: {
    type: "public" | "secret",
}) => {
    const navigate = useNavigate()
    const explainer = useErrorExplainer()
    const intl = useIntl()
    const params = useParams()

    const [type, setType] = useState(props.type)

    const id = params.id as WordSetId

    const userData = useSelector(userDataSelector)


    const client = useApiClient()
    const wordSetClient = makeWordSetClient(client)
    const [wordSetLoader, _, reloadWordSet] = useNewLoadHelper<WordSetPublicDetails | WordSetSecretDetails, WordSetId>({
        loader: async (id) => {
            if (type === "secret") {
                return await wordSetClient.getWordSetSecretDetails(id)
            } else {
                return await wordSetClient.getWordSetPublicDetails(id)
            }
        },
        parameterInitializer: () => id
    })

    const deleteModalHelper = useAutonomousModalHelper<WordSetId, void>({})
    const editModalHelper = useAutonomousModalHelper<WordSetId, void>({})
    const publishModalHelper = useAutonomousModalHelper<WordSetId, void>({})
    const addTupleModalHelper = useAutonomousModalHelper<WordSetId, void>({})
    const deleteTupleModalHelper = useAutonomousModalHelper<{
        wordSetId: WordSetId,
        wordTupleId: WordTupleId,
    }, void>({})
    const editTupleModalHelper = useAutonomousModalHelper<{
        wordSetId: WordSetId,
        wordTupleId: WordTupleId,
    }, void>({})

    /*
      const [wordSetTuples, _] = useNewLoadHelper({
        loader: async (id) => {
            if (type === "secret") {
                return await wordSetClient.getWordSetWordTuplesSummary(id)
            } else {
                return await wordSetClient.getWordSetPublicDetails(id)
            }
        },
        parameterInitializer: () => id
    })
    */

    let innerView = null
    if (wordSetLoader.type === "loaded") {
        if (type === "public") {

            if (userData?.id === wordSetLoader.value.owner.id) {
                setType("secret")
            }

            innerView = <WordSetView

                type={type}
                wordSet={wordSetLoader.value as any}

                wordTuples={wordSetLoader.value.wordTuples}
            />
        } else {
            // TODO(teawithsand): implement these methods + rotues for editing tuples
            //  then implement publishing, gaming and gogo
            innerView = <WordSetView
                onWordSetDelete={() => {
                    deleteModalHelper.setData(wordSetLoader.value.id)
                }}
                onWordSetEdit={() => {
                    editModalHelper.setData(wordSetLoader.value.id)
                }}
                onWordSetPublish={() => {
                    publishModalHelper.setData(wordSetLoader.value.id)
                }}
                onTupleCreate={() => {
                    addTupleModalHelper.setData(wordSetLoader.value.id)
                }}
                onTupleDelete={(tuple) => {
                    deleteTupleModalHelper.setData({
                        wordSetId: wordSetLoader.value.id,
                        wordTupleId: tuple.id,
                    })
                }}
                onTupleEdit={(tuple) => {
                    editTupleModalHelper.setData({
                        wordSetId: wordSetLoader.value.id,
                        wordTupleId: tuple.id,
                    })
                }}
                type={type}
                wordSet={wordSetLoader.value as unknown as WordSetSecretDetails}

                wordTuples={wordSetLoader.value.wordTuples}
            />
        }

    } else if (wordSetLoader.type === "error") {
        const explained = explainer.explainError(wordSetLoader.error)
        innerView = <AlertBar
            variant="danger"
            title={intl.formatMessage({ id: "page.langka.show_word_set.error" })}
            message={explained.message}
        />
    } else {
        innerView = <LoadingSpinner />
    }

    const deleteCallbacks: WordSetDeleteOperationCallbacks = {
        onSuccess: () => {
            navigate(-1)

            // TODO(teawithsand): toast here
        },
        onCancelClick: () => {
            deleteModalHelper.hide()
        }
    }

    const editCallbacks: WordSetEditOperationCallbacks = {
        onSuccess: () => {
            reloadWordSet()
            editModalHelper.hide()

            // TODO(teawithsand): toast here
        }
    }

    const publishCallbacks: WordSetPublishOperationCallbacks = {
        onSuccess: () => {
            reloadWordSet()
            publishModalHelper.hide()

            // TODO(teawithsand): toast here
        }
    }

    const addTupleModalCallbacks: WordSetTupleAddOperationCallbacks = {
        onSuccess: () => {
            reloadWordSet()
            addTupleModalHelper.hide()

            // TODO(teawithsand): toast here
        }
    }

    const deleteTupleModalCallbacks: WordSetTupleDeleteOperationCallbacks = {
        onSuccess: () => {
            reloadWordSet()
            deleteTupleModalHelper.hide()

            // TODO(teawithsand): toast here
        },
        onCancelClick: () => {
            deleteTupleModalHelper.hide()
        }
    }

    const editTupleModalCallbacks: WordSetTupleEditOperationCallbacks = {
        onSuccess: () => {
            reloadWordSet()
            editTupleModalHelper.hide()

            // TODO(teawithsand): toast here
        },
    }

    return <Container>
        <WordSetDeleteModal {...deleteModalHelper} callbacks={deleteCallbacks} />
        <WordSetEditModal {...editModalHelper} callbacks={editCallbacks} />
        <WordSetPublishModal {...publishModalHelper} callbacks={publishCallbacks} />
        <WordSetTupleAddModal {...addTupleModalHelper} callbacks={addTupleModalCallbacks} />
        <WordSetTupleDeleteModal {...deleteTupleModalHelper} callbacks={deleteTupleModalCallbacks} />
        <WordSetTupleEditModal {...editTupleModalHelper} callbacks={editTupleModalCallbacks} />
        {innerView}
    </Container>
}