import ToastData from "@app/domain/toast/toast";
import { Toast } from "react-bootstrap";
import * as React from "react"

export default (props: {
    toastData: ToastData,
    progressDsappearAfterMillis?: number,
    onRemoved: () => void,
}) => {
    let progressBar = null
    if (props.progressDsappearAfterMillis) {
        progressBar = <div className="toast--bar-thin" key={`${props.toastData.id}`} style={{
            animationName: "toast--timeout--bar",
            animationTimingFunction: "linear",
            animationDuration: `${props.progressDsappearAfterMillis / 1000}s`,
            animationIterationCount: "infinite",
        }}>

        </div>
    }
    return <Toast onClose={() => props.onRemoved()} bg={props.toastData.type.toLowerCase()}>
        <Toast.Header>
            <strong className="me-auto">{props.toastData.title}</strong>
            {/* <small className="text-muted">{ props.toastData.displayCreatedAtMillis }</small> */}
        </Toast.Header>
        <Toast.Body>{props.toastData.message}</Toast.Body>
        {progressBar}
    </Toast>
}