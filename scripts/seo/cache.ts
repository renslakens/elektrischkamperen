/**
 * Schijfcache voor elke externe aanroep (content/seo/.cache/<soort>/<hash>.json).
 * Een herhaalde aanroep binnen 30 dagen komt uit de cache; `--refresh` negeert dat.
 * Sleutels bevatten nooit geheimen (tokens blijven buiten de sleutel).
 */
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { CACHE_DIR } from './model'

export const CACHE_DAGEN = 30

type CacheBestand<T> = { sleutel: string; opgehaald_op: string; data: T }

export type CacheOpties = { refresh?: boolean; maxDagen?: number; dir?: string }

export async function metCache<T>(
    soort: string,
    sleutel: string,
    ophalen: () => Promise<T>,
    { refresh = false, maxDagen = CACHE_DAGEN, dir = CACHE_DIR }: CacheOpties = {},
): Promise<{ data: T; uitCache: boolean; opgehaald_op: string }> {
    const map = join(dir, soort)
    const pad = join(map, `${createHash('sha1').update(sleutel).digest('hex')}.json`)

    if (!refresh && existsSync(pad)) {
        const c = JSON.parse(readFileSync(pad, 'utf8')) as CacheBestand<T>
        const leeftijd = Date.now() - new Date(c.opgehaald_op).getTime()
        if (leeftijd < maxDagen * 86_400_000) return { data: c.data, uitCache: true, opgehaald_op: c.opgehaald_op }
    }

    const data = await ophalen()
    const opgehaald_op = new Date().toISOString()
    mkdirSync(map, { recursive: true })
    writeFileSync(pad, JSON.stringify({ sleutel, opgehaald_op, data } satisfies CacheBestand<T>, null, 2))
    return { data, uitCache: false, opgehaald_op }
}
