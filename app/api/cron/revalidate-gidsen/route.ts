import { timingSafeEqual } from 'node:crypto'
import { revalidatePath, revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

// Dagelijkse cron (zie vercel.json): ververst de gids-tag zodat een ingeplande gids
// (gepubliceerd_op = vandaag) zichtbaar wordt zonder dat iemand iets in Sanity wijzigt.
// Vercel stuurt automatisch `Authorization: Bearer ${CRON_SECRET}` mee.

function isGeautoriseerd(req: NextRequest): boolean {
    const secret = process.env.CRON_SECRET
    if (!secret) return false

    const verwacht = Buffer.from(`Bearer ${secret}`)
    const ontvangen = Buffer.from(req.headers.get('authorization') ?? '')
    return ontvangen.length === verwacht.length && timingSafeEqual(ontvangen, verwacht)
}

export async function GET(req: NextRequest) {
    if (!isGeautoriseerd(req)) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    revalidateTag('gids', 'max')
    revalidatePath('/sitemap.xml')

    console.log('[cron] tag "gids" en /sitemap.xml ververst')

    return NextResponse.json({ revalidated: true, tags: ['gids'], paths: ['/sitemap.xml'] })
}
