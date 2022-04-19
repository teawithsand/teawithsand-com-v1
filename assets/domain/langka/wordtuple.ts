export const parseWordTupleDestinationWords = (destinationWords: string) => destinationWords
    .split("|")
    .filter(w => w.length > 0)

export const serializeWordTupleDestinationWords = (destinationWords: string[]) =>
    destinationWords.join("|")