'use client'

export type FilterState = {
    land: string
    minKw: number | null
    ladenBijStandplaats: boolean
}

type Props = {
    landen: string[]
    filters: FilterState
    onChange: (filters: FilterState) => void
}

const KW_OPTIES = [
    { label: 'Alle snelheden', value: null },
    { label: 'Minimaal 3,7 kW', value: 3.7 },
    { label: 'Minimaal 11 kW', value: 11 },
    { label: 'Minimaal 22 kW', value: 22 },
    { label: 'Minimaal 50 kW', value: 50 },
]

export function CampingFilters({ landen, filters, onChange }: Props) {
    return (
        <div className="flex flex-wrap gap-3 rounded-xl border bg-white p-4 shadow-sm">

            {/* Land */}
            <div className="flex flex-col gap-1">
                <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Land
                </label>
                <select
                    value={filters.land}
                    onChange={(e) => onChange({ ...filters, land: e.target.value })}
                    className="rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    <option value="">Alle landen</option>
                    {landen.map((l) => (
                        <option key={l} value={l}>{l}</option>
                    ))}
                </select>
            </div>

            {/* Min kW */}
            <div className="flex flex-col gap-1">
                <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Laadsnelheid
                </label>
                <select
                    value={filters.minKw ?? ''}
                    onChange={(e) =>
                        onChange({ ...filters, minKw: e.target.value ? Number(e.target.value) : null })
                    }
                    className="rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    {KW_OPTIES.map((o) => (
                        <option key={o.label} value={o.value ?? ''}>{o.label}</option>
                    ))}
                </select>
            </div>

            {/* Laden bij standplaats */}
            <div className="flex flex-col gap-1">
                <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Laden bij standplaats
                </label>
                <button
                    onClick={() => onChange({ ...filters, ladenBijStandplaats: !filters.ladenBijStandplaats })}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${filters.ladenBijStandplaats
                        ? 'border-green-600 bg-green-600 text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-green-400'
                        }`}
                >
                    {filters.ladenBijStandplaats ? '✓ Aan' : 'Toon alle'}
                </button>
            </div>

            {/* Reset */}
            {(filters.land || filters.minKw || filters.ladenBijStandplaats) && (
                <div className="flex items-end">
                    <button
                        onClick={() => onChange({ land: '', minKw: null, ladenBijStandplaats: false })}
                        className="rounded-lg px-3 py-2 text-sm text-gray-400 hover:text-gray-700"
                    >
                        Filters wissen
                    </button>
                </div>
            )}
        </div>
    )
}