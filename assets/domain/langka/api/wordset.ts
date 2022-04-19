
import { ApiClientBuilder } from "@app/util/api/clientBuilder";
import { HttpClient } from "@app/util/httpClient";
import { WordSetId, WordSetPublicDetails, WordSetPublicSummary, WordSetSecretDetails, WordSetSecretSummary, WordTupleId, WordTupleSummary } from "../definitons";

const baseBuilder = new ApiClientBuilder({
    path: "",
})

export interface WordSetCreateData {
    title: string,
    sourceLanguage: string,
    destinationLanguage: string,
    description: string
}

export interface WordTupleCreateData {
    sourceWord: string,
    destinationWords: string,
    wordSet: WordSetId,
    description: string,
}

export interface WordTupleEditData {
    sourceWord: string,
    destinationWords: string,
    description: string,
}

export interface WordSetsSearchData {
    title?: string,
    "owner.publicName"?: string | string[],
    "order[lifecycle.createdAt]"?: "asc" | "desc",
    "order[title]"?: "asc" | "desc",
}


export interface WordTuplesSearchData {
    id: WordSetId
}

export const makeWordSetClient = (client: HttpClient) => {
    const baseWordSetBuilder = baseBuilder.withIdType<WordSetId>()
    return {
        getWordSetsSummary: baseWordSetBuilder
            .withPath("/api/v1/langka/word-sets/")
            .withDataType<WordSetPublicSummary>()
            .withSearchType<WordSetsSearchData>()
            .makeGetPagingClient(client),

        getOwnWordSetsSummary: baseWordSetBuilder
            .withPath("/api/v1/langka/word-sets/owned")
            .withDataType<WordSetSecretSummary>()
            .withSearchType<WordSetsSearchData>()
            .makeGetPagingClient(client),

        getWordSetPublicDetails: baseWordSetBuilder
            .withPath("/api/v1/langka/word-sets/{id}")
            .withDataType<WordSetPublicDetails>()
            .makeGetClient(client),

        getWordSetSecretDetails: baseWordSetBuilder
            .withPath("/api/v1/langka/word-sets/{id}/details")
            .withDataType<WordSetSecretDetails>()
            .makeGetClient(client),

        postWordSet: baseWordSetBuilder
            .withPath("/api/v1/langka/word-sets")
            .withDataType<WordSetCreateData>()
            .makePostClient(client),

        putWordSet: baseWordSetBuilder
            .withPath("/api/v1/langka/word-sets/{id}")
            .withDataType<WordSetCreateData>()
            .makePutClient(client),

        deleteWordSet: baseWordSetBuilder
            .withPath("/api/v1/langka/word-sets/{id}")
            .makeDeleteClient(client),

        publishWordSet: baseWordSetBuilder
            .withPath("/api/v1/langka/word-set/{id}/publish")
            .withDataType<{
                isPublished: boolean,
            }>()
            .makePutClient(client),

        getWordSetWordTuplesSummary: baseWordSetBuilder
            .withPath("/api/v1/langka/word-set/{id}/tuples")
            .withDataType<WordTupleSummary>()
            .withIdType<WordTupleId>()
            .withSearchType<WordTuplesSearchData>()
            .makeGetPagingClient(client),

        postWordTuple: baseWordSetBuilder
            .withPath("/api/v1/langka/word-set/word-tuples")
            .withDataType<WordTupleCreateData>()
            .withIdType<WordTupleId>()
            .makePostClient(client),

        putWordTuple: baseWordSetBuilder
            .withPath("/api/v1/langka/word-set/word-tuples/{id}")
            .withDataType<WordTupleEditData>()
            .withIdType<WordTupleId>()
            .makePutClient(client),

        deleteWordTuple: baseWordSetBuilder
            .withPath("/api/v1/langka/word-set/word-tuples/{id}")
            .withIdType<WordTupleId>()
            .makeDeleteClient(client),
    }
}