type EVQuickStatsProps = {
    aantal_laders: number | null
    laadsnelheid: string | null
    netwerk: string | null
    laden_bij_tent: boolean | null
    snellader_in_buurt: string | null
    variant?: 'full' | 'compact'
}

export function EVQuickStats({
    aantal_laders,
    laadsnelheid,
    netwerk,
    laden_bij_tent,
    snellader_in_buurt,
    variant = 'full',
}: EVQuickStatsProps) {
    if (!aantal_laders && !laadsnelheid) {
        return (
            <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Laadinfo nog niet geverifieerd — check de camping direct voor actuele info.
            </div>
        )
    }

    if (variant === 'compact') {
        return (
            <div className="flex flex-wrap gap-2">
                {aantal_laders && (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                        ⚡ {aantal_laders}x {laadsnelheid ?? '?'}
                    </span>
                )}
                {laden_bij_tent && (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                        Laden bij standplaats
                    </span>
                )}
                {netwerk && (
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                        {netwerk}
                    </span>
                )}
            </div>
        )
    }

    return (
        <div className="rounded-xl border border-green-200 bg-green-50 p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-green-900">
                <span>⚡</span> EV-laadinfo
            </h2>
            <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {aantal_laders && (
                    <div>
                        <dt className="text-xs font-medium uppercase tracking-wide text-green-700">Laadpunten</dt>
                        <dd className="mt-1 text-2xl font-bold text-green-900">{aantal_laders}</dd>
                    </div>
                )}
                {laadsnelheid && (
                    <div>
                        <dt className="text-xs font-medium uppercase tracking-wide text-green-700">Snelheid</dt>
                        <dd className="mt-1 text-2xl font-bold text-green-900">{laadsnelheid}</dd>
                    </div>
                )}
                {netwerk && (
                    <div>
                        <dt className="text-xs font-medium uppercase tracking-wide text-green-700">Netwerk / Pas</dt>
                        <dd className="mt-1 text-sm font-medium text-green-900">{netwerk}</dd>
                    </div>
                )}
                {snellader_in_buurt && (
                    <div className="col-span-2 sm:col-span-3">
                        <dt className="text-xs font-medium uppercase tracking-wide text-green-700">Snellader in de buurt</dt>
                        <dd className="mt-1 text-sm text-green-900">{snellader_in_buurt}</dd>
                    </div>
                )}
            </dl>
            {laden_bij_tent && (
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-green-100 px-4 py-2 text-sm font-medium text-green-800">
                    <span>✓</span> Laden mogelijk bij tent of caravan
                </div>
            )}
        </div>
    )
}