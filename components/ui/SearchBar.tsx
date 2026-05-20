'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function SearchBar() {
    const router = useRouter()
    const [query, setQuery] = useState('')

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (query.trim()) {
            router.push(`/campings?q=${encodeURIComponent(query.trim())}`)
        } else {
            router.push('/campings')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex w-full max-w-xl gap-2">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Zoek op land, regio of campingnaam..."
                className="flex-1 rounded-xl border-0 bg-white px-5 py-4 text-gray-900 shadow-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
                type="submit"
                className="rounded-xl bg-green-600 px-6 py-4 font-semibold text-white shadow-lg transition hover:bg-green-700 active:scale-95"
            >
                Zoeken
            </button>
        </form>
    )
}