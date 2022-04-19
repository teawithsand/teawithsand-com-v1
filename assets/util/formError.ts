import { ConstraintViolation } from "./explainError";

/**
 * Path, used to display error, which is on top of form and is not assignable to any field.
 */
export const PATH_TOP_ERROR = "__toperror"

/**
 * Bag, which simplifies extracting info from it.
 */
export class ConstraintViolationBag {
    constructor(
        private readonly innerViolations: ConstraintViolation[]
    ) { }

    get violations() {
        return this.innerViolations
    }

    get empty() {
        return this.innerViolations.length === 0
    }

    messagesForPath = (path: string): string[] =>
        this
            .innerViolations
            .filter((v) => v.propertyPath === path)
            .map((v) => v.message)

    hasErrorForPath = (path: string): boolean =>
        this
            .innerViolations
            .some((v) => v.propertyPath === path)

    withRenamedPath = (path: string, newPath: string) => {
        if (!this.hasErrorForPath(path))
            return this

        const violations = this.innerViolations.map(v => ({
            ...v,
            path: v.propertyPath === path ? newPath : v.propertyPath,
        }))
        return new ConstraintViolationBag(violations)
    }
}

export const mergeBags = (...bags: ConstraintViolationBag[]) => {
    let violations: ConstraintViolation[] = []
    for (const b of bags) {
        violations = [...violations, ...b.violations];
    }

    return new ConstraintViolationBag(violations)
}