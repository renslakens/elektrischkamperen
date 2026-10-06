'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Sleutel in localStorage. Dezelfde sleutel leest het consent-default script in layout.tsx.
export const CONSENT_KEY = 'ek-consent'
export const OPEN_EVENT = 'ek-open-cookie-settings'

type Keuze = 'granted' | 'denied'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function gtag(..._args: unknown[]) {
    window.dataLayer = window.dataLayer || []
    // Google Tag verwacht het `arguments`-object, geen gewone array.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments)
}

function bewaar(keuze: Keuze) {
    try {
        localStorage.setItem(CONSENT_KEY, keuze)
    } catch {
        // localStorage geblokkeerd: keuze geldt alleen voor deze pagina
    }
    gtag('consent', 'update', {
        analytics_storage: keuze,
        // Er worden geen advertenties getoond; deze blijven altijd geweigerd.
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
    })
}

const CHANGE_EVENT = 'ek-consent-change'

function lees(): string {
    try {
        const v = localStorage.getItem(CONSENT_KEY)
        return v === 'granted' || v === 'denied' ? v : 'none'
    } catch {
        return 'none'
    }
}

function subscribe(cb: () => void) {
    window.addEventListener('storage', cb)
    window.addEventListener(CHANGE_EVENT, cb)
    return () => {
        window.removeEventListener('storage', cb)
        window.removeEventListener(CHANGE_EVENT, cb)
    }
}

export function CookieBanner() {
    const pathname = usePathname()
    // 'server' tijdens SSR/hydratie: dan tonen we niets, zodat er geen mismatch ontstaat.
    const opgeslagen = useSyncExternalStore(subscribe, lees, () => 'server')
    const [override, setOverride] = useState<'open' | 'dicht' | null>(null)

    useEffect(() => {
        const openen = () => setOverride('open')
        window.addEventListener(OPEN_EVENT, openen)
        return () => window.removeEventListener(OPEN_EVENT, openen)
    }, [])

    const zichtbaar =
        opgeslagen !== 'server' &&
        (override === 'open' || (override !== 'dicht' && opgeslagen === 'none'))

    // Niet tonen in de Sanity Studio
    if (!zichtbaar || pathname?.startsWith('/studio')) return null

    function kies(keuze: Keuze) {
        bewaar(keuze)
        window.dispatchEvent(new Event(CHANGE_EVENT))
        setOverride('dicht')
    }

    return (
        <div
            role="dialog"
            aria-label="Cookie-instellingen"
            className="fixed inset-x-0 bottom-0 z-50 border-t bg-white p-4 shadow-lg"
        >
            <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-600">
                    We gebruiken Google Analytics om te zien welke pagina&apos;s en affiliate-links
                    worden bekeken. Dat gebeurt alleen met jouw toestemming. Lees meer in ons{' '}
                    <Link href="/privacy" className="font-medium text-green-700 underline">
                        privacybeleid
                    </Link>
                    .
                </p>
                <div className="flex shrink-0 gap-3">
                    <button
                        type="button"
                        onClick={() => kies('denied')}
                        className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
                    >
                        Weigeren
                    </button>
                    <button
                        type="button"
                        onClick={() => kies('granted')}
                        className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
                    >
                        Accepteren
                    </button>
                </div>
            </div>
        </div>
    )
}
