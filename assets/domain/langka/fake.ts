import { generateRandomWord } from "@app/util/fakedata"
import { WordSetId, WordTupleDetails, WordTupleId } from "./definitons"
import { WordTuplesBag } from "./wordset"

export const makeRandomWordTupleBag = (size: number) => {
    const usedSourceWords = new Set

    const tuples: WordTupleDetails[] = []
    for (let i = 0; i < size; i++) {
        let sourceWord = generateRandomWord()
        const destinationWord = generateRandomWord()

        while (usedSourceWords.has(sourceWord)) {
            sourceWord = generateRandomWord()
        }
        usedSourceWords.add(sourceWord)

        tuples.push({
            id: `${i}` as WordTupleId,
            description: "",
            destinationWords: destinationWord,
            sourceWord,
            wordSet: `${i * 8 + 2}` as WordSetId,
        })
    }

    return new WordTuplesBag(tuples)
}