import { ChaCha20 } from "../crypto/chacha20"
import { sha256 } from "../crypto/sha256"

/**
 * Any RNG, which is able to track it's position and is seedable.
 */
export interface GameRng {
    readonly seed: string

    /**
     * Counter, which never goes back.
     * Along with seed uniquely identifies RNG state.
     */
    readonly position: number

    /**
     * Reads amount of bytes, so that position stored becomes specified position.
     * 
     * Note: for large position values this operation may be slow.
     */
    setPosition: (position: number) => Promise<void>

    /**
     * Reads integer between 0 and 2**32-1 both sides inclusive
     */
    readU32(): Promise<number>
}

const readAndThrowBytes = (rng: ChaCha20, count: number) => {
    while (count > 0) {
        const rd = Math.min(count, 1024 * 4)
        rng.getBytes(rd)

        count -= rd
    }
}

export class ChaCha20GameRng implements GameRng {
    private readonly hashedSeedPromise = sha256(this.seed)
    private rng: ChaCha20 | null = null
    private desiredPosition: number = 0
    private currentPosition: number = 0

    constructor(
        public readonly seed: string,
    ) {
    }

    private getRng = async (): Promise<ChaCha20> => {
        if (this.rng !== null) {
            if (this.desiredPosition === this.currentPosition) {
                return this.rng
            } else if (this.desiredPosition > this.currentPosition) {
                readAndThrowBytes(this.rng, this.desiredPosition - this.currentPosition)
                this.currentPosition = this.desiredPosition

                return this.rng
            }
        }

        this.rng = new ChaCha20(await this.hashedSeedPromise)
        readAndThrowBytes(this.rng, this.desiredPosition)
        this.currentPosition = this.desiredPosition

        return this.rng
    }

    get position(): number {
        return this.currentPosition
    }

    readU32 = async (): Promise<number> => {
        const rng = await this.getRng()
        this.currentPosition += 4
        this.desiredPosition += 4

        return rng.getBytes(4).readUInt32BE()
    }

    setPosition = async (position: number) => {
        this.desiredPosition = position
        await this.getRng()
    }
}