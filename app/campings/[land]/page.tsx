import type { Metadata } from 'next'
import Link from 'next/link'
import { sanityFetch } from '@/sanity/lib/fetch'
import { campingsByLandQuery, allLandenQuery } from '@/sanity/queries/campings'
import { maakMetadata } from '@/lib/metadata'
import { CampingCard } from '@/components/camping/CampingCard'
import { slugToLand, landToSlug } from '@/lib/utils'
import { client } from '../../../sanity/lib/client'
import type { CampingsByLandQueryResult } from '@/sanity.types'

type Props = { params: Promise<{ land: string }> }

export async function generateStaticParams() {
    const result = await client.fetch<{ land: string }[]>(allLandenQuery)
    const landen = [...new Set(result.map((r) => r.land).filter(Boolean))]
    return landen.map((land) => ({ land: landToSlug(land) }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { land } = await params
    const landNaam = slugToLand(land)
    return maakMetadata({
        titel: `Campings met laadpaal in ${landNaam}`,
        beschrijving: `Vind campings met laadpaal in ${landNaam}. Geverifieerde EV-laadinfo per camping — aantal laadpunten, laadvermogen en of laden bij je standplaats mogelijk is.`,
        pad: `/campings/${land}`,
    })
}

export default async function LandPage({ params }: Props) {
    const { land } = await params
    const landNaam = slugToLand(land)

    const campings = await sanityFetch<CampingsByLandQueryResult>({
        query: campingsByLandQuery,
        params: { land: landNaam },
        tags: ['camping'],
    })

    return (
        <main className="mx-auto max-w-5xl px-4 py-10">

            {/* Breadcrumb */}
            <nav className="mb-4 text-sm text-gray-500">
                <Link href="/campings" className="hover:text-green-700 hover:underline">
                    Campings
                </Link>
                <span className="mx-2 text-gray-300">/</span>
                <span className="text-gray-700">{landNaam}</span>
            </nav>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Campings met laadpaal in {landNaam}
                </h1>
                <p className="mt-2 text-gray-500">
                    {campings.length} camping{campings.length !== 1 ? 's' : ''} met
                    geverifieerde EV-laadinfo in {landNaam}
                </p>
            </div>

            {/* Intro tekst — SEO */}
            <div className="mb-8 rounded-xl border border-gray-100 bg-gray-50 p-6 text-sm leading-relaxed text-gray-600">
                <p>
                    Op zoek naar een camping met laadpaal in {landNaam}? Wij belden alle
                    campings persoonlijk op en controleerden de laadmogelijkheden ter
                    plaatse. Zo weet je zeker hoeveel laadpunten er zijn, wat het
                    vermogen is en of je caravan of camper naast de laadpaal past.
                </p>
            </div>

            {/* Grid */}
            {campings.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {campings.map((camping) => (
                        <CampingCard key={camping._id} camping={camping} />
                    ))}
                </div>
            ) : (
                <div className="rounded-xl border bg-gray-50 p-12 text-center text-gray-400">
                    Nog geen campings in {landNaam} — binnenkort meer.
                </div>
            )}

            {/* Interne links naar andere landen */}
            <div className="mt-12 border-t pt-8">
                <p className="mb-4 text-sm font-semibold text-gray-500">
                    Campings met laadpaal in andere landen
                </p>
                <div className="flex flex-wrap gap-2">
                    {[
                        'Nederland', 'België', 'Duitsland', 'Frankrijk',
                        'Italië', 'Spanje', 'Oostenrijk', 'Zwitserland', 'Kroatië',
                    ]
                        .filter((l) => l !== landNaam)
                        .map((l) => (
                            <Link
                                key={l}
                                href={`/campings/${landToSlug(l)}`}
                                className="rounded-full border px-4 py-1.5 text-sm text-gray-600 transition hover:border-green-500 hover:text-green-700"
                            >
                                {l}
                            </Link>
                        ))}
                </div>
            </div>

        </main>
    )
}