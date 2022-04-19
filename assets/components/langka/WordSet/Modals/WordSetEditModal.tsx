import { Modal } from "react-bootstrap"
import React from "react"
import { WordSetId } from "@app/domain/langka/definitons"
import { AutonomousModalProps } from "@app/util/react/modal/autonomousModal"
import { FormattedMessage } from "react-intl"
import WordSetEditOperation, { WordSetEditOperationCallbacks } from "../Operations/WordSetEditOperation"

export default (props: AutonomousModalProps<
    WordSetId,
    void
> & {
    callbacks: WordSetEditOperationCallbacks
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
                <FormattedMessage id="component.langka.word_set_edit_modal.title" />
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {data ? <WordSetEditOperation context={"modal"} callbacks={callbacks} id={data} /> : null}
        </Modal.Body>
    </Modal>
}