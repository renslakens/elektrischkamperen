import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { sanityFetch } from '@/sanity/lib/fetch'
import { campingBySlugQuery, allCampingSlugsQuery } from '@/sanity/queries/campings'
import { EVQuickStats } from '@/components/camping/EVQuickStats'
import { AffiliateButton } from '@/components/camping/AffiliateButton'
import { CampingImageGallery } from '@/components/camping/CampingImageGallery'
import { client } from '../../../sanity/lib/client'
import { CampingBySlugQueryResult } from '@/sanity.types'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
    const campings = await client.fetch<{ slug: string }[]>(allCampingSlugsQuery)
    return campings.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const camping = await sanityFetch<CampingBySlugQueryResult>({
        query: campingBySlugQuery,
        params: { slug },
        tags: ['camping'],
    })
    if (!camping) return {}
    return {
        title: `${camping.naam} — EV-laadinfo & prijzen`,
        description: `Laad je EV op bij ${camping.naam} in ${camping.regio ?? camping.land}. ${camping.aantal_laders ?? 0} laadpunten, ${camping.laadsnelheid ?? 'laadinfo op aanvraag'}.`,
    }
}

export default async function CampingDetailPage({ params }: Props) {
    const { slug } = await params
    const camping = await sanityFetch<CampingBySlugQueryResult>({
        query: campingBySlugQuery,
        params: { slug },
        tags: ['camping'],
    })

    if (!camping) notFound()

    const afbeeldingen = camping.afbeeldingen ?? []

    return (
        <main className="mx-auto max-w-4xl px-4 py-10">

            {/* Header */}
            <div className="mb-6">
                {camping.regio && (
                    <p className="mb-1 text-sm font-medium uppercase tracking-wide text-gray-500">
                        {camping.land} — {camping.regio}
                    </p>
                )}
                <h1 className="text-3xl font-bold text-gray-900">{camping.naam}</h1>
            </div>

            {/* Foto's */}
            {afbeeldingen.length > 0 && (
                <div className="mb-8">
                    <CampingImageGallery afbeeldingen={afbeeldingen} />
                </div>
            )}

            <div className="grid gap-8 lg:grid-cols-3">

                {/* Hoofdkolom */}
                <div className="lg:col-span-2 space-y-8">

                    {/* EV-laadinfo — jouw USP */}
                    <EVQuickStats
                        aantal_laders={camping.aantal_laders}
                        laadsnelheid={camping.laadsnelheid}
                        netwerk={camping.netwerk}
                        laden_bij_tent={camping.laden_bij_tent}
                        snellader_in_buurt={camping.snellader_in_buurt}
                    />

                    {/* Extra notitie */}
                    {camping.ev_notitie && (
                        <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
                            <p className="mb-1 font-medium text-gray-900">Redactionele noot</p>
                            <p>{camping.ev_notitie}</p>
                        </div>
                    )}

                    {/* Verificatiedatum */}
                    {camping.ev_geverifieerd_op && (
                        <p className="text-xs text-gray-400">
                            Laadinfo geverifieerd op{' '}
                            {new Date(camping.ev_geverifieerd_op).toLocaleDateString('nl-NL', {
                                day: 'numeric', month: 'long', year: 'numeric',
                            })}
                        </p>
                    )}
                </div>

                {/* Sidebar — sticky affiliate blok */}
                <aside className="space-y-4 lg:sticky lg:top-8 lg:self-start">
                    <div className="rounded-xl border p-6 shadow-sm">
                        <p className="mb-1 text-sm text-gray-500">Prijzen & beschikbaarheid</p>
                        <p className="mb-4 text-xl font-bold text-gray-900">{camping.naam}</p>
                        {camping.affiliate_link ? (
                            <>
                                <AffiliateButton href={camping.affiliate_link} campingNaam={camping.naam} />
                                <p className="mt-3 text-center text-xs text-gray-400">
                                    Je verlaat de site via een affiliate link
                                </p>
                            </>
                        ) : (
                            <p className="rounded-lg bg-gray-50 p-3 text-center text-sm text-gray-500">
                                Boekingslink volgt binnenkort
                            </p>
                        )}
                    </div>
                </aside>

            </div>
        </main>
    )
}