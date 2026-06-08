import { ReactElement } from 'react'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL
const SITE_NAAM = 'ElektrischKamperen.nl'

// ── BreadcrumbList ──
type BreadcrumbItem = { naam: string; href: string }

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: item.naam,
            item: `${SITE_URL}${item.href}`,
        })),
    }
}

// ── Campground ──
type CampingStructuredDataProps = {
    naam: string
    slug: string
    land: string | null
    regio: string | null
    lat: number | null
    lng: number | null
    afbeelding: string | null
    aantalLaders: number | null
    laadsnelheid: string | null
    netwerk: string | null
    ladenBijTent: boolean | null
}

export function campingJsonLd({
    naam,
    slug,
    land,
    regio,
    lat,
    lng,
    afbeelding,
    aantalLaders,
    laadsnelheid,
    netwerk,
    ladenBijTent,
}: CampingStructuredDataProps) {
    const landSlug = land
        ? land.toLowerCase()
            .replace(/\s/g, '-')
            .replace(/ë/g, 'e')
            .replace(/é/g, 'e')
            .replace(/ï/g, 'i')
        : 'overig'

    return {
        '@context': 'https://schema.org',
        '@type': 'Campground',
        name: naam,
        url: `${SITE_URL}/campings/${landSlug}/${slug}`,
        ...(afbeelding && { image: afbeelding }),
        ...(regio && land && {
            description: `Camping met laadpaal in ${regio}, ${land}. Geverifieerde EV-laadinfo door ${SITE_NAAM}.`,
        }),
        ...(lat && lng && {
            geo: {
                '@type': 'GeoCoordinates',
                latitude: lat,
                longitude: lng,
            },
            hasMap: `https://www.google.com/maps?q=${lat},${lng}`,
        }),
        amenityFeature: [
            {
                '@type': 'LocationFeatureSpecification',
                name: 'Laadpaal voor elektrische auto',
                value: true,
            },
            ...(aantalLaders ? [{
                '@type': 'LocationFeatureSpecification',
                name: 'Aantal laadpunten',
                value: String(aantalLaders),
            }] : []),
            ...(laadsnelheid ? [{
                '@type': 'LocationFeatureSpecification',
                name: 'Laadvermogen',
                value: laadsnelheid,
            }] : []),
            ...(netwerk ? [{
                '@type': 'LocationFeatureSpecification',
                name: 'Laadnetwerk',
                value: netwerk,
            }] : []),
            ...(ladenBijTent !== null ? [{
                '@type': 'LocationFeatureSpecification',
                name: 'Laden bij standplaats',
                value: ladenBijTent ? 'Ja' : 'Nee',
            }] : []),
        ],
    }
}

// ── FAQPage ──
type FAQItem = { vraag: string; antwoord: string }

export function faqJsonLd(items: FAQItem[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((item) => ({
            '@type': 'Question',
            name: item.vraag,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.antwoord,
            },
        })),
    }
}

// ── WebSite
export function websiteJsonLd() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAAM,
        url: SITE_URL,
        description: 'Campings met laadpaal in Europa. Geverifieerde EV-laadinfo, reisroutes en reisgidsen voor de elektrische kampeerder.',
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${SITE_URL}/campings?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    }
}

// ── Article
type ArticleStructuredDataProps = {
    titel: string
    beschrijving: string | null
    slug: string
    afbeelding: string | null
    gepubliceerdOp: string | null
}

export function articleJsonLd({
    titel,
    beschrijving,
    slug,
    afbeelding,
    gepubliceerdOp,
}: ArticleStructuredDataProps) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: titel,
        ...(beschrijving && { description: beschrijving }),
        url: `${SITE_URL}/gidsen/${slug}`,
        ...(afbeelding && { image: afbeelding }),
        ...(gepubliceerdOp && { datePublished: gepubliceerdOp }),
        author: {
            '@type': 'Organization',
            name: SITE_NAAM,
            url: SITE_URL,
        },
        publisher: {
            '@type': 'Organization',
            name: SITE_NAAM,
            url: SITE_URL,
        },
    }
}

// ── Helper
export function JsonLd({ data }: { data: object }): ReactElement {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }
            }
        />
    )
}