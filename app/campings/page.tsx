import { Suspense } from 'react'
import { sanityFetch } from '@/sanity/lib/fetch'
import { allCampingsQuery } from '@/sanity/queries/campings'
import { maakMetadata } from '@/lib/metadata'
import { CampingsClient } from '@/components/camping/CampingsClient'
import type { AllCampingsQueryResult } from '@/sanity.types'

export const metadata = maakMetadata({
    titel: 'Campings met laadpaal in Europa',
    beschrijving: 'Vind campings met EV-laadpunten. Filter op land, laadsnelheid en laden bij je standplaats.',
    pad: '/campings',
})

export default async function CampingsPage() {
    const campings = await sanityFetch<AllCampingsQueryResult>({
        query: allCampingsQuery,
        tags: ['camping'],
    })

    return (
        <main className="mx-auto max-w-7xl px-4 py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Campings met laadpaal</h1>
                <p className="mt-2 text-gray-500">
                    {campings.length} campings met geverifieerde EV-laadinfo
                </p>
            </div>
            <Suspense fallback={<div className="text-gray-400">Laden...</div>}>
                <CampingsClient campings={campings} />
            </Suspense>
        </main>
    )
}