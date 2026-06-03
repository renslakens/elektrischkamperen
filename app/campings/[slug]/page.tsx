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

            {/* Breadcrumb */}
            <nav className="mb-4 text-sm text-gray-500">
                <span>
                    <a href="/campings" className="hover:text-green-700 hover:underline">
                        Campings
                    </a>
                    {camping.land && (
                        <>
                            <span className="mx-2 text-gray-300">/</span>
                            <span className="text-gray-600">{camping.land}</span>
                        </>
                    )}
                </span>
            </nav>

            {/* Header */}
            <div className="mb-6">
                {camping.regio && (
                    <p className="mb-1 text-sm font-medium text-gray-500">
                        {camping.land} — {camping.regio}
                    </p>
                )}
                <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                    {camping.naam}
                </h1>
            </div>

            {/* Foto's */}
            {(camping.afbeeldingen?.length ?? 0) > 0 && (
                <div className="mb-8">
                    <CampingImageGallery afbeeldingen={camping.afbeeldingen!} />
                </div>
            )}

            <div className="grid gap-8 lg:grid-cols-3">

                {/* Hoofdkolom */}
                <div className="space-y-6 lg:col-span-2">

                    {/* EV-laadinfo */}
                    <EVQuickStats
                        aantal_laders={camping.aantal_laders ?? null}
                        laadsnelheid={camping.laadsnelheid ?? null}
                        netwerk={camping.netwerk ?? null}
                        laden_bij_tent={camping.laden_bij_tent ?? null}
                        snellader_in_buurt={camping.snellader_in_buurt ?? null}
                        variant="full"
                    />

                    {/* Redactionele notitie */}
                    {camping.ev_notitie && (
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
                            <p className="mb-2 text-sm font-semibold text-gray-700">
                                Redactionele noot
                            </p>
                            <p className="text-sm leading-relaxed text-gray-700">
                                {camping.ev_notitie}
                            </p>
                        </div>
                    )}

                    {/* Verificatiedatum */}
                    {camping.ev_geverifieerd_op && (
                        <p className="text-xs text-gray-500">
                            Laadinfo geverifieerd op{' '}
                            {new Date(camping.ev_geverifieerd_op).toLocaleDateString('nl-NL', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            })}
                        </p>
                    )}
                </div>

                {/* Sidebar */}
                <aside className="space-y-4 lg:sticky lg:top-8 lg:self-start">
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Prijzen & beschikbaarheid
                        </p>
                        <p className="mb-4 text-lg font-bold text-gray-900">{camping.naam}</p>
                        {camping.affiliate_link ? (
                            <>
                                <AffiliateButton
                                    href={camping.affiliate_link}
                                    campingNaam={camping.naam}
                                />
                                <p className="mt-3 text-center text-xs text-gray-500">
                                    Je verlaat de site via een affiliate link
                                </p>
                            </>
                        ) : (
                            <p className="rounded-lg bg-gray-50 p-3 text-center text-sm text-gray-600">
                                Boekingslink volgt binnenkort
                            </p>
                        )}
                    </div>
                </aside>

            </div>
        </main>
    )
}