// Validatie van het aanmeldformulier voor campings. Gedeeld door het formulier (client)
// en /api/camping-aanmelding (server). De server vertrouwt de client niet en valideert opnieuw.

import { LANDEN, LAADSNELHEDEN } from './camping-opties'

export type AanmeldingVeld =
    | 'campingnaam' | 'plaats' | 'land' | 'aantal_laders' | 'vermogen'
    | 'netwerk' | 'contactpersoon' | 'email' | 'opmerking' | 'akkoord_privacy'

export type Aanmelding = {
    campingnaam: string
    plaats: string
    land: (typeof LANDEN)[number]
    aantal_laders: number
    vermogen: (typeof LAADSNELHEDEN)[number]
    netwerk: string
    contactpersoon: string
    email: string
    opmerking: string
    akkoord_privacy: true
}

export type Fouten = Partial<Record<AanmeldingVeld, string>>

export type ValidatieResultaat =
    | { geldig: true; data: Aanmelding }
    | { geldig: false; fouten: Fouten }

export const MAX_LENGTE = {
    campingnaam: 120,
    plaats: 100,
    netwerk: 100,
    contactpersoon: 100,
    email: 254,
    opmerking: 2000,
} as const

export const MAX_LADERS = 500

// Bewust eenvoudig: één @, geen spaties, een punt in het domein.
const EMAIL_PATROON = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function tekst(waarde: unknown): string {
    return typeof waarde === 'string' ? waarde.normalize('NFC').trim() : ''
}

function controleerTekst(
    waarde: string,
    { verplicht, min, max, label }: { verplicht: boolean; min: number; max: number; label: string },
): string | undefined {
    if (!waarde) return verplicht ? `Vul ${label} in.` : undefined
    if (waarde.length < min) return `${capitaliseer(label)} is te kort (minimaal ${min} tekens).`
    if (waarde.length > max) return `${capitaliseer(label)} is te lang (maximaal ${max} tekens).`
    return undefined
}

function capitaliseer(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1)
}

function isLand(waarde: string): waarde is Aanmelding['land'] {
    return (LANDEN as readonly string[]).includes(waarde)
}

function isVermogen(waarde: string): waarde is Aanmelding['vermogen'] {
    return (LAADSNELHEDEN as readonly string[]).includes(waarde)
}

function leesAantal(waarde: unknown): number {
    if (typeof waarde === 'number') return waarde
    if (typeof waarde === 'string' && /^\d+$/.test(waarde.trim())) return Number(waarde.trim())
    return Number.NaN
}

export function valideerAanmelding(invoer: unknown): ValidatieResultaat {
    const bron = (typeof invoer === 'object' && invoer !== null ? invoer : {}) as Record<string, unknown>

    const campingnaam = tekst(bron.campingnaam)
    const plaats = tekst(bron.plaats)
    const land = tekst(bron.land)
    const vermogen = tekst(bron.vermogen)
    const netwerk = tekst(bron.netwerk)
    const contactpersoon = tekst(bron.contactpersoon)
    const email = tekst(bron.email).toLowerCase()
    const opmerking = tekst(bron.opmerking)
    const aantalLaders = leesAantal(bron.aantal_laders)

    const fouten: Fouten = {
        campingnaam: controleerTekst(campingnaam, { verplicht: true, min: 2, max: MAX_LENGTE.campingnaam, label: 'de naam van de camping' }),
        plaats: controleerTekst(plaats, { verplicht: true, min: 2, max: MAX_LENGTE.plaats, label: 'de plaats' }),
        land: !land ? 'Kies een land.' : !isLand(land) ? 'Kies een land uit de lijst.' : undefined,
        aantal_laders: !Number.isInteger(aantalLaders)
            ? 'Vul het aantal laadpunten in als heel getal.'
            : aantalLaders < 1 || aantalLaders > MAX_LADERS
                ? `Het aantal laadpunten moet tussen 1 en ${MAX_LADERS} liggen.`
                : undefined,
        vermogen: !vermogen ? 'Kies het vermogen van de laadpunten.' : !isVermogen(vermogen) ? 'Kies een vermogen uit de lijst.' : undefined,
        netwerk: controleerTekst(netwerk, { verplicht: false, min: 2, max: MAX_LENGTE.netwerk, label: 'het netwerk' }),
        contactpersoon: controleerTekst(contactpersoon, { verplicht: true, min: 2, max: MAX_LENGTE.contactpersoon, label: 'de naam van de contactpersoon' }),
        email: !email
            ? 'Vul een e-mailadres in.'
            : email.length > MAX_LENGTE.email || !EMAIL_PATROON.test(email)
                ? 'Vul een geldig e-mailadres in, bijvoorbeeld naam@camping.nl.'
                : undefined,
        opmerking: opmerking.length > MAX_LENGTE.opmerking
            ? `De opmerking is te lang (maximaal ${MAX_LENGTE.opmerking} tekens).`
            : undefined,
        akkoord_privacy: bron.akkoord_privacy === true ? undefined : 'Ga akkoord met de privacyverklaring om je aanmelding te versturen.',
    }

    const gevondenFouten = Object.fromEntries(
        Object.entries(fouten).filter(([, melding]) => melding !== undefined),
    ) as Fouten

    if (Object.keys(gevondenFouten).length > 0 || !isLand(land) || !isVermogen(vermogen)) {
        return { geldig: false, fouten: gevondenFouten }
    }

    return {
        geldig: true,
        data: {
            campingnaam, plaats, land, aantal_laders: aantalLaders, vermogen,
            netwerk, contactpersoon, email, opmerking, akkoord_privacy: true,
        },
    }
}
