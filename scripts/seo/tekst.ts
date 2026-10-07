/**
 * Gedeelde tekstregels voor de SEO-toolkit: normaliseren, stammen, land en
 * zoekintentie herkennen. Alles regelgebaseerd en zonder externe dienst, zodat
 * de uitkomst voorspelbaar en testbaar is.
 */
import { LANDEN } from '../../lib/camping-opties'

export type Land = (typeof LANDEN)[number]
export type Intentie = 'informatief' | 'commercieel' | 'navigatie' | 'transactioneel'

// ── Normaliseren ──────────────────────────────────────────────────────────────

/** Kleine letters, zonder accenten en leestekens, enkele spaties. */
export function normaliseer(tekst: string): string {
    return tekst
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[’']/g, "'")
        .replace(/'s\b/g, 's')
        .replace(/[^a-z0-9\s-]/g, ' ')
        .replace(/-/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
}

export function woorden(tekst: string): string[] {
    const n = normaliseer(tekst)
    return n ? n.split(' ') : []
}

/** URL-vriendelijke slug, in lijn met de bestaande gids-slugs. */
export function slugify(tekst: string): string {
    return woorden(tekst).join('-')
}

// ── Woordenlijsten ────────────────────────────────────────────────────────────

/** Lidwoorden, voorzetsels, voornaamwoorden en vraagwoorden: geen betekenis voor het onderwerp. */
export const STOPWOORDEN = new Set([
    'de', 'het', 'een', 'op', 'met', 'in', 'je', 'jij', 'jouw', 'u', 'uw', 'voor', 'van', 'naar',
    'en', 'of', 'bij', 'aan', 'te', 'om', 'tot', 'uit', 'is', 'zijn', 'wordt', 'worden', 'kan',
    'kun', 'kunnen', 'mag', 'mogen', 'moet', 'moeten', 'ik', 'wij', 'we', 'mijn', 'onze', 'er',
    'die', 'dat', 'deze', 'dit', 'als', 'niet', 'geen', 'ook', 'nog', 'wel', 'hoe', 'wat', 'waar',
    'welke', 'welk', 'wanneer', 'waarom', 'wie', 'hoeveel', 'hoelang', 'heb', 'hebben', 'heeft',
    'nodig', 'over', 'via', 'zo', 'per', 'door', 'tijdens', 'zonder', 'onderweg',
])

export const VRAAGWOORDEN = [
    'hoe', 'wat', 'waar', 'welke', 'welk', 'wanneer', 'waarom', 'wie', 'hoeveel', 'hoelang',
    'kan', 'kun', 'mag', 'moet', 'is', 'zijn', 'heb', 'heeft', 'werkt',
]

/** Woorden die in bijna elke zoekopdracht van deze site staan en dus geen onderwerp onderscheiden. */
const CONTEXTSTAMMEN = new Set(['elektrisch', 'auto', 'wagen', 'vakantie', 'kamper'])

/** Woorden die een onderwerp verfijnen (een H2 of FAQ), maar geen eigen onderwerp zijn. */
const MODIFICATORSTAMMEN = new Set([
    'kost', 'prijs', 'tarief', 'tip', 'best', 'goedkop', 'goedkopst', 'ervaring', 'review',
    'vergelijk', 'vergelijking', 'kop', 'bestel', 'aanbieding', 'korting', 'uitleg', 'regel',
    'overzicht', 'lijst', 'top', 'gids', 'info', 'informatie', 'snel', 'veilig',
])

/** Variant → vaste vorm, vóór het stammen. */
const SYNONIEMEN: Record<string, string> = {
    opladen: 'laden', oplaad: 'laad', laadt: 'laad',
    laadpalen: 'laadpaal', laadpunt: 'laadpaal', laadpunten: 'laadpaal', laadstation: 'laadpaal',
    laadstations: 'laadpaal', laadzuil: 'laadpaal', laadpassen: 'laadpas', laadkaart: 'laadpas',
    laadkabels: 'laadkabel', snelladers: 'snellader', snelladen: 'snellader',
    ev: 'elektrisch', evs: 'elektrisch', eauto: 'elektrisch', elektrische: 'elektrisch',
    autos: 'auto', campings: 'camping', camperplaats: 'camperplaats', caravans: 'caravan',
    campers: 'camper', kamperen: 'kamper', kampeervakantie: 'vakantie', kampeer: 'kamper',
    prijzen: 'prijs', reizen: 'reis', kosten: 'kost', duurder: 'kost',
    goedkoop: 'goedkop', goedkoopste: 'goedkopst', beste: 'best', kopen: 'kop', koop: 'kop',
    tips: 'tip', ervaringen: 'ervaring', regels: 'regel', stekkers: 'stekker', stopcontact: 'stopcontact',
    tarieven: 'tarief', vergelijken: 'vergelijk',
}

/**
 * Lichte Nederlandse stammer. Geen taalkundig correcte stam, wel een vaste
 * vorm: "campings" en "camping", "laden" en "laad" vallen samen.
 */
export function stam(woord: string): string {
    let w = SYNONIEMEN[woord] ?? woord
    if (/^\d+$/.test(w)) return w
    if (w.length > 4 && w.endsWith('s') && /[eglnprkmt]/.test(w[w.length - 2])) w = w.slice(0, -1)
    if (w.length > 4 && w.endsWith('en')) w = w.slice(0, -2)
    if (w.length > 4 && w.endsWith('e')) w = w.slice(0, -1)
    w = w.replace(/([aeou])\1/g, '$1')
    return SYNONIEMEN[w] ?? w
}

export function stammen(tekst: string): string[] {
    return woorden(tekst).filter((w) => !STOPWOORDEN.has(w)).map(stam)
}

// ── Land ──────────────────────────────────────────────────────────────────────

const LANDWOORDEN: Record<string, Land> = {
    nederland: 'Nederland', nederlands: 'Nederland', nederlandse: 'Nederland',
    belgie: 'België', belgisch: 'België', belgische: 'België',
    duitsland: 'Duitsland', duits: 'Duitsland', duitse: 'Duitsland',
    frankrijk: 'Frankrijk', frans: 'Frankrijk', franse: 'Frankrijk',
    italie: 'Italië', italiaans: 'Italië', italiaanse: 'Italië',
    spanje: 'Spanje', spaans: 'Spanje', spaanse: 'Spanje',
    oostenrijk: 'Oostenrijk', oostenrijks: 'Oostenrijk', oostenrijkse: 'Oostenrijk',
    zwitserland: 'Zwitserland', zwitsers: 'Zwitserland', zwitserse: 'Zwitserland',
    kroatie: 'Kroatië', kroatisch: 'Kroatië', kroatische: 'Kroatië',
}

/** Eerste land uit de landenlijst van het camping-schema dat in de term voorkomt, of null. */
export function herkenLand(term: string): Land | null {
    for (const w of woorden(term)) if (LANDWOORDEN[w]) return LANDWOORDEN[w]
    return null
}

export function isLandwoord(woord: string): boolean {
    return woord in LANDWOORDEN
}

// ── Kernwoorden (voor clustering) ─────────────────────────────────────────────

/**
 * De woorden die het onderwerp bepalen: zonder stopwoorden, vraagwoorden,
 * landnamen, jaartallen, contextwoorden (elektrische auto, vakantie) en
 * modificatoren (kosten, beste, tips). Gesorteerd en uniek.
 */
export function kernwoorden(term: string): string[] {
    const kern = new Set<string>()
    for (const w of woorden(term)) {
        if (STOPWOORDEN.has(w) || isLandwoord(w) || /^(19|20)\d\d$/.test(w)) continue
        const s = stam(w)
        if (CONTEXTSTAMMEN.has(s) || MODIFICATORSTAMMEN.has(s)) continue
        kern.add(s)
    }
    return [...kern].sort()
}

/** Contextwoorden blijven over als een term alleen daaruit bestaat ("elektrische auto frankrijk"). */
export function contextwoorden(term: string): string[] {
    return [...new Set(woorden(term).filter((w) => !STOPWOORDEN.has(w)).map(stam).filter((s) => CONTEXTSTAMMEN.has(s)))].sort()
}

// ── Vraag en intentie ─────────────────────────────────────────────────────────

export function isVraag(term: string): boolean {
    if (term.trim().endsWith('?')) return true
    const eerste = woorden(term)[0]
    return eerste !== undefined && VRAAGWOORDEN.includes(eerste)
}

/** Merken en sites: wie die intypt, zoekt meestal die site. */
export const MERKEN = [
    'anwb', 'ionity', 'fastned', 'allego', 'tesla', 'totalenergies', 'electra', 'chargemap',
    'shell recharge', 'vattenfall', 'eneco', 'izivia', 'freshmile', 'acsi', 'anwb camping',
    'elektrischkamperen', 'bar2charge', 'plugsurfing', 'abrp', 'a better routeplanner',
]
const NAVIGATIE = /\b(login|inloggen|website|klantenservice|contact|app downloaden|openingstijden)\b/
const TRANSACTIONEEL = /\b(kopen|koop|bestellen|bestel|boeken|boek|reserveren|reserveer|aanvragen|aanbieding|korting|kortingscode|webshop|huren)\b/
const COMMERCIEEL = /\b(beste|vergelijken|vergelijking|vergelijk|review|reviews|ervaringen|top \d+|goedkoopste|goedkoop|vs|versus|alternatief|alternatieven|prijs|prijzen|kosten)\b/
/** Producten met affiliatepotentie: zonder vraagwoord is dat kooporiëntatie. */
export const PRODUCTWOORDEN = /\b(laadpas|laadpassen|laadkaart|adapter|adapters|kabel|kabels|laadkabel|verlengkabel|buitenkabel|mobiele lader|reislader|cee|stekkerhouder|laadpaal kopen)\b/

/**
 * Zoekintentie uit regels op het zoekwoord, in deze volgorde:
 * 1. transactioneel: kopen, bestellen, boeken, reserveren, korting …
 * 2. navigatie: een merk of site met weinig andere woorden, of login/app/klantenservice
 * 3. commercieel: beste, vergelijken, review, ervaringen, kosten/prijs, of een product zonder vraagwoord
 * 4. informatief: al het andere (vooral vragen en "hoe werkt …")
 */
export function bepaalIntentie(term: string): Intentie {
    const n = normaliseer(term)
    if (TRANSACTIONEEL.test(n)) return 'transactioneel'
    const merk = MERKEN.some((m) => new RegExp(`\\b${m}\\b`).test(n))
    if (NAVIGATIE.test(n) && merk) return 'navigatie'
    if (merk && woorden(n).length <= 2) return 'navigatie'
    if (isVraag(term)) return /^(welke|wat is de beste)\b/.test(n) && (COMMERCIEEL.test(n) || PRODUCTWOORDEN.test(n)) ? 'commercieel' : 'informatief'
    if (COMMERCIEEL.test(n) || PRODUCTWOORDEN.test(n)) return 'commercieel'
    return 'informatief'
}

// ── Overlap ───────────────────────────────────────────────────────────────────

export function jaccard(a: Iterable<string>, b: Iterable<string>): number {
    const A = new Set(a)
    const B = new Set(b)
    if (!A.size && !B.size) return 0
    let gedeeld = 0
    for (const x of A) if (B.has(x)) gedeeld++
    return gedeeld / (A.size + B.size - gedeeld)
}

/**
 * Bevat de tekst het zoekwoord? Ja bij de letterlijke woordgroep, of als alle
 * betekenisdragende woorden (gestamd) erin voorkomen, in willekeurige volgorde.
 * Zo telt "Laden met de elektrische auto in Frankrijk" voor "laden elektrische auto Frankrijk".
 */
export function bevatZoekwoord(tekst: string, zoekwoord: string): boolean {
    const t = normaliseer(tekst)
    const z = normaliseer(zoekwoord)
    if (!z) return false
    if (` ${t} `.includes(` ${z} `)) return true
    const tekstStammen = new Set(stammen(tekst))
    const nodig = stammen(zoekwoord)
    return nodig.length > 0 && nodig.every((s) => tekstStammen.has(s))
}

export function hoofdletter(tekst: string): string {
    return tekst.charAt(0).toUpperCase() + tekst.slice(1)
}
