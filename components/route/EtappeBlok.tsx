import Link from 'next/link'
import Image from 'next/image'
import { PortableText, PortableTextBlock } from '@portabletext/react'
import { urlFor } from '@/sanity/lib/image'
import { EVQuickStats } from '@/components/camping/EVQuickStats'
import type { RouteBySlugQueryResult } from '@/sanity.types'

type Etappe = NonNullable<NonNullable<RouteBySlugQueryResult>['etappes']>[number]
type Camping = NonNullable<NonNullable<Etappe['campings']>[number]>

export function EtappeBlok({ etappe, index }: { etappe: Etappe; index: number }) {
    return (
        <div className="relative pl-8">
            {/* Tijdlijn */}
            <div className="absolute left-0 top-0 flex h-full flex-col items-center">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
                    {index + 1}
                </div>
                <div className="mt-1 w-px flex-1 bg-green-200" />
            </div>

            {/* Header */}
            <div className="mb-4 pt-0.5">
                <h2 className="text-xl font-bold text-gray-900">{etappe.naam}</h2>
                <div className="mt-1 flex flex-wrap gap-3 text-sm text-gray-500">
                    {etappe.afstand_km && <span>{etappe.afstand_km} km</span>}
                    {etappe.hoogteverschil_m && <span>↑ {etappe.hoogteverschil_m} m</span>}
                    {etappe.extra_verbruik_procent && (
                        <span className="text-amber-600">+{etappe.extra_verbruik_procent}% verbruik</span>
                    )}
                </div>
            </div>

            {/* Rijdtips */}
            {etappe.rijdtips && etappe.rijdtips.length > 0 && (
                <div className="mb-6 rounded-lg bg-blue-50 p-4 text-sm text-blue-800 [&_p]:mb-1">
                    <p className="mb-2 font-medium">Rijdtip</p>
                    <PortableText value={etappe.rijdtips as PortableTextBlock[]} />
                </div>
            )}

            {/* Campings */}
            {(etappe.campings?.length ?? 0) > 0 && (
                <div className="mb-8 space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                        Campings op deze etappe
                    </h3>
                    {etappe.campings?.map((camping) => (
                        <CampingCompact key={camping._id} camping={camping} />
                    ))}
                </div>
            )}
        </div>
    )
}

function CampingCompact({ camping }: { camping: Camping }) {
    return (
        <Link
            href={`/campings/${camping.slug?.current}`}
            className="group flex gap-4 rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md"
        >
            {camping.thumbnail?.asset && (
                <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg">
                    <Image
                        src={urlFor(camping.thumbnail).width(96).height(80).url()}
                        alt={camping.naam ?? ''}
                        fill
                        className="object-cover"
                    />
                </div>
            )}

            <div className="flex flex-1 flex-col gap-2">
                <p className="font-semibold text-gray-900 group-hover:text-green-700">
                    {camping.naam}
                </p>
                <EVQuickStats
                    aantal_laders={camping.aantal_laders ?? null}
                    laadsnelheid={camping.laadsnelheid ?? null}
                    netwerk={camping.netwerk ?? null}
                    laden_bij_tent={camping.laden_bij_tent ?? null}
                    snellader_in_buurt={camping.snellader_in_buurt ?? null}
                    variant="compact"
                />
            </div>

            <span className="shrink-0 self-center text-gray-300 group-hover:text-green-500">→</span>
        </Link>
    )
}