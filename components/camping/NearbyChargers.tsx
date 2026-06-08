'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import type { LaadpaalInBuurt } from '@/types/laadpaal'

const ChargersMap = dynamic(
    () => import('./ChargersMap').then((m) => m.ChargersMap),
    {
        ssr: false, loading: () => (
            <div className="h-64 animate-pulse rounded-xl bg-gray-100" />
        )
    }
)

type Props = {
    lat: number
    lng: number
    campingNaam: string
}

export function NearbyChargers({ lat, lng, campingNaam }: Props) {
    const [laadpalen, setLaadpalen] = useState<LaadpaalInBuurt[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        fetch(`/api/laadpalen?lat=${lat}&lng=${lng}&radius=10`)
            .then((r) => r.json())
            .then((data) => {
                setLaadpalen(Array.isArray(data) ? data : [])
                setLoading(false)
            })
            .catch(() => {
                setError(true)
                setLoading(false)
            })
    }, [lat, lng])

    if (loading) {
        return (
            <div className="space-y-3">
                <div className="h-6 w-48 animate-pulse rounded bg-gray-200" />
                <div className="h-64 animate-pulse rounded-xl bg-gray-200" />
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 animate-pulse rounded-lg bg-gray-200" />
                ))}
            </div>
        )
    }

    if (error) {
        return (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                Laadpalen in de buurt konden niet worden opgehaald.
            </div>
        )
    }

    const snelladers = laadpalen.filter((l) => l.is_snellader)
    const acLaders = laadpalen.filter((l) => !l.is_snellader)

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">
                Publieke laadpalen in de buurt
            </h2>

            <ChargersMap
                laadpalen={laadpalen}
                campingLat={lat}
                campingLng={lng}
                campingNaam={campingNaam}
            />

            {snelladers.length > 0 && (
                <div>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                        ⚡ Snelladers (50kW+)
                    </h3>
                    <div className="space-y-2">
                        {snelladers.map((l) => (
                            <ChargerRow key={l.id} laadpaal={l} />
                        ))}
                    </div>
                </div>
            )}

            {acLaders.length > 0 && (
                <div>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                        Reguliere laadpalen
                    </h3>
                    <div className="space-y-2">
                        {acLaders.map((l) => (
                            <ChargerRow key={l.id} laadpaal={l} />
                        ))}
                    </div>
                </div>
            )}

            {laadpalen.length === 0 && (
                <p className="text-sm text-gray-500">
                    Geen publieke laadpalen gevonden binnen 10 km.
                </p>
            )}

            <p className="text-xs text-gray-400">
                Databron: OpenChargeMap · Wordt dagelijks bijgewerkt
            </p>
        </div>
    )
}

function ChargerRow({ laadpaal }: { laadpaal: LaadpaalInBuurt }) {
    return (
        <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex-1">
                <p className="font-medium text-gray-900">{laadpaal.naam}</p>
                <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-500">
                    <span>{laadpaal.netwerk}</span>
                    {laadpaal.connector_types.slice(0, 2).map((type) => (
                        <span key={type} className="rounded-full bg-gray-100 px-2 py-0.5">
                            {type}
                        </span>
                    ))}
                    {laadpaal.aantal_punten && (
                        <span>{laadpaal.aantal_punten} punt{laadpaal.aantal_punten !== 1 ? 'en' : ''}</span>
                    )}
                </div>
            </div>
            <div className="ml-4 shrink-0 text-right">
                {laadpaal.max_kw && (
                    <p className={`text-lg font-bold ${laadpaal.is_snellader ? 'text-green-600' : 'text-gray-700'}`}>
                        {laadpaal.max_kw} kW
                    </p>
                )}
                {laadpaal.afstand_km && (
                    <p className="text-xs text-gray-400">{laadpaal.afstand_km} km</p>
                )}
            </div>
        </div>
    )
}