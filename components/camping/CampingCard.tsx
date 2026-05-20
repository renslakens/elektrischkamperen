import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'
import { EVQuickStats } from './EVQuickStats'
import type { AllCampingsQueryResult } from '@/sanity.types'

type Camping = AllCampingsQueryResult[number]

export function CampingCard({ camping }: { camping: Camping }) {
    return (
        <Link
            href={`/campings/${camping.slug?.current}`}
            className="group flex flex-col rounded-xl border bg-white shadow-sm transition hover:shadow-md"
        >
            {/* Foto */}
            <div className="relative h-44 w-full overflow-hidden rounded-t-xl bg-gray-100">
                {camping.thumbnail?.asset ? (
                    <Image
                        src={urlFor(camping.thumbnail).width(400).height(176).url()}
                        alt={camping.naam ?? ''}
                        fill
                        className="object-cover transition group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-gray-300 text-sm">
                        Geen foto
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col gap-3 p-4">
                <div>
                    {camping.regio && (
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            {camping.land} — {camping.regio}
                        </p>
                    )}
                    <h2 className="font-semibold text-gray-900 group-hover:text-green-700">
                        {camping.naam}
                    </h2>
                </div>

                <EVQuickStats
                    aantal_laders={camping.aantal_laders ?? null}
                    laadsnelheid={camping.laadsnelheid ?? null}
                    netwerk={camping.netwerk ?? null}
                    laden_bij_tent={camping.laden_bij_tent ?? null}
                    snellader_in_buurt={camping.snellader_in_buurt ?? null}
                    variant="compact"
                />
            </div>
        </Link>
    )
}