import Link from 'next/link'

export default function NotFound() {
    return (
        <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
            <p className="text-5xl font-bold text-green-600">404</p>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">Pagina niet gevonden</h1>
            <p className="mt-2 text-gray-500">
                Deze pagina bestaat niet of is verplaatst.
            </p>
            <Link
                href="/"
                className="mt-6 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
            >
                Terug naar home
            </Link>
        </main>
    )
}