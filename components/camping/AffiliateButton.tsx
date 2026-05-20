type AffiliateButtonProps = {
    href: string | null
    campingNaam: string | null
    variant?: 'primary' | 'secondary'
}

export function AffiliateButton({ href, campingNaam, variant = 'primary' }: AffiliateButtonProps) {
    if (!href) return null

    return (< a
        href={href}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className={
            variant === 'primary'
                ? 'flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-4 text-base font-semibold text-white transition hover:bg-green-700 active:scale-95'
                : 'flex w-full items-center justify-center gap-2 rounded-xl border-2 border-green-600 px-6 py-4 text-base font-semibold text-green-700 transition hover:bg-green-50'
        }
    >
        Check prijzen & beschikbaarheid
        <span aria-hidden="true" >→</span>
    </a >
    )
}