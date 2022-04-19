import { Modal } from "react-bootstrap"
import React from "react"
import { WordSetId, WordTupleId } from "@app/domain/langka/definitons"
import { AutonomousModalProps, AutonomousModalResultMessage } from "@app/util/react/modal/autonomousModal"
import { WordSetDeleteOperationCallbacks } from "../Operations/WordSetDeleteOperation"
import { FormattedMessage } from "react-intl"
import WordSetDeleteOperation from "../Operations/WordSetDeleteOperation"

export default (props: AutonomousModalProps<
    WordSetId,
    void
> & {
    callbacks: WordSetDeleteOperationCallbacks
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
                <FormattedMessage id="component.langka.word_set_delete_modal.title" />
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {data ? <WordSetDeleteOperation context={"modal"} callbacks={callbacks} id={data} /> : null}
        </Modal.Body>
    </Modal>
}