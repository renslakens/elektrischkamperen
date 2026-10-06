import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { sanityFetch } from '@/sanity/lib/fetch'
import { gidsBySlugQuery, allGidsSlugsQuery } from '@/sanity/queries/gidsen'
import { maakMetadata } from '@/lib/metadata'
import { portableTextComponents } from '@/components/portable-text'
import { urlFor } from '@/sanity/lib/image'
import { breadcrumbJsonLd, articleJsonLd, JsonLd } from '@/lib/structured-data'
import { client } from '../../../sanity/lib/client'
import type { GidsBySlugQueryResult } from '@/sanity.types'
import { vandaag } from '@/lib/utils'

type Props = { params: Promise<{ slug: string }> }

// Slugs die niet bij de build bestonden (of toen nog een toekomstige datum hadden) worden
// op aanvraag gerenderd. Zo werkt een ingeplande gids op de dag zelf zonder nieuwe deployment.
export const dynamicParams = true

export async function generateStaticParams() {
    const gidsen = await client.fetch<{ slug: string }[]>(allGidsSlugsQuery, { vandaag: vandaag() })
    return gidsen.map((g) => ({ slug: g.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const gids = await sanityFetch<GidsBySlugQueryResult>({
        query: gidsBySlugQuery,
        params: { slug, vandaag: vandaag() },
        tags: ['gids'],
    })
    if (!gids) return {}
    return maakMetadata({
        titel: gids.seo_titel ?? gids.titel ?? '',
        beschrijving: gids.seo_beschrijving ?? gids.hook ?? undefined,
        pad: `/gidsen/${slug}`,
        type: 'article',
        afbeelding: gids.hero_image?.asset
            ? urlFor(gids.hero_image).width(1200).height(630).url()
            : undefined,
    })
}

export default async function GidsDetailPage({ params }: Props) {
    const { slug } = await params
    const gids = await sanityFetch<GidsBySlugQueryResult>({
        query: gidsBySlugQuery,
        params: { slug, vandaag: vandaag() },
        tags: ['gids', 'camping'],
    })

    if (!gids) notFound()

    return (
        <>
            <JsonLd data={breadcrumbJsonLd([
                { naam: 'Gidsen', href: '/gidsen' },
                { naam: gids.titel ?? '', href: `/gidsen/${slug}` },
            ])} />
            <JsonLd data={articleJsonLd({
                titel: gids.titel ?? '',
                beschrijving: gids.seo_beschrijving ?? gids.hook ?? null,
                slug,
                afbeelding: gids.hero_image?.asset
                    ? urlFor(gids.hero_image).width(1200).url()
                    : null,
                gepubliceerdOp: gids.gepubliceerd_op ?? null,
            })} />

            <main className="mx-auto max-w-3xl px-4 py-10">

                {/* Header */}
                <div className="mb-6">
                    {gids.land && (
                        <p className="mb-1 text-sm font-medium uppercase tracking-wide text-gray-400">
                            {gids.land}
                        </p>
                    )}
                    <h1 className="text-3xl font-bold text-gray-900">{gids.titel}</h1>

                    {/* Tags */}
                    {(gids.geschikt_voor?.length ?? 0) > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {gids.geschikt_voor?.map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Hero */}
                {gids.hero_image?.asset && (
                    <div className="relative mb-8 h-64 w-full overflow-hidden rounded-xl sm:h-80">
                        <Image
                            src={urlFor(gids.hero_image).width(900).height(400).url()}
                            alt={gids.titel ?? ''}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}

                {/* Hook */}
                {gids.hook && (
                    <p className="mb-8 text-lg leading-relaxed text-gray-600">{gids.hook}</p>
                )}

                {/* Portable Text body */}
                {gids.body && (
                    <div className="prose prose-gray max-w-none prose-headings:font-bold prose-a:text-green-700">
                        <PortableText
                            value={gids.body}
                            components={portableTextComponents}
                        />
                    </div>
                )}

                {/* Publicatiedatum */}
                {gids.gepubliceerd_op && (
                    <p className="mt-12 text-xs text-gray-400">
                        Gepubliceerd op{' '}
                        {new Date(gids.gepubliceerd_op).toLocaleDateString('nl-NL', {
                            day: 'numeric', month: 'long', year: 'numeric',
                        })}
                    </p>
                )}

            </main>
        </>
    )
}