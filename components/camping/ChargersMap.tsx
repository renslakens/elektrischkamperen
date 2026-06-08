'use client'

import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { LaadpaalInBuurt } from '@/types/laadpaal'

const campingIcon = L.icon({
    iconUrl: '/marker-icon.png',
    iconRetinaUrl: '/marker-icon-2x.png',
    shadowUrl: '/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
})

const snelladerIcon = L.divIcon({
    className: '',
    html: `<div style="
    background:#f97316;border:2px solid white;
    width:14px;height:14px;border-radius:50%;
    box-shadow:0 1px 3px rgba(0,0,0,0.3)
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
})

const acLaderIcon = L.divIcon({
    className: '',
    html: `<div style="
    background:#3b82f6;border:2px solid white;
    width:12px;height:12px;border-radius:50%;
    box-shadow:0 1px 3px rgba(0,0,0,0.3)
    "></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
})

type Props = {
    laadpalen: LaadpaalInBuurt[]
    campingLat: number
    campingLng: number
    campingNaam: string
}

export function ChargersMap({ laadpalen, campingLat, campingLng, campingNaam }: Props) {
    const metLocatie = laadpalen.filter((l) => l.lat && l.lng)

    return (
        <div className="overflow-hidden rounded-xl border">
            <div className="flex items-center gap-4 border-b bg-gray-50 px-4 py-2 text-xs text-gray-600">
                <span className="flex items-center gap-1.5">
                    <span className="inline-block h-3 w-3 rounded-full bg-green-600" /> Camping
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="inline-block h-3 w-3 rounded-full bg-orange-500" /> Snellader
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="inline-block h-3 w-3 rounded-full bg-blue-500" /> AC lader
                </span>
            </div>

            <MapContainer
                center={[campingLat, campingLng]}
                zoom={12}
                className="h-64 w-full"
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Circle
                    center={[campingLat, campingLng]}
                    radius={10000}
                    pathOptions={{
                        color: '#16a34a',
                        fillColor: '#16a34a',
                        fillOpacity: 0.05,
                        weight: 1,
                    }}
                />

                <Marker position={[campingLat, campingLng]} icon={campingIcon}>
                    <Popup>
                        <p className="font-semibold">{campingNaam}</p>
                    </Popup>
                </Marker>

                {metLocatie.map((l) => (
                    <Marker
                        key={l.id}
                        position={[l.lat!, l.lng!]}
                        icon={l.is_snellader ? snelladerIcon : acLaderIcon}
                    >
                        <Popup>
                            <div className="text-sm">
                                <p className="font-semibold">{l.naam}</p>
                                <p className="text-gray-600">{l.netwerk}</p>
                                {l.max_kw && (
                                    <p className={l.is_snellader ? 'font-medium text-orange-600' : 'text-blue-600'}>
                                        {l.max_kw} kW
                                    </p>
                                )}
                                {l.afstand_km && (
                                    <p className="text-xs text-gray-400">{l.afstand_km} km van camping</p>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    )
}