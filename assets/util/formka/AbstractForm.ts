import React from "react";

/*
export interface AbstractFormProps<T> {
    dataInitializer: () => T,
    onChanged?: (newData: T) => void,
    onSubmit: (data: T) => void,
}

/**
 * Abstract form is form, which handles only data.
 * /
 export type AbstractForm<T> = (props: AbstractFormProps<T>) => React.ReactElement
 */

 export interface AbstractFormOptions {
    topErrorTitle?: string,
 }