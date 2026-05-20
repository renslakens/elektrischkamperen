import { ImageResponse } from 'next/og'
import { type NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const titel = searchParams.get('titel') ?? 'Elektrisch Kamperen'

    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(135deg, #14532d, #166534)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '60px',
                }}
            >
                <div style={{ fontSize: 48, color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                    ⚡ {titel}
                </div>
                <div style={{ fontSize: 24, color: '#86efac', marginTop: 20 }}>
                    elektrischkamperen.nl
                </div>
            </div>
        ),
        { width: 1200, height: 630 }
    )
}