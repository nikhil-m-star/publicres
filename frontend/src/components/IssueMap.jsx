import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useState, useEffect } from 'react'
import { Crosshair, ThumbsUp, MessageCircle } from 'lucide-react'

// Bengaluru center coordinates
export const BENGALURU_CENTER = [12.9716, 77.5946]
export const BENGALURU_ZOOM = 12

// Custom colored markers
const createIcon = (color) =>
    new L.DivIcon({
        className: 'custom-marker',
        html: `<div style="
      width: 28px; height: 28px; border-radius: 50% 50% 50% 0;
      background: ${color}; transform: rotate(-45deg);
      border: 3px solid white; box-shadow: 0 3px 10px rgba(0,0,0,0.3);
    "><div style="
      width: 10px; height: 10px; border-radius: 50%;
      background: white; position: absolute;
      top: 50%; left: 50%; transform: translate(-50%, -50%);
    "></div></div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28],
    })

const userIcon = new L.DivIcon({
    className: 'custom-marker',
    html: `<div style="
    width: 20px; height: 20px; border-radius: 50%;
    background: #3b82f6; border: 4px solid white;
    box-shadow: 0 0 0 3px rgba(59,130,246,0.3), 0 2px 8px rgba(0,0,0,0.3);
  "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
})

const statusIcons = {
    REPORTED: createIcon('#ef4444'),
    IN_PROGRESS: createIcon('#f59e0b'),
    RESOLVED: createIcon('#22c55e'),
}

const statusLabels = {
    REPORTED: 'Reported',
    IN_PROGRESS: 'In Progress',
    RESOLVED: 'Resolved',
}

const categoryLabels = {
    POTHOLE: 'Pothole',
    GARBAGE: 'Garbage',
    STREETLIGHT: 'Streetlight',
    WATER_LEAK: 'Water Leak',
    OTHER: 'Other',
}

// Custom cluster icon
const createClusterIcon = (cluster) => {
    const count = cluster.getChildCount()
    let size = 'small'
    if (count >= 10) size = 'medium'
    if (count >= 30) size = 'large'

    const sizeMap = { small: 36, medium: 44, large: 52 }
    const colorMap = { small: '#3b82f6', medium: '#f59e0b', large: '#ef4444' }

    return new L.DivIcon({
        html: `<div style="
      width: ${sizeMap[size]}px; height: ${sizeMap[size]}px; border-radius: 50%;
      background: ${colorMap[size]}; color: white; display: flex;
      align-items: center; justify-content: center; font-weight: 700;
      font-size: ${size === 'large' ? '16' : '14'}px; font-family: Inter, sans-serif;
      border: 3px solid white; box-shadow: 0 3px 12px rgba(0,0,0,0.25);
    ">${count}</div>`,
        className: 'custom-cluster-icon',
        iconSize: [sizeMap[size], sizeMap[size]],
    })
}

// Reverse geocode using Nominatim (free, no API key needed)
export async function reverseGeocode(lat, lng) {
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`,
            { headers: { 'Accept-Language': 'en' } }
        )
        const data = await res.json()
        const addr = data.address || {}
        const area = addr.suburb || addr.neighbourhood || addr.village || addr.town || addr.city_district || ''
        const road = addr.road || ''
        const city = addr.city || addr.state_district || 'Bengaluru'
        const display = [road, area, city].filter(Boolean).join(', ')
        return { display, area, road, city, raw: data }
    } catch {
        return { display: `${lat.toFixed(4)}, ${lng.toFixed(4)}`, area: '', road: '', city: '' }
    }
}

// Component to fly to user location
function FlyToLocation({ position }) {
    const map = useMap()
    useEffect(() => {
        if (position) {
            map.flyTo(position, 15, { duration: 1.5 })
        }
    }, [position, map])
    return null
}

export default function IssueMap({
    issues = [],
    center = BENGALURU_CENTER,
    zoom = BENGALURU_ZOOM,
    height = '400px',
    showControls = false,
    showLegend = true,
    enableClustering = true,
}) {
    const [userPosition, setUserPosition] = useState(null)
    const [locating, setLocating] = useState(false)
    const [flyTo, setFlyTo] = useState(null)

    // Auto-detect location on mount when controls are shown
    useEffect(() => {
        if (showControls && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const loc = [pos.coords.latitude, pos.coords.longitude]
                    setUserPosition(loc)
                    setFlyTo(loc)
                },
                () => { },
                { enableHighAccuracy: true, timeout: 8000 }
            )
        }
    }, [showControls])

    const handleLocateMe = () => {
        if (!navigator.geolocation) return
        setLocating(true)
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const loc = [pos.coords.latitude, pos.coords.longitude]
                setUserPosition(loc)
                setFlyTo([...loc])
                setLocating(false)
            },
            () => setLocating(false),
            { enableHighAccuracy: true }
        )
    }

    const markers = issues.map((issue) => (
        <Marker
            key={issue.id}
            position={[issue.latitude, issue.longitude]}
            icon={statusIcons[issue.status] || statusIcons.REPORTED}
        >
            <Popup>
                <div className="min-w-[200px] p-1">
                    {issue.imageUrl && (
                        <img
                            src={issue.imageUrl}
                            alt={issue.title}
                            className="w-full h-24 object-cover rounded-lg mb-2"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://picsum.photos/seed/${issue.id}/400/300`;
                            }}
                        />
                    )}
                    <h4 className="font-semibold text-sm mb-0.5">{issue.title}</h4>
                    <p className="text-xs text-gray-500 mb-2 line-clamp-2">{issue.description}</p>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-400">{categoryLabels[issue.category]}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span
                                className={`text-xs font-medium px-2 py-0.5 rounded-full ${issue.status === 'REPORTED'
                                    ? 'bg-red-100 text-red-700'
                                    : issue.status === 'IN_PROGRESS'
                                        ? 'bg-amber-100 text-amber-700'
                                        : 'bg-emerald-100 text-emerald-700'
                                    }`}
                            >
                                {statusLabels[issue.status]}
                            </span>
                            <span className="text-xs text-gray-400 flex items-center gap-0.5">
                                <ThumbsUp className="w-3 h-3" /> {issue.votes || 0}
                            </span>
                            <span className="text-xs text-gray-400 flex items-center gap-0.5">
                                <MessageCircle className="w-3 h-3" /> {issue._count?.comments || 0}
                            </span>
                        </div>
                    </div>
                    <Link
                        to={`/issues/${issue.id}`}
                        className="block mt-2 text-center text-xs bg-civic-50 text-civic-700 hover:bg-civic-100 font-semibold py-1.5 rounded-lg transition-colors"
                    >
                        View Details →
                    </Link>
                </div>
            </Popup>
        </Marker>
    ))

    return (
        <div style={{ height }} className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm relative">
            <MapContainer center={center} zoom={zoom} className="h-full w-full" scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {flyTo && <FlyToLocation position={flyTo} />}

                {enableClustering ? (
                    <MarkerClusterGroup
                        chunkedLoading
                        iconCreateFunction={createClusterIcon}
                        maxClusterRadius={50}
                        spiderfyOnMaxZoom
                        showCoverageOnHover={false}
                    >
                        {markers}
                    </MarkerClusterGroup>
                ) : (
                    markers
                )}

                {userPosition && (
                    <>
                        <Marker position={userPosition} icon={userIcon}>
                            <Popup>
                                <p className="text-sm font-medium">📍 Your Location</p>
                            </Popup>
                        </Marker>
                        <Circle
                            center={userPosition}
                            radius={2000}
                            pathOptions={{
                                color: '#3b82f6',
                                fillColor: '#3b82f6',
                                fillOpacity: 0.08,
                                weight: 1,
                            }}
                        />
                    </>
                )}
            </MapContainer>

            {/* Controls overlay */}
            {showControls && (
                <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
                    <button
                        onClick={handleLocateMe}
                        disabled={locating}
                        className="bg-white hover:bg-gray-50 p-2.5 rounded-xl shadow-lg border border-gray-200 transition-all hover:shadow-xl"
                        title="Find my location"
                    >
                        <Crosshair className={`w-5 h-5 text-civic-600 ${locating ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            )}

            {/* Legend */}
            {showLegend && (
                <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg border border-gray-100">
                    <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Status</p>
                    <div className="flex items-center gap-3">
                        {[
                            { color: '#ef4444', label: 'Reported' },
                            { color: '#f59e0b', label: 'In Progress' },
                            { color: '#22c55e', label: 'Resolved' },
                        ].map((s) => (
                            <div key={s.label} className="flex items-center gap-1">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ background: s.color, border: '2px solid white', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
                                />
                                <span className="text-[11px] text-gray-600">{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
