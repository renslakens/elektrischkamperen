import type { Metadata } from 'next'
import Link from 'next/link'
import { sanityFetch } from '@/sanity/lib/fetch'
import { campingsByLandQuery, allLandenQuery } from '@/sanity/queries/campings'
import { maakMetadata } from '@/lib/metadata'
import { CampingCard } from '@/components/camping/CampingCard'
import { slugToLand, landToSlug } from '@/lib/utils'
import { breadcrumbJsonLd, faqJsonLd, JsonLd } from '@/lib/structured-data'
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

    const breadcrumb = breadcrumbJsonLd([
        { naam: 'Campings', href: '/campings' },
        { naam: landNaam, href: `/campings/${land}` },
    ])

    const faqItems = [
        {
            vraag: `Zijn er campings met laadpaal in ${landNaam}?`,
            antwoord: `Ja, er zijn ${campings.length} campings met geverifieerde EV-laadinfo in ${landNaam} op ElektrischKamperen.nl.`,
        },
        {
            vraag: `Hoe snel kan ik laden op een camping in ${landNaam}?`,
            antwoord: `De meeste campings in ${landNaam} bieden Type 2 laadpunten van 11 kW. Sommige campings hebben 22 kW of hogere vermogens beschikbaar.`,
        },
        {
            vraag: `Kan ik mijn caravan laden op een camping in ${landNaam}?`,
            antwoord: `Een deel van de campings in ${landNaam} heeft laadpunten bij de standplaats. Dit staat per camping aangegeven op de detailpagina.`,
        },
    ]
    return (
        <>
            <JsonLd data={breadcrumbJsonLd([
                { naam: 'Campings', href: '/campings' },
                { naam: landNaam, href: `/campings/${land}` },
            ])} />
            <JsonLd data={faqJsonLd(faqItems)} />

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

                {/* FAQ sectie */}
                <div className="mt-12 border-t pt-8">
                    <h2 className="mb-6 text-xl font-bold text-gray-900">
                        Veelgestelde vragen
                    </h2>
                    <div className="space-y-3">
                        {faqItems.map((item) => (
                            <details
                                key={item.vraag}
                                className="group rounded-lg border border-gray-200 bg-white"
                            >
                                <summary className="flex cursor-pointer items-center justify-between px-5 py-4 font-medium text-gray-900 marker:hidden">
                                    {item.vraag}
                                    <span className="ml-4 shrink-0 text-gray-400 transition group-open:rotate-180">↓</span>
                                </summary>
                                <div className="border-t border-gray-100 px-5 py-4 text-sm text-gray-600">
                                    {item.antwoord}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </main>
        </>
    )
}