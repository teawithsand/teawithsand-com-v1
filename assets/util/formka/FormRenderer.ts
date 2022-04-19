import { ConstraintViolationBag } from "../formError";
import React from "react"

export interface FormRendererProps<T> {
    // True, if local validators have yielded no error.
    formData: T,

    localErrorBag: ConstraintViolationBag,
    remoteErrorBag: ConstraintViolationBag,
    errorBag: ConstraintViolationBag,

    setFormData: (newData: T) => void,

    handleSubmit: (e: any) => void,
}


export type FormRenderer<T> = (props: FormRendererProps<T>) => React.ReactElement