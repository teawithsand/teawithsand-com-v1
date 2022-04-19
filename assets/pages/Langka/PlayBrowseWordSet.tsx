import AlertBar from "@app/components/helper/AlertBar"
import ResponsiveColumn from "@app/components/helper/ResponsiveColumn"
import BrowseWordsGame from "@app/components/langka/Game/BrowseWordsGame"
import WordSetGameConfirmExitModal, { WordSetGameConfirmExitModalCallbacks } from "@app/components/langka/WordSet/Modals/WordSetGameConfirmExitModal"
import LoadingSpinner from "@app/components/LoadingSpinner"
import { makeWordSetClient } from "@app/domain/langka/api/wordset"
import { WordSetId } from "@app/domain/langka/definitons"
import { useErrorExplainer } from "@app/util/explainError"
import { useApiClient } from "@app/util/httpClient"
import { useAutonomousModalHelper } from "@app/util/react/modal/autonomousModal"
import { useDataLoadHelper } from "@app/util/react/newones/dataLoadHelper"
import React from "react"
import { Button, Col, Container, Row } from "react-bootstrap"
import { FormattedMessage, useIntl } from "react-intl"
import { useNavigate, useNavigationType, useParams } from "react-router"
import { LinkContainer } from "react-router-bootstrap"
import { showWordSetPath } from "../urls"

export default () => {
    const params = useParams()
    const navigate = useNavigate()

    const wordSetId = params.id as WordSetId

    const client = useApiClient()
    const wordSetClient = makeWordSetClient(client)
    const explainer = useErrorExplainer()
    const intl = useIntl()

    const closeModalHelper = useAutonomousModalHelper<{ text: string }, void>({})

    const state = useDataLoadHelper({
        loader: () => wordSetClient.getWordSetPublicDetails(wordSetId),
    }, [wordSetId])

    if (state.type === "pending") {
        return <Container>
            <LoadingSpinner />
        </Container>
    } else if (state.type === "error") {
        const explained = explainer.explainError(state.error)

        return <Container>
            <AlertBar
                title={intl.formatMessage({ id: "component.langka.page.play_browse_word_set.error_title" })}
                variant="danger"
                message={explained.message}
            />
        </Container>
    }

    const wordTuples = state.data.wordTuples

    const showCloseModal = () => {
        closeModalHelper.setData({
            text: intl.formatMessage({ id: "component.langka.page.play_browse_word_set.confirm_exit_modal_text" }),
        })
    }
    const closeModalCallbacks: WordSetGameConfirmExitModalCallbacks = {
        onConfirm: () => {
            navigate(showWordSetPath(wordSetId, {}))
        }
    }

    return <Container>
        <WordSetGameConfirmExitModal
            {...closeModalHelper}
            callbacks={closeModalCallbacks}
        />
        <Row className="mb-3">
            <Col>
                <BrowseWordsGame
                    tuples={wordTuples}
                    config={{}}
                />
            </Col>
        </Row>
        <Row>
            <ResponsiveColumn>
                <Button href="#" className="w-100" variant="danger" onClick={() => showCloseModal()}>
                    <FormattedMessage id="compontent.langka.page.play_browse_word_set.to_word_set" />
                </Button>
            </ResponsiveColumn>
        </Row>
    </Container>
}