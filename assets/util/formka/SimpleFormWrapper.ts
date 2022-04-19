import { ConstraintViolationBag } from "../formError";
import { FormRenderer, FormRendererProps } from "./FormRenderer";
import FormValidator from "./FormValidator";

export interface SimpleFormWrapperProps<T> {
    localValidator?: FormValidator<T>,
    remoteErrorBag?: ConstraintViolationBag,

    formData: T,

    onChanged: (newData: T) => void,
    onSubmit: (data: T) => void,
    render: FormRenderer<T>,
}

export default <T>(
    props: SimpleFormWrapperProps<T>,
) => {
    const actualFormData = props.formData

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
            props.onChanged(newData)
        },

        handleSubmit: (e) => {
            e.preventDefault()

            if (localErrorBag.empty)
                props.onSubmit(actualFormData)
        }
    }

    return props.render(parameters)
}