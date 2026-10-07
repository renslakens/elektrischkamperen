/**
 * Importeert gidsen uit Markdown (content/gidsen/*.md) naar Sanity als DRAFT.
 *
 * Gebruik:
 *   npm run import:gids -- --dry [--print]            # valideren, niets schrijven (--print toont de JSON)
 *   npm run import:gids -- content/gidsen/x.md        # één bestand importeren
 *   npm run import:gids                               # alle bestanden importeren
 *
 * SEO-check: als seo-toolkit geïnstalleerd is (devDependency, zie seo.config.json),
 * draait eerst `seo lint`. Een gids met seo-fouten wordt dan geweigerd, ook bij --dry.
 *   --forceer        toch importeren ondanks seo-fouten (bewuste uitzondering)
 *   --geen-netwerk   externe links niet controleren
 * Zonder toolkit (bijv. op een andere machine) wordt de check overgeslagen met een melding.
 *
 * Vereist in .env.local:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET
 *   SANITY_API_WRITE_TOKEN   (Editor-token; alleen nodig zonder --dry)
 *
 * Documenten komen binnen als `drafts.gids-<slug>`. Publiceren doe je zelf in Studio.
 * Opnieuw draaien overschrijft de draft (dus: wijzig de tekst in het .md bestand).
 *
 * Markdown-ondersteuning: ## / ### koppen, alinea's, **vet**, *cursief*,
 * [links](url) en [affiliate](url "affiliate"), > quotes, - en 1. lijsten,
 * plus twee directives:
 *
 *   ::camping{slug="recreatiepark-de-leistert" review="Waarom deze camping" cta="Check prijzen"}
 *
 *   ::checklist{titel="Wat neem je mee?"}
 *   - Type 2 laadkabel
 *   - [Laadpas](https://affiliate.example "affiliate")
 */
import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { basename, join, resolve } from 'node:path'
import matter from 'gray-matter'
import { marked, type Token, type Tokens } from 'marked'
import { createClient } from '@sanity/client'

const DOC_TYPE = 'gids'
const CONTENT_DIR = resolve(process.cwd(), 'content/gidsen')
const GELDIGE_GESCHIKT_VOOR = ['Tesla', 'Caravan', 'Camper', 'Gezin', 'Koppel', 'Solo']

// ── Args ──────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2)
const dry = args.includes('--dry')
const print = args.includes('--print')
const forceer = args.includes('--forceer')
const geenNetwerk = args.includes('--geen-netwerk')
const bestanden = args.filter((a) => !a.startsWith('--'))

// ── Portable Text types (minimaal) ────────────────────────────────────────────
type Span = { _type: 'span'; _key: string; text: string; marks: string[] }
type MarkDef = { _type: 'link'; _key: string; href: string; affiliate: boolean }
type PTNode = Record<string, unknown>

function maakKeyGenerator() {
    let n = 0
    return () => `k${(n++).toString(36).padStart(3, '0')}`
}

const decode = (s: string) =>
    s
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, '&')

// ── Inline → spans ────────────────────────────────────────────────────────────
function inline(
    tokens: Token[] | undefined,
    marks: string[],
    defs: MarkDef[],
    key: () => string,
    out: Span[] = [],
): Span[] {
    for (const t of tokens ?? []) {
        switch (t.type) {
            case 'strong':
                inline((t as Tokens.Strong).tokens, [...marks, 'strong'], defs, key, out)
                break
            case 'em':
                inline((t as Tokens.Em).tokens, [...marks, 'em'], defs, key, out)
                break
            case 'link': {
                const l = t as Tokens.Link
                const def: MarkDef = {
                    _type: 'link',
                    _key: key(),
                    href: l.href,
                    affiliate: l.title === 'affiliate',
                }
                defs.push(def)
                inline(l.tokens, [...marks, def._key], defs, key, out)
                break
            }
            case 'codespan':
                out.push({ _type: 'span', _key: key(), text: decode((t as Tokens.Codespan).text), marks })
                break
            case 'br':
                out.push({ _type: 'span', _key: key(), text: '\n', marks })
                break
            case 'html':
                break // inline HTML negeren
            default: {
                const tt = t as Tokens.Text
                if (tt.tokens?.length) inline(tt.tokens, marks, defs, key, out)
                else if (typeof tt.text === 'string' && tt.text !== '')
                    out.push({ _type: 'span', _key: key(), text: decode(tt.text), marks })
            }
        }
    }
    return out
}

function blok(
    style: string,
    tokens: Token[] | undefined,
    key: () => string,
    extra: PTNode = {},
): PTNode {
    const markDefs: MarkDef[] = []
    let children = inline(tokens, [], markDefs, key)
    if (children.length === 0) children = [{ _type: 'span', _key: key(), text: '', marks: [] }]
    return { _type: 'block', _key: key(), style, markDefs, children, ...extra }
}

// ── Directives ────────────────────────────────────────────────────────────────
function parseAttrs(s: string): Record<string, string> {
    const attrs: Record<string, string> = {}
    for (const m of s.matchAll(/(\w+)="([^"]*)"/g)) attrs[m[1]] = m[2]
    return attrs
}

const DIRECTIVE = /^::(camping|checklist)\{(.*)\}\s*$/

// ── Markdown → Portable Text ──────────────────────────────────────────────────
async function markdownNaarPortableText(
    md: string,
    zoekCamping: (slug: string) => Promise<string | null>,
    fouten: string[],
): Promise<PTNode[]> {
    const key = maakKeyGenerator()
    const tokens = marked.lexer(md)
    const out: PTNode[] = []

    for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i]
        switch (t.type) {
            case 'space':
            case 'hr':
                break
            case 'heading': {
                const h = t as Tokens.Heading
                if (h.depth === 1) {
                    fouten.push(`H1 in body genegeerd ("${h.text}") — de titel komt uit frontmatter`)
                    break
                }
                out.push(blok(h.depth === 2 ? 'h2' : 'h3', h.tokens, key))
                break
            }
            case 'paragraph': {
                const p = t as Tokens.Paragraph
                const dm = p.raw.trim().match(DIRECTIVE)
                if (!dm) {
                    out.push(blok('normal', p.tokens, key))
                    break
                }
                const [, soort, attrStr] = dm
                const attrs = parseAttrs(attrStr)

                if (soort === 'camping') {
                    if (!attrs.slug) {
                        fouten.push('::camping mist slug="…"')
                        break
                    }
                    const id = await zoekCamping(attrs.slug)
                    if (!id) {
                        fouten.push(`::camping: camping met slug "${attrs.slug}" niet gevonden in Sanity — blok overgeslagen`)
                        break
                    }
                    out.push({
                        _type: 'campingCard',
                        _key: key(),
                        camping: { _type: 'reference', _ref: id },
                        ...(attrs.review ? { redactionele_review: attrs.review } : {}),
                        ...(attrs.cta ? { cta_tekst: attrs.cta } : {}),
                    })
                } else {
                    // checklist: de direct volgende lijst bevat de items
                    let j = i + 1
                    while (tokens[j]?.type === 'space') j++
                    const lijst = tokens[j]?.type === 'list' ? (tokens[j] as Tokens.List) : null
                    if (!lijst) {
                        fouten.push('::checklist moet direct gevolgd worden door een lijst')
                        break
                    }
                    const items = lijst.items.map((item) => {
                        const defs: MarkDef[] = []
                        const spans = inline(item.tokens, [], defs, key)
                        const link = defs[0]
                        const label = spans.map((s) => s.text).join('').trim()
                        return {
                            _type: 'object',
                            _key: key(),
                            label,
                            ...(link?.href ? { affiliate_url: link.href } : {}),
                        }
                    })
                    out.push({
                        _type: 'checklist',
                        _key: key(),
                        ...(attrs.titel ? { titel: attrs.titel } : {}),
                        items,
                    })
                    i = j // lijst is verbruikt
                }
                break
            }
            case 'blockquote': {
                for (const inner of (t as Tokens.Blockquote).tokens) {
                    if (inner.type === 'paragraph')
                        out.push(blok('blockquote', (inner as Tokens.Paragraph).tokens, key))
                }
                break
            }
            case 'list': {
                const l = t as Tokens.List
                const listItem = l.ordered ? 'number' : 'bullet'
                for (const item of l.items) {
                    out.push(blok('normal', item.tokens, key, { listItem, level: 1 }))
                }
                break
            }
            default:
                fouten.push(`Niet-ondersteund Markdown-element "${t.type}" genegeerd`)
        }
    }
    return out
}

// ── Frontmatter validatie ─────────────────────────────────────────────────────
function valideerFrontmatter(fm: Record<string, unknown>, bestand: string): string[] {
    const fouten: string[] = []
    if (!fm.titel) fouten.push('frontmatter: titel ontbreekt')
    if (!fm.slug) fouten.push('frontmatter: slug ontbreekt')
    if (typeof fm.seo_beschrijving === 'string' && fm.seo_beschrijving.length > 160)
        fouten.push(`seo_beschrijving is ${fm.seo_beschrijving.length} tekens (max 160)`)
    if (Array.isArray(fm.geschikt_voor)) {
        const fout = fm.geschikt_voor.filter((g) => !GELDIGE_GESCHIKT_VOOR.includes(String(g)))
        if (fout.length) fouten.push(`geschikt_voor: ongeldige waarden ${fout.join(', ')} (toegestaan: ${GELDIGE_GESCHIKT_VOOR.join(', ')})`)
    }
    return fouten.map((f) => `${basename(bestand)}: ${f}`)
}

// ── SEO-lint (optioneel, via seo-toolkit) ─────────────────────────────────────
type LintUitslag = { pad: string; fouten: number; bevindingen: { ernst: string; regel: number; bericht: string }[] }

/** Seo-fouten per absoluut pad, of null als de toolkit niet beschikbaar is. */
function seoLint(paden: string[]): Map<string, LintUitslag> | null {
    const bin = resolve(process.cwd(), 'node_modules/seo-toolkit/bin/seo.js')
    if (!existsSync(bin)) {
        console.warn('⚠ seo-toolkit niet geïnstalleerd: seo-lint overgeslagen')
        return null
    }
    const r = spawnSync(process.execPath, [bin, 'lint', '--json', ...(geenNetwerk ? ['--geen-netwerk'] : []), ...paden], { encoding: 'utf8' })
    let uitslag: LintUitslag[]
    try {
        uitslag = JSON.parse(r.stdout) as LintUitslag[]
    } catch {
        throw new Error(`seo lint gaf geen geldige uitvoer:\n${r.stderr || r.stdout}`)
    }
    return new Map(uitslag.map((u) => [resolve(process.cwd(), u.pad), u]))
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
    const token = process.env.SANITY_API_WRITE_TOKEN
    if (!projectId || !dataset) throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET ontbreken in .env.local')
    if (!dry && !token) throw new Error('SANITY_API_WRITE_TOKEN ontbreekt in .env.local (of draai met --dry)')

    // Zonder token kunnen we in --dry nog wel publieke data lezen om camping-refs te controleren
    const client = createClient({
        projectId,
        dataset,
        apiVersion: '2025-01-01',
        token,
        useCdn: false,
    })

    const paden = bestanden.length
        ? bestanden.map((b) => resolve(process.cwd(), b))
        : readdirSync(CONTENT_DIR)
            .filter((f) => f.endsWith('.md'))
            .map((f) => join(CONTENT_DIR, f))

    if (!paden.length) {
        console.log(`Geen .md bestanden gevonden in ${CONTENT_DIR}`)
        return
    }

    const lint = seoLint(paden)

    const cache = new Map<string, string | null>()
    const zoekCamping = async (slug: string) => {
        if (cache.has(slug)) return cache.get(slug)!
        const id = await client.fetch<string | null>(
            `*[_type == "camping" && slug.current == $slug && !(_id in path("drafts.**"))][0]._id`,
            { slug },
        )
        cache.set(slug, id)
        return id
    }

    let fout = false
    for (const pad of paden) {
        const { data: fm, content } = matter(readFileSync(pad, 'utf8'))
        const problemen = valideerFrontmatter(fm, pad)
        const blokFouten: string[] = []
        const body = await markdownNaarPortableText(content, zoekCamping, blokFouten)
        problemen.push(...blokFouten.map((f) => `${basename(pad)}: ${f}`))

        const slug = String(fm.slug ?? '')
        const doc = {
            _id: `drafts.gids-${slug}`,
            _type: DOC_TYPE,
            titel: fm.titel,
            slug: { _type: 'slug', current: slug },
            hook: fm.hook,
            body,
            seo_titel: fm.seo_titel,
            seo_beschrijving: fm.seo_beschrijving,
            focus_keyword: fm.focus_keyword,
            land: fm.land,
            geschikt_voor: fm.geschikt_voor,
            // gray-matter parsed "2026-09-30" als Date → terug naar YYYY-MM-DD
            gepubliceerd_op:
                fm.gepubliceerd_op instanceof Date
                    ? fm.gepubliceerd_op.toISOString().slice(0, 10)
                    : fm.gepubliceerd_op,
        }

        const fatal = problemen.some((p) => /frontmatter|seo_beschrijving|geschikt_voor/.test(p))
        console.log(`\n${basename(pad)} → ${doc._id}  (${body.length} blokken)`)
        for (const p of problemen) console.warn(`  ⚠ ${p}`)

        if (fatal) {
            console.error('  ✗ overgeslagen wegens fouten in frontmatter')
            fout = true
            continue
        }
        const seo = lint?.get(pad)
        if (seo?.fouten) {
            for (const b of seo.bevindingen.filter((x) => x.ernst === 'fout')) console.error(`  ✗ seo, regel ${b.regel}: ${b.bericht}`)
            if (!forceer) {
                console.error(`  ✗ geweigerd: ${seo.fouten} seo-fout(en) (zie npm run seo:lint, of importeer bewust met --forceer)`)
                fout = true
                continue
            }
            console.warn('  ⚠ --forceer: doorgelaten ondanks seo-fouten')
        }
        if (dry) {
            if (print) console.log(JSON.stringify(doc, null, 2))
            console.log('  ✓ dry-run: niet geschreven')
            continue
        }
        await client.createOrReplace(doc)
        console.log('  ✓ draft geschreven — publiceer in Studio')
    }
    if (fout) process.exitCode = 1
}

main().catch((e) => {
    console.error(e)
    process.exit(1)
})
