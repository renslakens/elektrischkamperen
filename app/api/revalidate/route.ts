import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

// Mapping: welk Sanity type → welke tags busten
const REVALIDATION_MAP: Record<string, string[]> = {
    route: ['route'],
    etappe: ['etappe', 'route', 'gids'],
    camping: ['camping', 'etappe', 'route', 'gids'],
    laadpaal: ['laadpaal', 'etappe', 'route'],
    gids: ['gids'],
}

export async function POST(req: NextRequest) {
    try {
        const { isValidSignature, body } = await parseBody<{
            _type: string
            slug?: { current: string }
        }>(req, process.env.SANITY_WEBHOOK_SECRET)

        if (!isValidSignature) {
            return NextResponse.json({ message: 'Invalid signature' }, { status: 401 })
        }

        const documentType = body?._type
        if (!documentType) {
            return NextResponse.json({ message: 'Missing _type' }, { status: 400 })
        }

        const tagsToRevalidate = REVALIDATION_MAP[documentType]
        if (!tagsToRevalidate) {
            return NextResponse.json({ message: `Type "${documentType}" niet beheerd` })
        }

        tagsToRevalidate.forEach((tag) => revalidateTag(tag, 'max'))

        console.log(`[revalidate] type="${documentType}" tags=[${tagsToRevalidate.join(', ')}]`)

        return NextResponse.json({
            revalidated: true,
            type: documentType,
            tags: tagsToRevalidate,
        })
    } catch (err) {
        console.error('[revalidate] fout:', err)
        return NextResponse.json({ message: 'Interne fout' }, { status: 500 })
    }
}