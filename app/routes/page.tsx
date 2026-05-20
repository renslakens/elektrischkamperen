import { sanityFetch } from '@/sanity/lib/fetch'
import { allRoutesQuery } from '@/sanity/queries/routes'
import { maakMetadata } from '@/lib/metadata'
import type { AllRoutesQueryResult } from '@/sanity.types'
import { RouteCard } from '@/components/route/RouteCard'

export const metadata = maakMetadata({
    titel: 'EV-reisroutes door Europa',
    beschrijving: 'Ontdek elektrische reisroutes met campings en laadpunten langs de weg. Voor Tesla, caravan en camper.',
    pad: '/routes',
})

export default async function RoutesPage() {
    const routes = await sanityFetch<AllRoutesQueryResult>({
        query: allRoutesQuery,
        tags: ['route'],
    })

    return (
        <main className="mx-auto max-w-5xl px-4 py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">EV-reisroutes</h1>
                <p className="mt-2 text-gray-500">
                    {routes.length} routes met geverifieerde laadstops en campings
                </p>
            </div>

            {routes.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {routes.map((route) => (
                        <RouteCard key={route._id} route={route} />
                    ))}
                </div>
            ) : (
                <div className="rounded-xl border bg-gray-50 p-12 text-center text-gray-400">
                    De eerste routes komen binnenkort online.
                </div>
            )}
        </main>
    )
}