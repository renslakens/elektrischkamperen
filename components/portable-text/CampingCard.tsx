import Link from 'next/link'
import Image from 'next/image'
import type { PortableTextComponentProps } from '@portabletext/react'
import { urlFor } from '@/sanity/lib/image'
import { landToSlug } from '@/lib/utils'
import { EVQuickStats } from '@/components/camping/EVQuickStats'
import type { GidsBySlugQueryResult } from '@/sanity.types'

// Type afleiden uit de gegenereerde query
type BodyBlock = NonNullable<NonNullable<GidsBySlugQueryResult>['body']>[number]
type CampingCardValue = Extract<BodyBlock, { _type: 'campingCard' }>

export function CampingCard({ value }: PortableTextComponentProps<CampingCardValue>) {
    const { camping, redactionele_review, cta_tekst } = value
    if (!camping) return null

    return (
        <div className="my-8 overflow-hidden rounded-xl border bg-white shadow-sm">
            {/* Foto */}
            {camping.afbeeldingen?.[0]?.asset && (
                <div className="relative h-48 w-full">
                    <Image
                        src={urlFor(camping.afbeeldingen[0]).width(800).height(192).url()}
                        alt={camping.naam ?? ''}
                        fill
                        className="object-cover"
                    />
                </div>
            )}

            <div className="p-6">
                {/* Naam */}
                <h3 className="mb-3 text-xl font-bold text-gray-900">{camping.naam}</h3>

                {/* EV stats */}
                <EVQuickStats
                    aantal_laders={camping.aantal_laders ?? null}
                    laadsnelheid={camping.laadsnelheid ?? null}
                    netwerk={camping.netwerk ?? null}
                    laden_bij_tent={camping.laden_bij_tent ?? null}
                    snellader_in_buurt={camping.snellader_in_buurt ?? null}
                    variant="full"
                />

                {/* Redactionele review */}
                {redactionele_review && (
                    <p className="mt-4 text-gray-600">{redactionele_review}</p>
                )}

                {/* CTA */}
                <div className="mt-6 flex gap-3">
                    {camping.affiliate_link && (
                        <a
                            href={camping.affiliate_link}
                            target="_blank"
                            rel="noopener noreferrer sponsored"
                            className="flex-1 rounded-xl bg-green-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-green-700"
                        >
                            {cta_tekst ?? 'Check prijzen & beschikbaarheid'} →
                        </a>
                    )}
                    <Link
                        href={`/campings/${camping.land ? landToSlug(camping.land) : 'overig'}/${camping.slug?.current}`}
                        className="rounded-xl border px-6 py-3 text-center text-sm font-medium text-gray-600 transition hover:border-green-500 hover:text-green-700"
                    >
                        Meer info
                    </Link>
                </div>
            </div>
        </div>
    )
}