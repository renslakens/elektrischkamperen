import { client } from './client'
import { type QueryParams } from 'next-sanity'

export async function sanityFetch<T>({
    query,
    params = {},
    tags,
}: {
    query: string
    params?: QueryParams
    tags: string[]
}): Promise<T> {
    return client.fetch<T>(query, params, {
        next: {
            revalidate: false,
            tags,
        },
    })
}