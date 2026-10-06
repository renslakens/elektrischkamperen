import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { sanityFetch } from '@/sanity/lib/fetch'
import { campingBySlugQuery, allCampingSlugsQuery } from '@/sanity/queries/campings'
import { maakMetadata } from '@/lib/metadata'
import { EVQuickStats } from '@/components/camping/EVQuickStats'
import { AffiliateButton } from '@/components/camping/AffiliateButton'
import { CampingImageGallery } from '@/components/camping/CampingImageGallery'
import { NearbyChargers } from '@/components/camping/NearbyChargers'
import { urlFor } from '@/sanity/lib/image'
import { slugToLand, landToSlug, isGeldigeLocatie } from '@/lib/utils'
import { breadcrumbJsonLd, campingJsonLd, faqJsonLd, JsonLd } from '@/lib/structured-data'
import { client } from '../../../../sanity/lib/client'
import type { CampingBySlugQueryResult } from '@/sanity.types'
import Link from 'next/link'

type Props = { params: Promise<{ land: string; slug: string }> }

export async function generateStaticParams() {
    const campings = await client.fetch<{ slug: string; land: string | null }[]>(
        allCampingSlugsQuery
    )
    return campings.map((c) => ({
        land: c.land ? landToSlug(c.land) : 'overig',
        slug: c.slug,
    }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const camping = await sanityFetch<CampingBySlugQueryResult>({
        query: campingBySlugQuery,
        params: { slug },
        tags: ['camping'],
    })
    if (!camping) return {}
    return maakMetadata({
        titel: `${camping.naam} — EV-laadinfo & prijzen`,
        beschrijving: `Laad je EV op bij ${camping.naam} in ${camping.regio ?? camping.land}. ${camping.aantal_laders ?? 0} laadpunten, ${camping.laadsnelheid ?? 'laadinfo op aanvraag'}.`,
        pad: `/campings/${camping.land ? landToSlug(camping.land) : 'overig'}/${slug}`,
        type: 'article',
    })
}

export default async function CampingDetailPage({ params }: Props) {
    const { slug, land } = await params
    const camping = await sanityFetch<CampingBySlugQueryResult>({
        query: campingBySlugQuery,
        params: { slug },
        tags: ['camping'],
    })

    if (!camping) notFound()

    const landNaam = slugToLand(land)

    const breadcrumb = breadcrumbJsonLd([
        { naam: 'Campings', href: '/campings' },
        { naam: landNaam, href: `/campings/${land}` },
        { naam: camping.naam ?? '', href: `/campings/${land}/${slug}` },
    ])

    const faqItems = [
        {
            vraag: `Heeft ${camping.naam} een laadpaal?`,
            antwoord: camping.aantal_laders
                ? `Ja, ${camping.naam} heeft ${camping.aantal_laders} laadpunt${camping.aantal_laders !== 1 ? 'en' : ''} van ${camping.laadsnelheid ?? 'onbekend vermogen'}.`
                : `Neem contact op met ${camping.naam} voor actuele laadmogelijkheden.`,
        },
        {
            vraag: `Welk laadnetwerk gebruikt ${camping.naam}?`,
            antwoord: camping.netwerk
                ? `${camping.naam} maakt gebruik van ${camping.netwerk}.`
                : `Neem contact op met de camping voor informatie over het laadnetwerk.`,
        },
        {
            vraag: `Kan ik laden bij mijn standplaats op ${camping.naam}?`,
            antwoord: camping.laden_bij_tent
                ? `Ja, op ${camping.naam} is het mogelijk om te laden bij je tent of caravan.`
                : `Op ${camping.naam} zijn de laadpunten op een centrale locatie.`,
        },
        ...(camping.snellader_in_buurt ? [{
            vraag: `Is er een snellader in de buurt van ${camping.naam}?`,
            antwoord: `Ja, in de buurt van ${camping.naam} is een snellader: ${camping.snellader_in_buurt}.`,
        }] : []),
    ]

    return (
        <>
            <JsonLd data={breadcrumbJsonLd([
                { naam: 'Campings', href: '/campings' },
                { naam: landNaam, href: `/campings/${land}` },
                { naam: camping.naam ?? '', href: `/campings/${land}/${slug}` },
            ])} />
            <JsonLd data={campingJsonLd({
                naam: camping.naam ?? '',
                slug,
                land: camping.land ?? null,
                regio: camping.regio ?? null,
                lat: isGeldigeLocatie(camping.locatie) ? camping.locatie.lat : null,
                lng: isGeldigeLocatie(camping.locatie) ? camping.locatie.lng : null,
                afbeelding: camping.afbeeldingen?.[0]?.asset
                    ? urlFor(camping.afbeeldingen[0]).width(1200).url()
                    : null,
                aantalLaders: camping.aantal_laders ?? null,
                laadsnelheid: camping.laadsnelheid ?? null,
                netwerk: camping.netwerk ?? null,
                ladenBijTent: camping.laden_bij_tent ?? null,
            })} />
            <JsonLd data={faqJsonLd(faqItems)} />

            <main className="mx-auto max-w-4xl px-4 py-10">

                {/* Breadcrumb */}
                <nav className="mb-4 text-sm text-gray-500">
                    <Link href="/campings" className="hover:text-green-700 hover:underline">
                        Campings
                    </Link>
                    <span className="mx-2 text-gray-300">/</span>
                    <Link
                        href={`/campings/${land}`}
                        className="hover:text-green-700 hover:underline"
                    >
                        {landNaam}
                    </Link>
                    <span className="mx-2 text-gray-300">/</span>
                    <span className="text-gray-700">{camping.naam}</span>
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
                    <div className="space-y-6 lg:col-span-2">
                        <div className="space-y-6 lg:col-span-2">
                            <EVQuickStats
                                aantal_laders={camping.aantal_laders ?? null}
                                laadsnelheid={camping.laadsnelheid ?? null}
                                netwerk={camping.netwerk ?? null}
                                laden_bij_tent={camping.laden_bij_tent ?? null}
                                snellader_in_buurt={camping.snellader_in_buurt ?? null}
                                variant="full"
                            />

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

                            {/* OpenChargeMap integratie — alleen tonen als locatie bekend en geldig is */}
                            {isGeldigeLocatie(camping.locatie) && (
                                <NearbyChargers
                                    lat={camping.locatie.lat}
                                    lng={camping.locatie.lng}
                                    campingNaam={camping.naam ?? ''}
                                />
                            )}
                        </div>

                        {camping.ev_geverifieerd_op && (
                            <p className="text-xs text-gray-500">
                                Laadinfo geverifieerd op{' '}
                                {new Date(camping.ev_geverifieerd_op).toLocaleDateString('nl-NL', {
                                    day: 'numeric', month: 'long', year: 'numeric',
                                })}
                            </p>
                        )}
                    </div>

                    <aside className="space-y-4 lg:sticky lg:top-8 lg:self-start">
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Prijzen & beschikbaarheid
                            </p>
                            <p className="mb-4 text-lg font-bold text-gray-900">
                                {camping.naam}
                            </p>
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
                <section className="mt-10 border-t pt-8">
                    <h2 className="mb-4 text-xl font-bold text-gray-900">
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
                                    <span className="ml-4 shrink-0 text-gray-400 transition group-open:rotate-180">
                                        ↓
                                    </span>
                                </summary>
                                <div className="border-t border-gray-100 px-5 py-4 text-sm text-gray-600">
                                    {item.antwoord}
                                </div>
                            </details>
                        ))}
                    </div>
                </section>
            </main>
        </>
    )
}