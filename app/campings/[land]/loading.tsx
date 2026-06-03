export default function Loading() {
    return (
        <main className="mx-auto max-w-5xl px-4 py-10">
            <div className="mb-4 h-4 w-32 animate-pulse rounded bg-gray-200" />
            <div className="mb-8 space-y-2">
                <div className="h-8 w-72 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-64 animate-pulse rounded-xl bg-gray-200" />
                ))}
            </div>
        </main>
    )
}