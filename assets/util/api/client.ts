import { HttpClient } from "../httpClient";

export type ClientFactory<T> = (client: HttpClient) => T

/**
 * Client, which loads something using IDs.
 * Typically, these should be *Details* datas.
 */
export type GetApiClient<I, T> = (id: I) => Promise<T>

export type PostApiClient<I, T> = (data: T) => Promise<I>

export type PutApiClient<I, T> = (id: I, data: T) => Promise<void>

export type DeleteApiClient<I> = (id: I) => Promise<void>

/**
 * Client, which uses pagination.
 * Typically, these should be *Summary* data.s
 */
export type PagingApiClient<T, S> = (i: number, searchData?: S) => Promise<T[]>
