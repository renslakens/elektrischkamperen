import { sanityFetch } from '@/sanity/lib/fetch'
import { allGidsenQuery } from '@/sanity/queries/gidsen'
import { maakMetadata } from '@/lib/metadata'
import type { AllGidsenQueryResult } from '@/sanity.types'
import { GidsCard } from '@/components/gids/GidsCard'
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
                        <GidsCard key={gids._id} gids={gids} />
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