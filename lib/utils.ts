export function landToSlug(land: string): string {
    return land
        .toLowerCase()
        .replace(/\s/g, '-')
        .replace(/ë/g, 'e')
        .replace(/é/g, 'e')
        .replace(/è/g, 'e')
        .replace(/ï/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ü/g, 'u')
}

export function slugToLand(slug: string): string {
    const map: Record<string, string> = {
        'nederland': 'Nederland',
        'belgie': 'België',
        'duitsland': 'Duitsland',
        'frankrijk': 'Frankrijk',
        'italie': 'Italië',
        'spanje': 'Spanje',
        'oostenrijk': 'Oostenrijk',
        'zwitserland': 'Zwitserland',
        'kroatie': 'Kroatië',
    }
    return map[slug] ?? slug.charAt(0).toUpperCase() + slug.slice(1)
}
/** Datum van vandaag (UTC) als YYYY-MM-DD, voor het zichtbaarheidsfilter van gidsen. */
export function vandaag(): string {
    return new Date().toISOString().slice(0, 10)
}

type Locatie = { lat?: number | null; lng?: number | null } | null | undefined

/** Geldige WGS84-coördinaten? Vangt o.a. vergeten decimale punten op (lat 511627). */
export function isGeldigeLocatie(locatie: Locatie): locatie is { lat: number; lng: number } {
    const lat = locatie?.lat
    const lng = locatie?.lng
    return (
        typeof lat === 'number' && typeof lng === 'number' &&
        Number.isFinite(lat) && Number.isFinite(lng) &&
        Math.abs(lat) <= 90 && Math.abs(lng) <= 180 &&
        !(lat === 0 && lng === 0)
    )
}
