import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')
    const radius = searchParams.get('radius') ?? '5'

    if (!lat || !lng) {
        return NextResponse.json({ error: 'lat en lng zijn verplicht' }, { status: 400 })
    }

    const params = new URLSearchParams({
        key: process.env.OCM_API_KEY!,
        output: 'json',
        latitude: lat,
        longitude: lng,
        distance: radius,
        distanceunit: 'km',
        maxresults: '20',
        statustype: '50',        // Operational
        compact: 'true',
        verbose: 'false',
    })

    try {
        const res = await fetch(
            `https://api.openchargemap.io/v3/poi?${params}`,
            { next: { revalidate: 86400 } } // cache 24 uur
        )

        if (!res.ok) throw new Error(`OCM API error: ${res.status}`)

        const data = await res.json()

        // Normaliseer de data naar wat we nodig hebben
        const laadpalen = data.map((item: OCMPoi) => ({
            id: item.ID,
            naam: item.AddressInfo?.Title ?? 'Onbekend',
            afstand_km: item.AddressInfo?.Distance
                ? Math.round(item.AddressInfo.Distance * 10) / 10
                : null,
            netwerk: item.OperatorInfo?.Title ?? 'Onbekend',
            max_kw: item.Connections
                ? Math.max(...item.Connections.map((c: OCMConnection) => c.PowerKW ?? 0))
                : null,
            connector_types: item.Connections
                ? [...new Set(item.Connections.map((c: OCMConnection) =>
                    c.ConnectionType?.Title ?? 'Onbekend'
                ))]
                : [],
            aantal_punten: item.NumberOfPoints ?? null,
            lat: item.AddressInfo?.Latitude ?? null,
            lng: item.AddressInfo?.Longitude ?? null,
            is_snellader: item.Connections
                ? item.Connections.some((c: OCMConnection) => (c.PowerKW ?? 0) >= 50)
                : false,
        }))

        return NextResponse.json(laadpalen)
    } catch (err) {
        console.error('[OCM API]', err)
        return NextResponse.json({ error: 'Ophalen mislukt' }, { status: 500 })
    }
}

// Types voor OCM response
type OCMConnection = {
    PowerKW?: number
    ConnectionType?: { Title: string }
}

type OCMPoi = {
    ID: number
    AddressInfo?: {
        Title: string
        Distance: number
        Latitude: number
        Longitude: number
    }
    OperatorInfo?: { Title: string }
    Connections?: OCMConnection[]
    NumberOfPoints?: number
}