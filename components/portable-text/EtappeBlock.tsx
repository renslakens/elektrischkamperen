import type { PortableTextComponentProps } from '@portabletext/react'
import type { GidsBySlugQueryResult } from '@/sanity.types'
import { EVQuickStats } from '@/components/camping/EVQuickStats'
import Link from 'next/link'

type BodyBlock = NonNullable<NonNullable<GidsBySlugQueryResult>['body']>[number]
type EtappeBlokValue = Extract<BodyBlock, { _type: 'etappeBlok' }>
type Camping = NonNullable<NonNullable<EtappeBlokValue['campings']>[number]>

export function EtappeBlock({ value }: PortableTextComponentProps<EtappeBlokValue>) {
    const { titel, afstand_km, verwacht_verbruik, laadtip, campings } = value

    return (
        <div className="my-8 rounded-xl border-l-4 border-green-500 bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900">{titel}</h3>
                <div className="mt-1 flex flex-wrap gap-3 text-sm text-gray-500">
                    {afstand_km && <span>{afstand_km} km</span>}
                    {verwacht_verbruik && (
                        <span className="text-amber-600">{verwacht_verbruik}</span>
                    )}
                </div>
            </div>

            {/* Laadtip */}
            {laadtip && (
                <div className="mb-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
                    <span className="font-medium">⚡ Laadtip: </span>{laadtip}
                </div>
            )}

            {/* Campings */}
            {(campings?.length ?? 0) > 0 && (
                <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Campings op deze etappe
                    </p>
                    {campings?.map((camping: Camping) => (
                        <Link
                            key={camping._id}
                            href={`/campings/${camping.slug?.current}`}
                            className="group flex items-center justify-between rounded-lg bg-white p-3 shadow-sm transition hover:shadow-md"
                        >
                            <div>
                                <p className="font-medium text-gray-900 group-hover:text-green-700">
                                    {camping.naam}
                                </p>
                                <EVQuickStats
                                    aantal_laders={camping.aantal_laders ?? null}
                                    laadsnelheid={camping.laadsnelheid ?? null}
                                    netwerk={camping.netwerk ?? null}
                                    laden_bij_tent={camping.laden_bij_tent ?? null}
                                    snellader_in_buurt={null}
                                    variant="compact"
                                />
                            </div>
                            <span className="text-gray-300 group-hover:text-green-500">→</span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}