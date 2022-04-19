import { ConstraintViolation, useErrorExplainer } from "@app/util/explainError";
import { ConstraintViolationBag, PATH_TOP_ERROR } from "@app/util/formError";
import { FormRenderer } from "@app/util/formka/FormRenderer";
import FormValidator from "@app/util/formka/FormValidator";
import SimpleFormWrapper from "@app/util/formka/SimpleFormWrapper";
import { simpleSleep, sleep } from "@app/util/promise";
import { useLoadHelper } from "@app/util/react/formHelper";
import { useNewLoadHelper } from "@app/util/react/newLoadHelper";
import React, { useState } from "react"
import LoadingSpinner from "../LoadingSpinner";

export interface FormActionComponentOptions<T> {
    initializeData: () => T,
    performAction: (data: T) => Promise<void>,
}

export default <T, E>(
    props: {
        renderer: FormRenderer<T>,
        initializeFormData: () => T,

        localValidator?: FormValidator<T>,

        onSubmit: (formData: T) => Promise<E>,

        processErrorTransformer?: (error: any) => ConstraintViolationBag,

        onError?: (error: any) => void,
        onSuccess?: (result: E) => void,
    },
) => {
    const onSubmitAsync = async (data: T) => {
        try {
            const res = await props.onSubmit(data)
            if (props.onSuccess) {
                props.onSuccess(res)
            }
        } catch (e) {
            if (props.onError) {
                props.onError(e)
            }

            setRemoteErrorBag(processErrorForBag(e))
            throw e;
        }
    }


    // const [state, setPromise] = useLoadHelper({})
    const [state, doSubmit, _] = useNewLoadHelper<void, T | undefined>({
        parameterInitializer: (): T | undefined => undefined,
        loader: async (data) => {
            if (data === undefined) {
                return;
            }

            await onSubmitAsync(data)
        }
    })
    const [remoteErrorBag, setRemoteErrorBag] = useState(new ConstraintViolationBag([]))

    const [isFormDataSet, setIsFormDataSet] = React.useState(false);
    const [formData, setFormData] = React.useState<T>();

    const errorExplainer = useErrorExplainer()

    let actualFormData = formData
    if (!isFormDataSet) {
        actualFormData = props.initializeFormData()
        setFormData(actualFormData)
        setIsFormDataSet(true)
    }

    const processErrorForBag = (error: any): ConstraintViolationBag => {
        if (props.processErrorTransformer) {
            return props.processErrorTransformer(error)
        } else {
            const explained = errorExplainer.explainError(error)
            let violations: ConstraintViolation[] = []
            if (explained.constraintViolations) {
                violations = [...violations, ...explained.constraintViolations]
            }

            // TODO(teawithsand): move this piece of code to error explainer v2 version or sth
            //  it's unsound to handle this like that
            if (explained.message) violations.push({
                code: null,
                message: explained.message,
                propertyPath: PATH_TOP_ERROR
            })

            return new ConstraintViolationBag(violations)
        }
    }

    if (state.type === "pending") {
        return <LoadingSpinner />
    }

    const onSubmit = (data: T) => {
        setRemoteErrorBag(new ConstraintViolationBag([]))

        doSubmit(data, true)
    }

    const onChanged = (newData: T) => {
        setRemoteErrorBag(new ConstraintViolationBag([]))

        setFormData(newData)
    }

    return <SimpleFormWrapper
        formData={actualFormData}
        onChanged={onChanged}
        onSubmit={onSubmit}
        localValidator={props.localValidator}
        remoteErrorBag={remoteErrorBag}
        render={props.renderer}
    />
}