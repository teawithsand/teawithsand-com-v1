import React from "react"
import { userDataSelector } from "@app/actions/userAction"
import LoginRequiredBar from "@app/components/helper/LoginRequiredBar"
import { useSelector } from "react-redux"
import { Col, Container, Row } from "react-bootstrap"
import ActionFormComponent from "@app/components/Formka/ActionFormComponent"
import { FormattedMessage, useIntl } from "react-intl"
import { wordSetFormRendererFactory, wordSetFormValidatorFactory } from "@app/components/langka/WordSet/WordSetForm"
import ResponsiveColumn from "@app/components/helper/ResponsiveColumn"
import { makeWordSetClient } from "@app/domain/langka/api/wordset"
import { useApiClient } from "@app/util/httpClient"
import { useNavigate } from "react-router"
import { showWordSetPath } from "../urls"

export default () => {
    const userData = useSelector(userDataSelector)

    const intl = useIntl()
    const client = useApiClient()
    const navigate = useNavigate()

    if (!userData) {
        return <Container>
            <LoginRequiredBar />
        </Container>
    }
    const wordSetClient = makeWordSetClient(client)

    return <Container>
        <Row className="text-center mb-3">
            <Col>
                <h1><FormattedMessage id="page.langka.create_word_set.title" /></h1>
            </Col>
        </Row>
        <Row>
            <ResponsiveColumn>
                <ActionFormComponent
                    localValidator={wordSetFormValidatorFactory({ intl })}
                    initializeFormData={() => ({
                        description: "",
                        title: `Word set #${Math.floor(Math.random() * 10000000)}`,
                        destinationLanguage: "en",
                        sourceLanguage: "fr",
                    })}
                    renderer={wordSetFormRendererFactory({})}
                    onSubmit={async (data) => {
                        const newId = await wordSetClient.postWordSet({
                            description: data.description,
                            destinationLanguage: data.destinationLanguage,
                            sourceLanguage: data.sourceLanguage,
                            title: data.title
                        })

                        // TODO(teawithsand): display toast here

                        navigate(showWordSetPath(newId, {
                            type: "secret",
                        }))
                    }}
                />
            </ResponsiveColumn>
        </Row>
    </Container>
}   