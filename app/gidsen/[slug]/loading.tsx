export default function Loading() {
    return (
        <main className="mx-auto max-w-3xl px-4 py-10">
            <div className="mb-6 space-y-3">
                <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
                <div className="h-8 w-80 animate-pulse rounded bg-gray-200" />
            </div>
            <div className="mb-8 h-72 animate-pulse rounded-xl bg-gray-200" />
            <div className="mb-8 h-16 animate-pulse rounded bg-gray-200" />
            <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-48 animate-pulse rounded-xl bg-gray-200" />
                ))}
            </div>
        </main>
    )
}