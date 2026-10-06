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
