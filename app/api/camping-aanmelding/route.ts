import { randomUUID } from 'node:crypto'
import { type NextRequest, NextResponse } from 'next/server'
import { maakWriteClient } from '@/sanity/lib/write-client'
import { valideerAanmelding, type Fouten } from '@/lib/aanmelding'
import { maakRateLimiter } from '@/lib/rate-limit'

// Ontvangt aanmeldingen van /campings/aanmelden en zet ze als DRAFT in Sanity:
// - drafts.camping-aanmelding-<id>: camping met opgegeven laadinfo, zonder contactgegevens en
//   zonder verificatiedatum (de eigenaar verifieert zelf en publiceert in Studio)
// - drafts.aanmelding-<id>: contactgegevens en opmerking; wordt nooit gepubliceerd
// Er wordt hier nooit iets gepubliceerd.

const MAX_BODY_BYTES = 10_000
const magDoor = maakRateLimiter({ max: 5, vensterMs: 60 * 60 * 1000 })

type Antwoord = { success: boolean; error: string | null; fouten?: Fouten }

function antwoord(body: Antwoord, status: number) {
    return NextResponse.json(body, { status })
}

function clientIp(req: NextRequest): string {
    const doorgestuurd = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    return doorgestuurd || req.headers.get('x-real-ip') || 'onbekend'
}

function maakSlug(naam: string): string {
    return naam
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80)
}

export async function POST(req: NextRequest) {
    if (!magDoor(clientIp(req))) {
        return antwoord({ success: false, error: 'Te veel aanmeldingen vanaf dit adres. Probeer het over een uur opnieuw.' }, 429)
    }

    const ruw = await req.text()
    if (ruw.length > MAX_BODY_BYTES) {
        return antwoord({ success: false, error: 'De aanmelding is te groot.' }, 413)
    }

    let invoer: unknown
    try {
        invoer = JSON.parse(ruw)
    } catch {
        return antwoord({ success: false, error: 'Ongeldige aanvraag.' }, 400)
    }

    // Honeypot: een veld dat mensen niet zien. Gevuld = bot. Doe alsof het gelukt is.
    const honeypot = (typeof invoer === 'object' && invoer !== null)
        ? (invoer as Record<string, unknown>).website
        : undefined
    if (typeof honeypot === 'string' && honeypot.trim() !== '') {
        return antwoord({ success: true, error: null }, 200)
    }

    const resultaat = valideerAanmelding(invoer)
    if (!resultaat.geldig) {
        return antwoord({ success: false, error: 'Controleer de gemarkeerde velden.', fouten: resultaat.fouten }, 400)
    }
    const aanmelding = resultaat.data

    const id = randomUUID()
    const campingId = `camping-aanmelding-${id}`

    try {
        await maakWriteClient()
            .transaction()
            .create({
                _id: `drafts.${campingId}`,
                _type: 'camping',
                naam: aanmelding.campingnaam,
                slug: { _type: 'slug', current: maakSlug(aanmelding.campingnaam) || campingId },
                land: aanmelding.land,
                aantal_laders: aanmelding.aantal_laders,
                laadsnelheid: aanmelding.vermogen,
                ...(aanmelding.netwerk ? { netwerk: aanmelding.netwerk } : {}),
                featured: false,
            })
            .create({
                _id: `drafts.aanmelding-${id}`,
                _type: 'aanmelding',
                camping: { _type: 'reference', _ref: campingId, _weak: true },
                campingnaam: aanmelding.campingnaam,
                plaats: aanmelding.plaats,
                land: aanmelding.land,
                aantal_laders: aanmelding.aantal_laders,
                vermogen: aanmelding.vermogen,
                netwerk: aanmelding.netwerk,
                contactpersoon: aanmelding.contactpersoon,
                email: aanmelding.email,
                opmerking: aanmelding.opmerking,
                akkoord_privacy: true,
                ingediend_op: new Date().toISOString(),
            })
            .commit()
    } catch (err) {
        console.error('[camping-aanmelding] opslaan mislukt:', err instanceof Error ? err.message : err)
        return antwoord({ success: false, error: 'Er ging iets mis bij het versturen. Probeer het later opnieuw of mail ons.' }, 500)
    }

    console.log(`[camping-aanmelding] nieuw draft ${campingId}`)
    return antwoord({ success: true, error: null }, 201)
}
