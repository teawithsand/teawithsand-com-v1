import { useEffect, useState } from "react"

/**
 * Game is state + logic handling it.
 * 
 * # Note 
 * Game component must be immutable.
 * Handling input on game produces new game and must not affect current game.
 */
export interface NewGame<S, I> {
    readonly state: S

    // Whtether game accepts new inputs or not.
    // Does not accept if finalized.
    // Calling handleInput when finalized is UB
    isFinalized: boolean
    handleInput: (input: I) => Promise<NewGame<S, I>>
}

export interface BaseGameState {
    isFinalized: boolean
}

export const makeFunctonalGame = <S extends BaseGameState, I>(
    initialState: S,
    inputHandler: (state: S, input: I) => Promise<S>
): NewGame<S, I> => {
    const stateInputHandler = async (state: S, input: I): Promise<NewGame<S, I>> => {
        const newState = await inputHandler(state, input)

        return {
            state: newState,
            isFinalized: newState.isFinalized,
            handleInput: (input: I) => stateInputHandler(newState, input),
        }
    }

    return {
        state: initialState,
        isFinalized: initialState.isFinalized,
        handleInput: (input: I) => stateInputHandler(initialState, input)
    }
}


export type NewGameHelperState<S> = {
    type: "running",
    state: S,
    error?: undefined,
} | {
    type: "computingNewState",
    state: S,
    error?: undefined,
} | {
    type: "finalized",
    state: S,
    error?: undefined,
} | {
    type: "error",
    state: S,
    error: any,
}

export type NewGameHelper<S, I> = [
    NewGameHelperState<S>,
    (input: I) => void,
]

export interface NewGameHelperCallbacks<S, I> {
    onFinalized?: (state: S) => void
}

export interface NewGameHelperOptions<S, I, PA> {
    callbacks: NewGameHelperCallbacks<S, I>,
    gameFactory: (parameters: PA) => NewGame<S, I>
}

export const useNewGame = <S, I, PA extends Array<any>>(
    options: NewGameHelperOptions<S, I, PA>,
    parameters: PA,
): NewGameHelper<S, I> => {
    const [isInitialGame, setInitialGame] = useState(true)
    const [game, setGame] = useState(options.gameFactory(parameters))
    const [state, setState] = useState<NewGameHelperState<S>>({
        type: "running",
        state: game.state,
    })

    const [inputQueue, setInputQueue] = useState([])

    const handleGameInputQueue = async (isClosed: { current: boolean }) => {
        if (inputQueue.length === 0) {
            return;
        }
        const input = inputQueue[0]

        try {
            const newGame = await game.handleInput(input)
            if (!isClosed.current) {
                setInitialGame(false)

                setGame(newGame)
                setState({
                    type: newGame.isFinalized ? "finalized" : "running",
                    state: newGame.state,
                })


                if (options.callbacks.onFinalized && newGame.isFinalized) {
                    options.callbacks.onFinalized(newGame.state)
                }
            }
        } catch (e) {
            if (!isClosed.current) {
                setInitialGame(false)

                setState({
                    type: "error",
                    state: game.state,
                    error: e,
                })
            }
        } finally {
            const newQueue = [...inputQueue]
            newQueue.shift()
            setInputQueue(newQueue)
        }
    }

    useEffect(() => {
        if (!isInitialGame) {
            const newGame = options.gameFactory(parameters)
            setGame(newGame)
            setState({
                type: "running",
                state: newGame.state,
            })
            setInitialGame(true)
        }
        setInputQueue([])
    }, parameters)

    useEffect(() => {
        const isClosed = { current: false }
        handleGameInputQueue(isClosed)
        return () => {
            isClosed.current = true
        }
    }, [inputQueue])

    const opOnInput = (input: I) => {
        if (game.isFinalized) {
            console.error("Input on finalized game is UB", { input, game })
        } else {
            setInputQueue([...inputQueue, input])
        }
    }

    return [
        state,
        opOnInput
    ]
}