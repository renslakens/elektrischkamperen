'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const links = [
    { href: '/campings', label: 'Campings' },
    { href: '/routes', label: 'Routes' },
    { href: '/gidsen', label: 'Gidsen' },
]

export function Nav() {
    const pathname = usePathname()
    const [menuOpen, setMenuOpen] = useState(false)

    // Verberg nav in de Studio
    if (pathname?.startsWith('/studio')) return null

    return (
        <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur-sm">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 font-bold text-gray-900">
                    <span className="text-xl">⚡</span>
                    <span>Elektrisch<span className="text-green-600">Kamperen</span></span>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden items-center gap-6 md:flex">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-sm font-medium transition ${pathname?.startsWith(link.href)
                                    ? 'text-green-700'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        href="/campings"
                        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
                    >
                        Vind een camping
                    </Link>
                </nav>

                {/* Mobile hamburger */}
                <button
                    className="md:hidden p-2 text-gray-600"
                    onClick={() => setMenuOpen((o) => !o)}
                    aria-label="Menu openen"
                >
                    {menuOpen ? (
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="border-t bg-white px-4 pb-4 md:hidden">
                    <nav className="flex flex-col gap-1 pt-2">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMenuOpen(false)}
                                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition ${pathname?.startsWith(link.href)
                                        ? 'bg-green-50 text-green-700'
                                        : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            href="/campings"
                            onClick={() => setMenuOpen(false)}
                            className="mt-2 rounded-lg bg-green-600 px-3 py-2.5 text-center text-sm font-semibold text-white"
                        >
                            Vind een camping
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    )
}