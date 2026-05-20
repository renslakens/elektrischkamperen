import type { MetadataRoute } from 'next'
import { client } from '../sanity/lib/client'
import { defineQuery } from 'next-sanity'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://elektrischkamperen.nl'

// Slugs ophalen voor alle dynamische routes
const campingSlugsQuery = defineQuery(`*[_type == "camping"]{ "slug": slug.current, _updatedAt }`)
const routeSlugsQuery = defineQuery(`*[_type == "route"]{ "slug": slug.current, _updatedAt }`)
const gidsSlugsQuery = defineQuery(`*[_type == "gids"]{ "slug": slug.current, _updatedAt }`)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [campings, routes, gidsen] = await Promise.all([
        client.fetch<{ slug: string; _updatedAt: string }[]>(campingSlugsQuery),
        client.fetch<{ slug: string; _updatedAt: string }[]>(routeSlugsQuery),
        client.fetch<{ slug: string; _updatedAt: string }[]>(gidsSlugsQuery),
    ])

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

    // Dynamische campingpagina's
    const campingUrls: MetadataRoute.Sitemap = campings.map((c) => ({
        url: `${SITE_URL}/campings/${c.slug}`,
        lastModified: new Date(c._updatedAt),
        changeFrequency: 'weekly',
        priority: 0.7,
    }))

    // Dynamische routepagina's
    const routeUrls: MetadataRoute.Sitemap = routes.map((r) => ({
        url: `${SITE_URL}/routes/${r.slug}`,
        lastModified: new Date(r._updatedAt),
        changeFrequency: 'monthly',
        priority: 0.8,
    }))

    // Dynamische gidspagina's — hoogste prioriteit na homepage
    const gidsUrls: MetadataRoute.Sitemap = gidsen.map((g) => ({
        url: `${SITE_URL}/gidsen/${g.slug}`,
        lastModified: new Date(g._updatedAt),
        changeFrequency: 'monthly',
        priority: 0.9,
    }))

    return [...statisch, ...campingUrls, ...routeUrls, ...gidsUrls]
}