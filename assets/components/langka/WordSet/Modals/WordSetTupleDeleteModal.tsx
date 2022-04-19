import { Modal } from "react-bootstrap"
import React from "react"
import { WordSetId, WordTupleId } from "@app/domain/langka/definitons"
import { AutonomousModalProps } from "@app/util/react/modal/autonomousModal"
import { FormattedMessage } from "react-intl"
import WordSetTupleDeleteOperation, { WordSetTupleDeleteOperationCallbacks } from "../Operations/WordSetTupleDeleteOperation"

export default (props: AutonomousModalProps<
    {
        wordSetId: WordSetId,
        wordTupleId: WordTupleId,
    },
    void
> & {
    callbacks: WordSetTupleDeleteOperationCallbacks
}) => {
    const { data, callbacks } = props

    return <Modal
        show={!!data}
        fullscreen="lg-down"
        size="lg"

        onHide={() => props.hide()}
        centered
    >
        <Modal.Header closeButton>
            <Modal.Title>
                <FormattedMessage id="component.langka.modal.word_set_tuple_delete_modal.title" />
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {data ? <WordSetTupleDeleteOperation
                context={"modal"}
                callbacks={callbacks}
                wordSetId={data.wordSetId}
                wordTupleId={data.wordTupleId} /> : null}
        </Modal.Body>
    </Modal>
}