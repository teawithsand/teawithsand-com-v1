import { ProfileReferenceSummary } from "../user/definitions";

export type WordSetId = string & { readonly symbol: unique symbol }
export type WordTupleId = string & { readonly symbol: unique symbol }

export interface WordSetPublicLifecycle {
    createdAt: string,
}

export interface WordSetSecretLifecycle extends WordSetPublicLifecycle {
    publishedAt: string | null,
}

export interface WordSetPublicSummary {
    id: WordSetId,
    owner: ProfileReferenceSummary,

    title: string,

    lifecycle: WordSetPublicLifecycle,

    sourceLanguage: string,
    destinationLanguage: string,
}

export interface WordSetSecretSummary extends WordSetPublicSummary {
    lifecycle: WordSetSecretLifecycle,
}


export interface WordSetPublicDetails extends WordSetPublicSummary {
    description: string,
    wordTuples: WordTupleDetails[],
}

export interface WordSetSecretDetails extends WordSetPublicDetails {
    lifecycle: WordSetSecretLifecycle,
}

export interface WordTupleSummary {
    id: WordTupleId,
    sourceWord: string,
    destinationWords: string,
    wordSet: WordSetId,
    description: string,
}

export type WordTupleDetails = WordTupleSummary