import { Suspense } from 'react'
import Link from 'next/link'
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

            <aside className="mt-12 flex flex-col gap-4 rounded-xl border bg-green-50 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="font-semibold text-gray-900">Laadpaal op jouw camping?</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Meld je camping aan. Wij controleren de laadinfo en zetten hem daarna op de site.
                    </p>
                </div>
                <Link
                    href="/campings/aanmelden"
                    className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-800"
                >
                    Camping aanmelden
                </Link>
            </aside>
        </main>
    )
}