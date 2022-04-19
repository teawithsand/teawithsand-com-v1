import { Button, Modal } from "react-bootstrap"
import React from "react"
import { AutonomousModalProps } from "@app/util/react/modal/autonomousModal"
import { FormattedMessage } from "react-intl"

export interface WordSetGameConfirmExitModalCallbacks {
    onConfirm: () => void
}

export default (props: AutonomousModalProps<{
    text: string,
}, void> & {
    callbacks: WordSetGameConfirmExitModalCallbacks
}) => {
    const { data, callbacks } = props

    return <Modal
        show={!!data}
        onHide={() => props.hide()}
        size="lg"
        centered
    >
        <Modal.Header closeButton>
            <Modal.Title>
                <FormattedMessage id="component.langka.word_set_game_confirm_exit_modal.title" />
            </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center" >
            <Button onClick={() => callbacks.onConfirm()} className="w-100">
                {data?.text ?? null}
            </Button>
        </Modal.Body>
    </Modal>
}