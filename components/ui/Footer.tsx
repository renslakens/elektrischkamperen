import Link from 'next/link'
import { CookieSettingsLink } from '@/components/ui/CookieSettingsLink'

const jaar = new Date().getFullYear()

export function Footer() {
    return (
        <footer className="border-t bg-gray-50 px-4 py-10 mt-16">
            <div className="mx-auto max-w-5xl">
                <div className="grid gap-8 sm:grid-cols-3">

                    {/* Merk */}
                    <div>
                        <div className="flex items-center gap-2 font-bold text-gray-900">
                            <span>⚡</span>
                            <span>Elektrisch<span className="text-green-600">Kamperen</span></span>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                            Geverifieerde laadinfo bij elke camping. Voor de zorgeloze EV-kampeerder.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                            Ontdekken
                        </p>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><Link href="/campings" className="hover:text-green-700">Campings met laadpaal</Link></li>
                            <li><Link href="/routes" className="hover:text-green-700">EV-reisroutes</Link></li>
                            <li><Link href="/gidsen" className="hover:text-green-700">Reisgidsen</Link></li>
                        </ul>
                    </div>

                    {/* Info */}
                    <div>
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                            Over ons
                        </p>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><Link href="/over-ons" className="hover:text-green-700">Over Elektrisch Kamperen</Link></li>
                            <li><Link href="/affiliate-disclaimer" className="hover:text-green-700">Affiliate disclaimer</Link></li>
                            <li><Link href="/privacy" className="hover:text-green-700">Privacybeleid</Link></li>
                            <li><CookieSettingsLink /></li>
                        </ul>
                    </div>

                </div>

                <div className="mt-8 border-t pt-6 text-center text-xs text-gray-400">
                    © {jaar} ElektrischKamperen.nl
                </div>
            </div>
        </footer>
    )
}