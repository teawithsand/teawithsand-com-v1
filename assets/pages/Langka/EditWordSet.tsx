import WordSetEditOperation, { WordSetEditOperationCallbacks } from "@app/components/langka/WordSet/Operations/WordSetEditOperation"
import { WordSetId } from "@app/domain/langka/definitons"
import { Container } from "react-bootstrap"
import { useParams } from "react-router"
import React from "react"

// TODO(teawithsand): remove it, now edition is done via modal
/**
 * @deprecated use modal instead
 */
export default () => {
    const params = useParams()
    const callbacks: WordSetEditOperationCallbacks = {

    }

    const id = params.id as WordSetId
    return <Container>
        <WordSetEditOperation
            callbacks={callbacks}
            context="container"
            id={id}
        />
    </Container>
}