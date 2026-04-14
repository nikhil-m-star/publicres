import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useState, useEffect } from 'react'
import { Crosshair, ThumbsUp, MessageCircle } from 'lucide-react'
import { Geolocation } from '@capacitor/geolocation'

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
    REPORTED: createIcon('#00ffff'),
    IN_PROGRESS: createIcon('#00cccc'),
    RESOLVED: createIcon('#009999'),
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
        const fetchLocation = async () => {
            if (showControls) {
                try {
                    const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 8000 })
                    const loc = [pos.coords.latitude, pos.coords.longitude]
                    setUserPosition(loc)
                    setFlyTo(loc)
                } catch (e) {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                            (pos) => {
                                const loc = [pos.coords.latitude, pos.coords.longitude]
                                setUserPosition(loc)
                                setFlyTo(loc)
                            },
                            (err) => console.error('Geolocation error:', err)
                        )
                    } else {
                        console.error('Geolocation error:', e)
                    }
                }
            }
        }
        fetchLocation()
    }, [showControls])

    const handleLocateMe = async () => {
        setLocating(true)
        try {
            const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true })
            const loc = [pos.coords.latitude, pos.coords.longitude]
            setUserPosition(loc)
            setFlyTo([...loc])
        } catch (e) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        const loc = [pos.coords.latitude, pos.coords.longitude]
                        setUserPosition(loc)
                        setFlyTo([...loc])
                    },
                    (err) => console.error('Location failed', err)
                )
            } else {
                console.error('Location failed', e)
            }
        } finally {
            setLocating(false)
        }
    }

    const markers = issues.map((issue) => (
        <Marker
            key={issue.id}
            position={[issue.latitude, issue.longitude]}
            icon={statusIcons[issue.status] || statusIcons.REPORTED}
        >
            <Popup className="premium-popup">
                <div className="w-[240px] p-0 font-sans text-white">
                    {issue.imageUrl && (
                        <div className="relative">
                            <img
                                src={issue.imageUrl}
                                alt={issue.title}
                                className="w-full h-32 object-cover rounded-t-xl"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = `https://picsum.photos/seed/${issue.id}/400/300`;
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-t-xl" />
                        </div>
                    )}
                    <div className="p-3 bg-black/80 backdrop-blur-xl border-x border-b border-[var(--border-clean)] rounded-b-xl -mt-1 relative z-10">
                        <div className="flex items-center justify-between mb-1.5">
                            <h4 className="font-extrabold text-base text-white leading-tight truncate">{issue.title}</h4>
                            <span
                                className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest whitespace-nowrap shadow-[inset_0_0_10px_rgba(255,255,255,0.1)] ${
                                    issue.status === 'REPORTED'
                                    ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                    : issue.status === 'IN_PROGRESS'
                                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    }`}
                            >
                                {statusLabels[issue.status]}
                            </span>
                        </div>
                        <p className="text-sm text-[var(--text-dim)] mb-3 line-clamp-2 leading-relaxed">{issue.description}</p>
                        
                        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                            <span className="text-xs font-semibold text-[var(--text-muted)] bg-white/5 border border-white/5 px-2 py-1 rounded-md">{categoryLabels[issue.category]}</span>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-[var(--text-muted)] flex items-center gap-1 font-medium">
                                    <ThumbsUp className="w-3.5 h-3.5 text-[var(--glow)]" /> {issue.votes || 0}
                                </span>
                                <span className="text-xs text-[var(--text-muted)] flex items-center gap-1 font-medium">
                                    <MessageCircle className="w-3.5 h-3.5 text-[var(--glow)]" /> {issue._count?.comments || 0}
                                </span>
                            </div>
                        </div>
                        <Link
                            to={`/issues/${issue.id}`}
                            className="flex items-center justify-center w-full text-sm bg-white/10 border border-white/10 hover:border-[var(--glow)] hover:bg-[var(--glow)]/20 text-white font-bold py-2 rounded-xl transition-all shadow-[0_0_15px_rgba(0,255,255,0)] hover:shadow-[0_0_15px_rgba(0,255,255,0.2)] active:scale-95"
                        >
                            View Report
                        </Link>
                    </div>
                </div>
            </Popup>
        </Marker>
    ))

    return (
        <div style={{ height }} className="rounded-3xl overflow-hidden border border-[var(--border-glass)] shadow-2xl relative bg-black/50">
            <MapContainer center={center} zoom={zoom} className="h-full w-full z-0" scrollWheelZoom={true}>
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
                                <p className="text-sm font-medium">Your Location</p>
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
                <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
                    <button
                        onClick={handleLocateMe}
                        disabled={locating}
                        className="panel glass !bg-black/60 hover:!bg-black/80 p-3 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-[var(--border-clean)] transition-all hover:border-[var(--glow)]/50 active:scale-95"
                        title="Find my location"
                    >
                        <Crosshair className={`w-5 h-5 text-[var(--glow)] ${locating ? 'animate-spin opacity-50' : ''}`} />
                    </button>
                </div>
            )}

            {/* Legend */}
            {showLegend && (
                <div className="absolute bottom-6 left-6 z-[400] panel glass !bg-black/80 backdrop-blur-xl rounded-2xl p-4 shadow-[0_12px_40px_rgba(0,255,255,0.05)] border border-[var(--border-clean)]">
                    <p className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--glow)] shadow-[0_0_8px_rgba(0,255,255,0.6)] animate-pulse"></span>
                        Live Status
                    </p>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                        {[
                            { color: '#00ffff', label: 'Reported', glow: 'rgba(0,180,255,0.4)', bg: 'rgba(0,255,255,0.1)', border: 'rgba(0,255,255,0.2)' },
                            { color: '#fbbf24', label: 'In Progress', glow: 'rgba(251,191,36,0.4)', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)' },
                            { color: '#10b981', label: 'Resolved', glow: 'rgba(16,185,129,0.4)', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)' },
                        ].map((s) => (
                            <div key={s.label} className="flex items-center gap-2 py-1.5 px-3 rounded-xl border transition-colors backdrop-blur-sm" style={{ backgroundColor: s.bg, borderColor: s.border }}>
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ background: s.color, border: '1.5px solid rgba(0,0,0,0.5)', boxShadow: `0 0 10px ${s.glow}` }}
                                />
                                <span className="text-[12px] font-bold text-white tracking-wide">{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
