/**
 * Gegevensmodel van content/seo/keywords.json.
 *
 * Harde regel: metrics worden nooit verzonnen. Elke waarde komt uit een meting
 * met `bron` en `datum`; ontbreekt hij, dan is hij `null`. Alle metingen per
 * bron blijven bewaard in `metingen`, zodat je altijd kunt nagaan waar een
 * getal vandaan komt.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { bepaalIntentie, herkenLand, normaliseer, type Intentie, type Land } from './tekst'

export const SEO_DIR = resolve(process.cwd(), 'content/seo')
export const GIDSEN_DIR = resolve(process.cwd(), 'content/gidsen')
export const KEYWORDS_PAD = resolve(SEO_DIR, 'keywords.json')
export const BACKLOG_PAD = resolve(SEO_DIR, 'backlog.md')
export const SEEDS_PAD = resolve(SEO_DIR, 'seeds.md')
export const PERFORMANCE_PAD = resolve(SEO_DIR, 'performance.json')
export const BRIEFS_DIR = resolve(SEO_DIR, 'briefs')
export const CACHE_DIR = resolve(SEO_DIR, '.cache')

/** Eén waarneming van één bron op één datum. */
export type Meting = {
    bron: string
    datum: string // YYYY-MM-DD
    volume: number | null
    moeilijkheid: number | null
    cpc: number | null
    /** Overige herkende kolommen, bijv. vertoningen, positie, concurrentie. Nooit omgerekend. */
    extra?: Record<string, string | number | null>
}

export type Zoekwoord = {
    term: string
    /** volume, moeilijkheid, cpc, bron en datum komen samen uit één meting (zie kiesMeting). */
    volume: number | null
    moeilijkheid: number | null
    cpc: number | null
    bron: string
    datum: string
    intentie: Intentie
    cluster: string | null
    land: Land | null
    metingen: Meting[]
}

export type ScoreOnderdelen = {
    volume: number
    usp: number
    commercieel: number
    search_console: number
    dekkingsfactor: number
}

export type Cluster = {
    id: string
    hoofdterm: string
    termen: string[]
    /** Som van de bekende volumes; null als geen enkele term een volume heeft. */
    totaal_volume: number | null
    /** Aantal termen waarvan het volume onbekend is (dus niet in totaal_volume). */
    termen_zonder_volume: number
    land: Land | null
    intentie: Intentie
    prioriteit: number
    score: ScoreOnderdelen
    /** Slug van de gids die dit onderwerp al behandelt, of null. */
    gedekt_door: string | null
    dekking: 'gedekt' | 'bijna' | 'nee'
}

export type KeywordsBestand = {
    bijgewerkt_op: string | null
    zoekwoorden: Zoekwoord[]
    clusters: Cluster[]
}

export function vandaagIso(): string {
    return new Date().toISOString().slice(0, 10)
}

export function leesKeywords(pad = KEYWORDS_PAD): KeywordsBestand {
    if (!existsSync(pad)) return { bijgewerkt_op: null, zoekwoorden: [], clusters: [] }
    const data = JSON.parse(readFileSync(pad, 'utf8')) as KeywordsBestand
    return { bijgewerkt_op: data.bijgewerkt_op ?? null, zoekwoorden: data.zoekwoorden ?? [], clusters: data.clusters ?? [] }
}

export function schrijfKeywords(bestand: KeywordsBestand, pad = KEYWORDS_PAD): void {
    mkdirSync(dirname(pad), { recursive: true })
    const zoekwoorden = [...bestand.zoekwoorden].sort((a, b) => a.term.localeCompare(b.term, 'nl'))
    writeFileSync(pad, JSON.stringify({ ...bestand, bijgewerkt_op: vandaagIso(), zoekwoorden }, null, 2) + '\n')
}

const heeftMetric = (m: Meting) => m.volume !== null || m.moeilijkheid !== null || m.cpc !== null

/**
 * De meting waaruit de hoofdvelden komen: de nieuwste met minstens één metric,
 * anders de nieuwste. Zo hoort een volume altijd bij de bron en datum ernaast.
 */
export function kiesMeting(metingen: Meting[]): Meting {
    const opDatum = [...metingen].sort((a, b) => b.datum.localeCompare(a.datum))
    return opDatum.find(heeftMetric) ?? opDatum[0]
}

/**
 * Voegt een meting toe aan het bestand (in place). Per term en bron blijft de
 * nieuwste meting staan; metingen van andere bronnen blijven bewaard.
 */
export function voegMetingToe(bestand: KeywordsBestand, term: string, meting: Meting): Zoekwoord {
    const sleutel = normaliseer(term)
    let zw = bestand.zoekwoorden.find((z) => normaliseer(z.term) === sleutel)
    if (!zw) {
        zw = {
            term: term.trim().replace(/\s+/g, ' '),
            volume: null, moeilijkheid: null, cpc: null,
            bron: meting.bron, datum: meting.datum,
            intentie: bepaalIntentie(term),
            cluster: null,
            land: herkenLand(term),
            metingen: [],
        }
        bestand.zoekwoorden.push(zw)
    }
    const bestaand = zw.metingen.findIndex((m) => m.bron === meting.bron)
    if (bestaand === -1) zw.metingen.push(meting)
    else if (meting.datum >= zw.metingen[bestaand].datum) zw.metingen[bestaand] = meting

    const gekozen = kiesMeting(zw.metingen)
    zw.volume = gekozen.volume
    zw.moeilijkheid = gekozen.moeilijkheid
    zw.cpc = gekozen.cpc
    zw.bron = gekozen.bron
    zw.datum = gekozen.datum
    return zw
}
