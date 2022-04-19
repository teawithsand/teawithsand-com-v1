export interface BaseGameConfig { }

/**
 * @deprecated Use new game instead
 */
export type GameStateStatus = "pending" | "finished"

/**
 * Note: implementors of this interface must be immutable.
 * 
 * Idea behind the state is that it's immutable object.
 * 
 * @deprecated Use new game instead
 */
export interface BaseGameState {
    readonly status: GameStateStatus
}

/**
 * Game consists of game state and config.
 * 
 * @deprecated Use new game instead
 */
export type Game<C extends BaseGameConfig, S extends BaseGameState> = {
    gameConfig: C,
    gameState: S,
}

/**
 * Any input capable of changing game state.
 * 
 * @deprecated Use new game instead
 */
export interface GameInput {
}
/**
 * @deprecated Use new game instead
 */
export interface GameInitData { }

/**
 * Note: in some sense this component is simmilar to redux combined with reducer with special constant part called config,
 * current state supplied externally and actions being called input.
 * 
 * @deprecated Use new game instead
 */
export interface StatelessGameManager<C extends BaseGameConfig, S extends BaseGameState, I extends GameInput, D extends GameInitData> {
    computeInitialState(gameConfig: C, initData: D): Promise<S>
    computeNextGameState(gameConfig: C, currentGameState: S, input: I): Promise<S>
}

/**
 * Base error for all game-associated stuff.
 * 
 * @deprecated Do not use special class for game errors, since it's not clear how to handle these.
 */
export class GameError extends Error { }