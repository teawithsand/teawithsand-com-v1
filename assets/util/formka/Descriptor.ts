import { FormRenderer } from "./FormRenderer";
import FormValidator from "./FormValidator";

export type FormDescriptor<T> = {
    initializeFormData: () => T,
    render: FormRenderer<T>,
    localValidator: FormValidator<T>,
}