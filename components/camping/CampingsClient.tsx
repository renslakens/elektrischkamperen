'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import type { AllCampingsQueryResult } from '@/sanity.types'
import { CampingFilters, type FilterState } from './CampingFilters'
import { CampingCard } from './CampingCard'

const CampingMap = dynamic(
    () => import('./CampingMap').then((m) => m.CampingMap),
    {
        ssr: false,
        loading: () => (
            <div className="flex h-full items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-400">
                Kaart laden...
            </div>
        ),
    }
)

function parseKw(laadsnelheid: string | null): number {
    if (!laadsnelheid) return 0
    const match = laadsnelheid.match(/[\d,]+/)
    if (!match) return 0
    return parseFloat(match[0].replace(',', '.'))
}

type Props = { campings: AllCampingsQueryResult }

export function CampingsClient({ campings }: Props) {
    const searchParams = useSearchParams()

    const [filters, setFilters] = useState<FilterState>({
        land: searchParams.get('land') ?? '',
        minKw: searchParams.get('minKw') ? Number(searchParams.get('minKw')) : null,
        ladenBijStandplaats: searchParams.get('laden') === 'true',
    })
    const [zoekterm, setZoekterm] = useState(searchParams.get('q') ?? '')
    const [activeCampingId, setActiveCampingId] = useState<string | null>(null)

    const landen = useMemo(
        () => [...new Set(campings.map((c) => c.land).filter(Boolean))].sort() as string[],
        [campings]
    )

    const gefilterd = useMemo(() => {
        return campings.filter((c) => {
            if (filters.land && c.land !== filters.land) return false
            if (filters.minKw && parseKw(c.laadsnelheid) < filters.minKw) return false
            if (filters.ladenBijStandplaats && !c.laden_bij_tent) return false
            if (zoekterm) {
                const term = zoekterm.toLowerCase()
                const matchNaam = c.naam?.toLowerCase().includes(term)
                const matchRegio = c.regio?.toLowerCase().includes(term)
                const matchLand = c.land?.toLowerCase().includes(term)
                if (!matchNaam && !matchRegio && !matchLand) return false
            }
            return true
        })
    }, [campings, filters, zoekterm])

    return (
        <div className="flex flex-col gap-4">
            <CampingFilters
                landen={landen}
                filters={filters}
                onChange={setFilters}
            />

            <p className="text-sm text-gray-500">
                {gefilterd.length} camping{gefilterd.length !== 1 ? 's' : ''} gevonden
            </p>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    {gefilterd.length > 0 ? (
                        gefilterd.map((camping) => (
                            <div
                                key={camping._id}
                                className={`transition-all ${activeCampingId === camping._id ? 'ring-2 ring-green-500 rounded-xl' : ''
                                    }`}
                                onMouseEnter={() => setActiveCampingId(camping._id)}
                                onMouseLeave={() => setActiveCampingId(null)}
                            >
                                <CampingCard camping={camping} />
                            </div>
                        ))
                    ) : (
                        <div className="col-span-2 rounded-xl border bg-gray-50 p-8 text-center text-gray-500">
                            Geen campings gevonden met deze filters.
                        </div>
                    )}
                </div>

                <div className="hidden lg:block">
                    <div className="sticky top-8 h-[calc(100vh-8rem)]">
                        <CampingMap
                            campings={gefilterd}
                            activeCampingId={activeCampingId}
                            onHover={setActiveCampingId}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}