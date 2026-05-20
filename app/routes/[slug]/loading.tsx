export default function Loading() {
    return (
        <main className="mx-auto max-w-3xl px-4 py-10">
            <div className="mb-6 space-y-3">
                <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
                <div className="h-8 w-72 animate-pulse rounded bg-gray-200" />
                <div className="flex gap-2">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-7 w-24 animate-pulse rounded-full bg-gray-200" />
                    ))}
                </div>
            </div>
            <div className="mb-8 h-72 animate-pulse rounded-xl bg-gray-200" />
            <div className="space-y-10">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="pl-8 space-y-4">
                        <div className="h-6 w-48 animate-pulse rounded bg-gray-200" />
                        <div className="h-32 animate-pulse rounded-xl bg-gray-200" />
                    </div>
                ))}
            </div>
        </main>
    )
}