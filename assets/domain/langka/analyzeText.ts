export interface WordStatistics {
    word: string
    count: number
}

export interface TextAnalysisResult {
    words: Map<string, WordStatistics>,
}

export const textAnalysisResult = (
    options: {
        text: string,
    }
): TextAnalysisResult => {
    const { text } = options

    const m = new Map();

    const words = text.split(/\s+/)

    // required, so same words are next to each other
    words.sort()

    let currentWord = null
    let count = 0
    for (const word of words) {
        if (currentWord === null) {
            currentWord = word
            count = 1
        } else if (currentWord === word) {
            count += 1
        } else {
            m.set(currentWord, {
                word: currentWord,
                count: count,
            })
            count = 1
            currentWord = word
        }
    }

    if (currentWord !== null && count > 0) {
        m.set(currentWord, {
            word: currentWord,
            count: count,
        })
    }

    return {
        words: m,
    }
}