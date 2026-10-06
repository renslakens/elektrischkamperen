import { sanityFetch } from '@/sanity/lib/fetch'
import { allGidsenQuery } from '@/sanity/queries/gidsen'
import { maakMetadata } from '@/lib/metadata'
import type { AllGidsenQueryResult } from '@/sanity.types'
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { vandaag } from '@/lib/utils'

export const metadata = maakMetadata({
    titel: 'EV-reisgidsen — Elektrisch kamperen in Europa',
    beschrijving: 'Uitgebreide gidsen voor elektrisch kamperen. Met campings, laadstops en praktische tips per regio.',
    pad: '/gidsen',
})

export default async function GidsenPage() {
    const gidsen = await sanityFetch<AllGidsenQueryResult>({
        query: allGidsenQuery,
        params: { vandaag: vandaag() },
        tags: ['gids'],
    })

    return (
        <main className="mx-auto max-w-5xl px-4 py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">EV-reisgidsen</h1>
                <p className="mt-2 text-gray-500">
                    Uitgebreide gidsen voor de elektrische kampeerder
                </p>
            </div>

            {gidsen.length > 0 ? (
                <div className="grid gap-8 sm:grid-cols-2">
                    {gidsen.map((gids) => (
                        <Link
                            key={gids._id}
                            href={`/gidsen/${gids.slug?.current}`}
                            className="group flex flex-col rounded-xl border bg-white shadow-sm transition hover:shadow-md"
                        >
                            {/* Hero */}
                            <div className="relative h-52 w-full overflow-hidden rounded-t-xl bg-gray-100">
                                {gids.hero_image?.asset ? (
                                    <Image
                                        src={urlFor(gids.hero_image).width(600).height(208).url()}
                                        alt={gids.titel ?? ''}
                                        fill
                                        className="object-cover transition group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-sm text-gray-300">
                                        Geen foto
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex flex-1 flex-col gap-3 p-5">
                                {gids.land && (
                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                        {gids.land}
                                    </p>
                                )}
                                <h2 className="text-lg font-bold text-gray-900 group-hover:text-green-700">
                                    {gids.titel}
                                </h2>
                                {gids.hook && (
                                    <p className="text-sm text-gray-500 line-clamp-2">{gids.hook}</p>
                                )}

                                {/* Tags */}
                                <div className="mt-auto flex flex-wrap gap-2 pt-2">
                                    {gids.geschikt_voor?.map((tag) => (
                                        <span
                                            key={tag}
                                            className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                    {(gids.aantal_campings ?? 0) > 0 && (
                                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                                            {gids.aantal_campings} campings
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="rounded-xl border bg-gray-50 p-12 text-center text-gray-400">
                    De eerste gidsen komen binnenkort online.
                </div>
            )}
        </main>
    )
}