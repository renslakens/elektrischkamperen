import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'
import type { AllRoutesQueryResult } from '@/sanity.types'

type Route = AllRoutesQueryResult[number]

export function RouteCard({ route }: { route: Route }) {
    return (
        <Link
            href={`/routes/${route.slug?.current}`}
            className="group flex flex-col rounded-xl border bg-white shadow-sm transition hover:shadow-md"
        >
            {/* Thumbnail */}
            <div className="relative h-44 w-full overflow-hidden rounded-t-xl bg-gray-100">
                {route.thumbnail?.asset ? (
                    <Image
                        src={urlFor(route.thumbnail).width(600).height(176).url()}
                        alt={route.titel ?? ''}
                        fill
                        className="object-cover transition group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-300">
                        Geen foto
                    </div>
                )}
                {route.caravan_geschikt && (
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-gray-700">
                        🚐 Caravan OK
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col gap-3 p-4">
                <div>
                    {(route.landen?.length ?? 0) > 0 && (
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            {route.landen?.join(' · ')}
                        </p>
                    )}
                    <h2 className="font-semibold text-gray-900 group-hover:text-green-700">
                        {route.titel}
                    </h2>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-2 text-xs">
                    {route.totale_km && (
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-600">
                            {route.totale_km} km
                        </span>
                    )}
                    {(route.aantalEtappes ?? 0) > 0 && (
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-600">
                            {route.aantalEtappes} etappe{route.aantalEtappes !== 1 ? 's' : ''}
                        </span>
                    )}
                    {route.heeftLaadpaal && (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-green-700">
                            ⚡ Laadstops
                        </span>
                    )}
                </div>
            </div>
        </Link>
    )
}