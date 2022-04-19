import { HttpClient } from "../httpClient";
import { assertIdValid } from "../id";
import { ClientFactory, DeleteApiClient, GetApiClient, PagingApiClient, PostApiClient, PutApiClient } from "./client";

export class ApiClientBuilder<I extends string, T, S = void> {
    constructor(
        private readonly options: {
            path: string,
            // TODO(teawithsand): implement error handler
            errorHandler?: (e: any) => void,
        }
    ) {
    }

    withPath = (path: string): ApiClientBuilder<I, T, S> => new ApiClientBuilder(
        {
            ...this.options,
            path,
        }
    )

    withErrorHandler = (errorHandler: (e: any) => void,): ApiClientBuilder<I, T, S> => new ApiClientBuilder(
        {
            ...this.options,
            errorHandler,
        }
    )


    withDataType = <E>(): ApiClientBuilder<I, E, SVGAnimatedBoolean> => new ApiClientBuilder(
        { ...this.options, }
    )

    withIdType = <E extends string>(): ApiClientBuilder<E, T, S> => new ApiClientBuilder(
        { ...this.options, }
    )

    withSearchType = <E>(): ApiClientBuilder<I, T, E> => new ApiClientBuilder(
        { ...this.options, }
    )

    private makePathNoArgument = (): string => {
        return this.options.path
    }
    private makePathWithId = (id: string): string => {
        assertIdValid(id)

        return this.options.path.replace("{id}", id)
    }

    private makePathWithPage = (page: number, searchParams: any): string => {

        const serialize = function (obj: any) {
            let str = [];
            for (const p in obj) {
                if (obj.hasOwnProperty(p)) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]))
                }
            }
            return str.join("&")
        }

        page += 1

        if (typeof searchParams === "object" && searchParams !== null) {
            searchParams.page = page
        } else {
            searchParams = { page }
        }

        if (typeof searchParams?.id === "string") {
            return this.makePathWithId(searchParams.id) + `?${serialize(searchParams)}`
        } else {
            return this.options.path + `?${serialize(searchParams)}`
        }
    }

    makePostClient = (client: HttpClient): PostApiClient<I, T> => async (data: T): Promise<I> => {
        const res = await client.post(
            this.makePathNoArgument(),
            data
        )
        if (typeof res.data === "string") {
            if (!/^[a-zA-Z0-9]+$/.test(res.data)) {
                // TODO(teawithsand): throw here
            }
            return res.data as I
        }
        return (res.data ?? {}).id
    }

    makePutClient = (client: HttpClient): PutApiClient<I, T> => async (id: I, data: T): Promise<void> => {
        await client.put(
            this.makePathWithId(id),
            data
        )
    }

    makeDeleteClient = (client: HttpClient): DeleteApiClient<I> => async (id: I): Promise<void> => {
        await client.delete(
            this.makePathWithId(id)
        )
    }

    makeGetClient = (client: HttpClient): GetApiClient<I, T> => async (id: I): Promise<T> => {
        const res = await client.get(this.makePathWithId(id))
        return res.data
    }

    makeGetPagingClient = (client: HttpClient): PagingApiClient<T, S> => async (page: number, searchData: S): Promise<T[]> => {
        const res = await client.get(this.makePathWithPage(page, searchData))
        return res.data
    }


    makePostClientFactory = (): ClientFactory<PostApiClient<I, T>> => (client: HttpClient) => this.makePostClient(client)
    makePutClientFactory = (): ClientFactory<PutApiClient<I, T>> => (client: HttpClient) => this.makePutClient(client)
    makeDeleteClientFactory = (): ClientFactory<DeleteApiClient<I>> => (client: HttpClient) => this.makeDeleteClient(client)
    makeGetClientFactory = (): ClientFactory<GetApiClient<I, T>> => (client: HttpClient) => this.makeGetClient(client)
    makeGetPagingClientFactory = (): ClientFactory<PagingApiClient<T, S>> => (client: HttpClient) => this.makeGetPagingClient(client)
}