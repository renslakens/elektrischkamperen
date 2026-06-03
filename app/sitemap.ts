import type { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'
import { defineQuery } from 'next-sanity'
import { landToSlug } from '@/lib/utils'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://elektrischkamperen.nl'

const campingSlugsQuery = defineQuery(`
  *[_type == "camping"]{ "slug": slug.current, "land": land, _updatedAt }
`)
const routeSlugsQuery = defineQuery(`
  *[_type == "route"]{ "slug": slug.current, _updatedAt }
`)
const gidsSlugsQuery = defineQuery(`
  *[_type == "gids"]{ "slug": slug.current, _updatedAt }
`)
const landenQuery = defineQuery(`
  *[_type == "camping" && defined(land)]{ "land": land }
`)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [campings, routes, gidsen, landenRaw] = await Promise.all([
        client.fetch<{ slug: string; land: string | null; _updatedAt: string }[]>(campingSlugsQuery),
        client.fetch<{ slug: string; _updatedAt: string }[]>(routeSlugsQuery),
        client.fetch<{ slug: string; _updatedAt: string }[]>(gidsSlugsQuery),
        client.fetch<{ land: string }[]>(landenQuery),
    ])

    // Unieke landen
    const landen = [...new Set(landenRaw.map((r) => r.land).filter(Boolean))] as string[]

    // Statische pagina's
    const statisch: MetadataRoute.Sitemap = [
        {
            url: SITE_URL,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${SITE_URL}/campings`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${SITE_URL}/routes`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${SITE_URL}/gidsen`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
    ]

    // Landpagina's
    const landUrls: MetadataRoute.Sitemap = landen.map((land) => ({
        url: `${SITE_URL}/campings/${landToSlug(land)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.85,
    }))

    // Campingdetailpagina's
    const campingUrls: MetadataRoute.Sitemap = campings.map((c) => ({
        url: `${SITE_URL}/campings/${c.land ? landToSlug(c.land) : 'overig'}/${c.slug}`,
        lastModified: new Date(c._updatedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }))

    // Routepagina's
    const routeUrls: MetadataRoute.Sitemap = routes.map((r) => ({
        url: `${SITE_URL}/routes/${r.slug}`,
        lastModified: new Date(r._updatedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }))

    // Gidspagina's
    const gidsUrls: MetadataRoute.Sitemap = gidsen.map((g) => ({
        url: `${SITE_URL}/gidsen/${g.slug}`,
        lastModified: new Date(g._updatedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.9,
    }))

    return [...statisch, ...landUrls, ...campingUrls, ...routeUrls, ...gidsUrls]
}