import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import type { AllGidsenQueryResult } from '@/sanity.types'

type Gids = Pick<
    AllGidsenQueryResult[number],
    '_id' | 'titel' | 'slug' | 'hook' | 'hero_image' | 'land' | 'geschikt_voor' | 'aantal_campings'
>

// kop: h2 op /gidsen (direct onder de h1), h3 in een homepage-sectie met eigen h2
export function GidsCard({ gids, kop = 'h2' }: { gids: Gids; kop?: 'h2' | 'h3' }) {
    const Kop = kop
    return (
        <Link
            href={`/gidsen/${gids.slug?.current}`}
            className="group flex flex-col rounded-xl border bg-white shadow-sm transition hover:shadow-md"
        >
            {/* Hero */}
            <div className="relative h-52 w-full overflow-hidden rounded-t-xl bg-gray-100">
                {gids.hero_image?.asset ? (
                    <Image
                        src={urlFor(gids.hero_image).width(600).height(208).url()}
                        alt={gids.titel ?? ''}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-green-50 to-teal-50 text-3xl">
                        <span aria-hidden="true">⚡</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col gap-3 p-5">
                {gids.land && (
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        {gids.land}
                    </p>
                )}
                <Kop className="text-lg font-bold text-gray-900 group-hover:text-green-700">
                    {gids.titel}
                </Kop>
                {gids.hook && (
                    <p className="text-sm text-gray-500 line-clamp-2">{gids.hook}</p>
                )}

                {/* Tags */}
                <div className="mt-auto flex flex-wrap gap-2 pt-2">
                    {gids.geschikt_voor?.map((tag) => (
                        <span
                            key={tag}
                            className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600"
                        >
                            {tag}
                        </span>
                    ))}
                    {(gids.aantal_campings ?? 0) > 0 && (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                            {gids.aantal_campings} camping{gids.aantal_campings === 1 ? '' : 's'}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    )
}
