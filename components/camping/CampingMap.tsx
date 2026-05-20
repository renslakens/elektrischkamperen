'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Link from 'next/link'
import type { AllCampingsQueryResult } from '@/sanity.types'

// Leaflet icon fix voor Next.js
const icon = L.icon({
    iconUrl: '/marker-icon.png',
    iconRetinaUrl: '/marker-icon-2x.png',
    shadowUrl: '/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
})

// Download deze icons naar /public:
// https://unpkg.com/leaflet@1.9.4/dist/images/

type Props = {
    campings: AllCampingsQueryResult
    activeCampingId: string | null
    onHover: (id: string | null) => void
}

export function CampingMap({ campings, activeCampingId, onHover }: Props) {
    const metLocatie = campings.filter(
        (c) => c.locatie?.lat && c.locatie?.lng
    )

    return (
        <MapContainer
            center={[46.5, 8.5]}
            zoom={5}
            className="h-full w-full rounded-xl"
            scrollWheelZoom={false}
        >
            <TileLayer
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {metLocatie.map((camping) => (
                <Marker
                    key={camping._id}
                    position={[camping.locatie!.lat!, camping.locatie!.lng!]}
                    icon={icon}
                    eventHandlers={{
                        mouseover: () => onHover(camping._id),
                        mouseout: () => onHover(null),
                    }}
                >
                    <Popup>
                        <div className="text-sm">
                            <p className="font-semibold">{camping.naam}</p>
                            {camping.aantal_laders && (
                                <p className="text-green-700">
                                    ⚡ {camping.aantal_laders}x {camping.laadsnelheid}
                                </p>
                            )}
                            <Link
                                href={`/campings/${camping.slug?.current}`}
                                className="mt-1 block text-blue-600 hover:underline"
                            >
                                Bekijk camping →
                            </Link>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    )
}