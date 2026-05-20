import type { PortableTextComponentProps } from '@portabletext/react'
import type { GidsBySlugQueryResult } from '@/sanity.types'

type BodyBlock = NonNullable<NonNullable<GidsBySlugQueryResult>['body']>[number]
type ChecklistValue = Extract<BodyBlock, { _type: 'checklist' }>
type ChecklistItem = NonNullable<NonNullable<ChecklistValue['items']>[number]>

export function ChecklistBlock({ value }: PortableTextComponentProps<ChecklistValue>) {
    const { titel, items } = value

    return (
        <div className="my-8 rounded-xl border bg-amber-50 p-6">
            <h3 className="mb-4 font-bold text-gray-900">
                ✓ {titel ?? 'Checklist'}
            </h3>
            <ul className="space-y-2">
                {items?.map((item: ChecklistItem, i: number) => (
                    <li key={i} className="flex items-center gap-3">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-green-500 text-xs text-green-600">
                            ✓
                        </span>
                        {item.affiliate_url ? (
                            <a
                                href={item.affiliate_url}
                                target="_blank"
                                rel="noopener noreferrer sponsored"
                                className="text-green-700 underline underline-offset-2 hover:text-green-900"
                            >
                                {item.label}
                            </a>
                        ) : (
                            <span className="text-gray-700">{item.label}</span>
                        )}
                    </li>
                ))}
            </ul>
        </div >
    )
}