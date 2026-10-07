/** Kleine hulpjes voor de seo:*-commando's: argumenten en .env.local. */
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

/** Laadt .env.local als die bestaat. Geheimen komen alleen daar vandaan en worden nooit gelogd. */
export function laadEnv(): void {
    const pad = resolve(process.cwd(), '.env.local')
    if (existsSync(pad)) process.loadEnvFile(pad)
}

export type Args = { los: string[]; vlag: (naam: string) => boolean; optie: (naam: string) => string | undefined }

export function leesArgs(argv = process.argv.slice(2)): Args {
    const los: string[] = []
    const opties = new Map<string, string>()
    const vlaggen = new Set<string>()
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i]
        if (!a.startsWith('--')) {
            los.push(a)
            continue
        }
        const [naam, waarde] = a.slice(2).split('=', 2)
        if (waarde !== undefined) opties.set(naam, waarde)
        else if (argv[i + 1] !== undefined && !argv[i + 1].startsWith('--') && WAARDE_OPTIES.has(naam)) opties.set(naam, argv[++i])
        else vlaggen.add(naam)
    }
    return { los, vlag: (n) => vlaggen.has(n), optie: (n) => opties.get(n) }
}

/** Opties die een waarde verwachten (`--bron harborrank` of `--bron=harborrank`). */
const WAARDE_OPTIES = new Set(['bron', 'datum', 'lang', 'land', 'provider', 'min-vertoningen'])

export function stop(melding: string): never {
    console.error(`✗ ${melding}`)
    process.exit(1)
}
