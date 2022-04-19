import { IntlShape, useIntl } from "react-intl";
import { AxiosError } from "axios"
import { ConstraintViolationBag, PATH_TOP_ERROR } from "./formError";

export interface ErrorExplainer {
    explainError: (e: any) => ExplainedError
}

type TwsApiErrorResponse = {
    title: string,
    description: string,
    descriptionParams?: {
        [key: string]: string
    }
}

const isTwsApiErrorResponse = (e: any): boolean => {
    if (typeof e !== "object")
        return false;

    return typeof e.title === "string" &&
        typeof e.description === "string" && (
            typeof e.descriptionParams === "undefined" || typeof e.descriptionParams === "object"
            // skip futher checking for sake of simplicity for now
        )
}

type FlattenErrorResponse = {
    title: string,
    code: number,
    violations?: {
        message: string,
        propertyPath: string,
        code: string | null,
    }[],
}

const isFlattenErrorResponse = (e: any): boolean => {
    if (typeof e !== "object")
        return false;

    return typeof e.title === "string" &&
        typeof e.code === "number"
}

const isViolationErrorResponse = (e: any): boolean => {
    if (!isFlattenErrorResponse(e))
        return false;

    return typeof e.violations === "object"
}

export type ErrorResponseType = TwsApiErrorResponse | FlattenErrorResponse

// Note: this one is always translated
export type ConstraintViolation = {
    message: string,
    propertyPath: string,
    code: string | null,
}

/**
 * Constraint violation, which does not have any path associated.
 */
export type UnlocalizedConstraintViolation = {
    message: string,
    code: string | null,
}

export type ExplainedError = {
    message: string,
    constraintViolations?: ConstraintViolation[],
    statusCode?: number,
    // TODO(teawithsand): provide some additional data here
}

// export const mapTopLevelViolations = (bag: ConstraintViolationBag): ConstraintViolationBag => bag
// .withRenamedPath("wordSet", PATH_TOP_ERROR)

export const defaultExplainError = (translator: IntlShape, e: any): ExplainedError => {
    if (typeof e === "object") {
        if (e instanceof Error && typeof (e as any).isAxiosError === "boolean" && (e as any).isAxiosError) {
            const axiosError = e as AxiosError;
            const { response, code } = axiosError
            // TODO(teawithsand): test this timeout scenario
            if (code === "ECONNABORTED") {
                return {
                    // there is no response when aborted...
                    // statusCode: response.status,
                    message: translator.formatMessage({ "id": "component.error_explainer.connection_error" }),
                }
            } else if (response) {
                const { data } = response
                if (isTwsApiErrorResponse(data)) {
                    const apiError = data as TwsApiErrorResponse
                    return {
                        statusCode: response.status,
                        message: translator.formatMessage(
                            {
                                id: apiError.description,
                                // defaultMessage: apiError.title
                            },
                            apiError.descriptionParams,
                        ),
                        constraintViolations: [],
                    }
                } else if (isViolationErrorResponse(data)) {
                    const violationError = data as FlattenErrorResponse
                    const violations = (violationError.violations || []).map((v) => ({
                        ...v,
                        message: translator.formatMessage({ id: v.message }),
                    }))

                    return {
                        statusCode: response.status,
                        message: violationError.title,
                        constraintViolations: violations,
                    }
                } else if (isFlattenErrorResponse(data)) {
                    const flattenError = data as FlattenErrorResponse
                    return {
                        statusCode: response.status,
                        message: flattenError.title,
                    }
                }
            }
        } else if(e instanceof Error && typeof e === "object" && typeof (e as any).explainedError === "object") {
            return (e as any).explainedError
        }
    }

    return {
        message: translator.formatMessage({ "id": "component.error_explainer.unknown" }),
    }
}

export const useErrorExplainer = (): ErrorExplainer => {
    const intl = useIntl()

    return {
        explainError: (e) => defaultExplainError(intl, e),
    }
}