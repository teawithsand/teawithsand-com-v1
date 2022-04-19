import { GameRenderer, GameRendererProps } from "@app/util/game/GameRenderer";
import { NewGame, NewGameHelperCallbacks, useNewGame } from "@app/util/game/NewGame";

export default <S, I, C>(props: {
    gameFactory: () => NewGame<S, I>,
    renderer: GameRenderer<S, I>,

    callbacks?: NewGameHelperCallbacks<S, I>,
}) => {
    const { gameFactory, renderer, callbacks } = props
    const [state, onInput] = useNewGame({
        callbacks: callbacks ?? {},
        gameFactory,
    }, [renderer])

    const rendererProps: GameRendererProps<S, I> = {
        handleInput: onInput,

        state: state.state,
        isFinalized: state.type === "finalized",

        hasError: state.type === "error",
        error: state.type === "error" ? state.error : undefined,

        isComputingNewState: state.type === "computingNewState",
    }

    return renderer(rendererProps)
}