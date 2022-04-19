import React from "react";
import { ConstraintViolationBag } from "../formError";
import { FormRenderer, FormRendererProps } from "./FormRenderer";
import FormValidator from "./FormValidator";

export interface AutoFormWrapperProps<T> {
    localValidator?: FormValidator<T>,
    remoteErrorBag?: ConstraintViolationBag,

    initializeFormData: () => T,

    onChanged?: (newData: T) => void,
    onSubmit: (data: T) => void,
    render: FormRenderer<T>,
}

export default <T>(
    props: AutoFormWrapperProps<T>,
) => {
    const [isFormDataSet, setIsFormDataSet] = React.useState(false);
    const [formData, setFormData] = React.useState<T>();


    let actualFormData = formData
    if (!isFormDataSet) {
        actualFormData = props.initializeFormData()
        setFormData(actualFormData)
        setIsFormDataSet(true)
    }

    let localErrorBag = new ConstraintViolationBag([])
    if (props.localValidator) {
        localErrorBag = props.localValidator.validate(actualFormData)
    }

    const parameters: FormRendererProps<T> = {
        formData: actualFormData,

        localErrorBag,
        remoteErrorBag: props.remoteErrorBag ?? new ConstraintViolationBag([]),
        errorBag: new ConstraintViolationBag([
            ...localErrorBag.violations,
            ...(props.remoteErrorBag?.violations ?? [])
        ]),

        setFormData: (newData: T) => {
            if (props.onChanged)
                props.onChanged(newData)

            setFormData(newData)
        },

        handleSubmit: (e) => {
            e.preventDefault()

            if (localErrorBag.empty)
                props.onSubmit(actualFormData)
        }
    }

    return props.render(parameters)
}