import React from "react"

export interface GameRendererProps<S, I> {
    state: S,
    isFinalized: boolean,

    hasError: boolean,
    error?: any,

    isComputingNewState: boolean,

    handleInput: (input: I) => void
}

export type GameRenderer<S, I> = (props: GameRendererProps<S, I>) => React.ReactElement