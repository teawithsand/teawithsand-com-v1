import { UnlocalizedConstraintViolation } from "../explainError";
import { ConstraintViolationBag } from "../formError";

export interface FieldValidator<T> {
    validate: (fieldData: T) => UnlocalizedConstraintViolation[]
}

export default interface FormValidator<T> {
    validate: (data: T) => ConstraintViolationBag,
}