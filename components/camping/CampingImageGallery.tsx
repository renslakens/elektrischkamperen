import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import type { CampingBySlugQueryResult } from '@/sanity.types'

type SanityImage = NonNullable<NonNullable<CampingBySlugQueryResult>['afbeeldingen']>[number]

type Props = { afbeeldingen: SanityImage[] }

export function CampingImageGallery({ afbeeldingen }: Props) {
    if (!afbeeldingen?.length) return null
    const [hoofd, ...rest] = afbeeldingen

    return (
        <div className="grid gap-2 sm:grid-cols-3">
            <div className="sm:col-span-2">
                <Image
                    src={urlFor(hoofd).width(800).height(500).url()}
                    alt="Camping foto"
                    width={800}
                    height={500}
                    className="h-64 w-full rounded-xl object-cover sm:h-80"
                    priority
                />
            </div>
            <div className="hidden flex-col gap-2 sm:flex">
                {rest.slice(0, 2).map((img, i) => (
                    <Image
                        key={i}
                        src={urlFor(img).width(400).height(240).url()}
                        alt={`Camping foto ${i + 2}`}
                        width={400}
                        height={240}
                        className="h-[calc(50%-4px)] w-full rounded-xl object-cover"
                    />
                ))}
            </div>
        </div>
    )
}