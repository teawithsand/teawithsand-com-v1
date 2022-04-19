import { WordTupleDetails, WordTupleSummary } from "./definitons"


/**
 * Bag, which simplifies analysis of multiple word tuples.
 */
export class WordTuplesBag {
    public readonly sourceWordMap = new Map<string, WordTupleDetails>()
    public readonly sortedTuples: WordTupleSummary[]

    constructor(
        public readonly tuples: WordTupleSummary[],
    ) {
        // TODO(teawithsand): assert that keys match word tuple values
        const sourceWordMap = new Map<string, WordTupleDetails>()

        for (const tuple of tuples) {
            sourceWordMap.set(tuple.sourceWord, tuple)
        }
        this.sourceWordMap = sourceWordMap

        const sortedTuples = [...tuples]

        sortedTuples.sort((a, b) => a.sourceWord.localeCompare(b.sourceWord))
        this.sortedTuples = sortedTuples
    }

    get size() {
        return this.tuples.length
    }
}