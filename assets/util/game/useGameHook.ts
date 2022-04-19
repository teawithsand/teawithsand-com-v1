import { useCallback, useRef, useState } from "react";
import { BaseGameConfig, BaseGameState, GameInitData, GameInput, StatelessGameManager } from "./game";

export type StatelessGameHookInitializer<C extends BaseGameConfig, S extends BaseGameState, I extends GameInput, D extends GameInitData> = {
    initDataFactory: (config: C) => D,
    gameManagerFactory: () => StatelessGameManager<C, S, I, D>,
}

export type UseGameResult<C extends BaseGameConfig, S extends BaseGameState, I extends GameInput, D extends GameInitData> = {
    type: "initializing",

    input?: undefined,
    previousState?: undefined,
    onInput?: undefined,
    state?: undefined,
} | {
    type: "pending",
    state: S,
    onInput: (input: I) => void

    input?: undefined,
    previousState?: undefined,
} | {
    type: "finished",
    state: S,

    input?: undefined,
    previousState?: undefined,
    onInput?: undefined,
} | {
    type: "computingNextState",
    previousState: S,
    input: I,

    state?: undefined,
    onInput?: undefined,
}

/**
 * Helper hook, which simplifies running games.
 * 
 * @deprecated use new game instead
 */
export const useStatelessGame = <
    C extends BaseGameConfig,
    S extends BaseGameState,
    I extends GameInput,
    D extends GameInitData
>(
    config: C,
    initializer: StatelessGameHookInitializer<C, S, I, D>,
): UseGameResult<C, S, I, D> => {
    const gameManagerRef = useRef<StatelessGameManager<C, S, I, D>>(null)
    if (gameManagerRef === null) {
        gameManagerRef.current = initializer.gameManagerFactory()
    }

    const [gameState, setGameState] = useState<S | null>(null)
    const [isComputingNextState, setIsComputingNextState] = useState<null | { input: I }>(null)
    if (gameState === null) {
        gameManagerRef.current.computeInitialState(
            config,
            initializer.initDataFactory(config),
        )
    }

    const onInput = useCallback((input: I) => {
        (async () => {
            setIsComputingNextState({ input })
            try {
                const newState = await gameManagerRef.current.computeNextGameState(
                    config,
                    gameState,
                    input,
                )
                setGameState(newState)
            } finally {
                setIsComputingNextState(null)
            }
        })()
    }, [config, gameState])


    if (gameState === null) {
        return {
            type: "initializing"
        }
    } else if (gameState.status === "finished") {
        return {
            type: "finished",
            state: gameState,
        }
    } else if (isComputingNextState) {
        return {
            type: "computingNextState",
            previousState: gameState,
            input: isComputingNextState.input,
        }
    } else {
        return {
            type: "pending",
            onInput,
            state: gameState,
        }
    }
}