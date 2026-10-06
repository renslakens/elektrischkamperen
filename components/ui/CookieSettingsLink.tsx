'use client'

import { OPEN_EVENT } from '@/components/ui/CookieBanner'

// Maakt intrekken van toestemming even makkelijk als geven.
export function CookieSettingsLink() {
    return (
        <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
            className="inline-block py-2 hover:text-green-700"
        >
            Cookie-instellingen
        </button>
    )
}
