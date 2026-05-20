import type { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://elektrischkamperen.nl'
const SITE_NAAM = 'Elektrisch Kamperen'
const SITE_BESCHRIJVING = 'De beste campings met EV-laadpunten in Europa. Geverifieerde laadinfo, reisroutes en gidsen voor de elektrische kampeerder.'

type MetadataOptions = {
    titel: string
    beschrijving?: string
    pad?: string          // bijv. '/campings/les-tourterelles'
    afbeelding?: string   // absolute URL naar OG-afbeelding
    type?: 'website' | 'article'
}

export function maakMetadata({
    titel,
    beschrijving,
    pad = '',
    afbeelding,
    type = 'website',
}: MetadataOptions): Metadata {
    const url = `${SITE_URL}${pad}`
    const omschrijving = beschrijving ?? SITE_BESCHRIJVING

    return {
        title: {
            default: titel,
            template: `%s — ${SITE_NAAM}`,
        },
        description: omschrijving,
        metadataBase: new URL(SITE_URL),
        alternates: {
            canonical: url,
        },
        openGraph: {
            title: titel,
            description: omschrijving,
            url,
            siteName: SITE_NAAM,
            type,
            ...(afbeelding && {
                images: [{ url: afbeelding, width: 1200, height: 630 }],
            }),
        },
        twitter: {
            card: 'summary_large_image',
            title: titel,
            description: omschrijving,
            ...(afbeelding && { images: [afbeelding] }),
        },
    }
}