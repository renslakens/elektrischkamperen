import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import { sanityFetch } from '@/sanity/lib/fetch'
import { routeBySlugQuery, allRouteSlugsQuery } from '@/sanity/queries/routes'
import { maakMetadata } from '@/lib/metadata'
import { EtappeBlok } from '@/components/route/EtappeBlok'
import { urlFor } from '@/sanity/lib/image'
import { client } from '../../../sanity/lib/client'
import type { RouteBySlugQueryResult } from '@/sanity.types'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
    const routes = await client.fetch<{ slug: string }[]>(allRouteSlugsQuery)
    return routes.map((r) => ({ slug: r.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const route = await sanityFetch<RouteBySlugQueryResult>({
        query: routeBySlugQuery,
        params: { slug },
        tags: ['route'],
    })
    if (!route) return {}
    return maakMetadata({
        titel: route.seo_titel ?? route.titel ?? '',
        beschrijving: route.seo_beschrijving ?? undefined,
        pad: `/routes/${slug}`,
        type: 'article',
        afbeelding: route.thumbnail?.asset
            ? urlFor(route.thumbnail).width(1200).height(630).url()
            : undefined,
    })
}

export default async function RouteDetailPage({ params }: Props) {
    const { slug } = await params
    const route = await sanityFetch<RouteBySlugQueryResult>({
        query: routeBySlugQuery,
        params: { slug },
        tags: ['route', 'etappe', 'camping'],
    })

    if (!route) notFound()

    return (
        <main className="mx-auto max-w-3xl px-4 py-10">

            {/* Header */}
            <div className="mb-6">
                {(route.landen?.length ?? 0) > 0 && (
                    <p className="mb-1 text-sm font-medium uppercase tracking-wide text-gray-400">
                        {route.landen?.join(' · ')}
                    </p>
                )}
                <h1 className="text-3xl font-bold text-gray-900">{route.titel}</h1>

                {/* Route stats */}
                <div className="mt-3 flex flex-wrap gap-3">
                    {route.totale_km && (
                        <span className="rounded-full bg-gray-100 px-4 py-1.5 text-sm text-gray-600">
                            {route.totale_km} km totaal
                        </span>
                    )}
                    {(route.etappes?.length ?? 0) > 0 && (
                        <span className="rounded-full bg-gray-100 px-4 py-1.5 text-sm text-gray-600">
                            {route.etappes?.length} etappe{route.etappes?.length !== 1 ? 's' : ''}
                        </span>
                    )}
                    {route.caravan_geschikt && (
                        <span className="rounded-full bg-amber-100 px-4 py-1.5 text-sm text-amber-700">
                            🚐 Caravan geschikt
                        </span>
                    )}
                </div>
            </div>

            {/* Hero */}
            {route.thumbnail?.asset && (
                <div className="relative mb-8 h-64 w-full overflow-hidden rounded-xl sm:h-80">
                    <Image
                        src={urlFor(route.thumbnail).width(900).height(400).url()}
                        alt={route.titel ?? ''}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            )}

            {/* Beschrijving */}
            {route.beschrijving && (
                <div className="prose prose-gray mb-10 max-w-none">
                    {route.beschrijving
                        .filter((b): b is typeof b & { _type: 'block' } => b._type === 'block')
                        .map((block, i) => (
                            <p key={i}>
                                {block.children
                                    ?.filter((c): c is typeof c & { text: string } => 'text' in c)
                                    .map((c) => c.text)
                                    .join('')}
                            </p>
                        ))}
                </div>
            )}

            {/* Etappes */}
            {route.etappes && route.etappes.length > 0 && (
                <section>
                    <h2 className="mb-6 text-2xl font-bold text-gray-900">De route</h2>
                    <div className="space-y-10">
                        {route.etappes.map((etappe, i) => (
                            <EtappeBlok key={etappe._id} etappe={etappe} index={i} />
                        ))}
                    </div>
                </section>
            )}

        </main>
    )
}