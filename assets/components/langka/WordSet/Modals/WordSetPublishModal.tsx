import { Modal } from "react-bootstrap"
import React from "react"
import { WordSetId } from "@app/domain/langka/definitons"
import { AutonomousModalProps } from "@app/util/react/modal/autonomousModal"
import { WordSetPublishOperationCallbacks } from "../Operations/WordSetPublishOperation"
import { FormattedMessage } from "react-intl"
import WordSetPublishOperation from "../Operations/WordSetPublishOperation"

export default (props: AutonomousModalProps<
    WordSetId,
    void
> & {
    callbacks: WordSetPublishOperationCallbacks
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
            {data ? <WordSetPublishOperation context={"modal"} callbacks={callbacks} id={data} /> : null}
        </Modal.Body>
    </Modal>
}