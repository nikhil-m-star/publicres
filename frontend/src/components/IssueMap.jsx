import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Custom colored markers
const createIcon = (color) =>
    new L.DivIcon({
        className: 'custom-marker',
        html: `<div style="
      width: 28px; height: 28px; border-radius: 50% 50% 50% 0;
      background: ${color}; transform: rotate(-45deg);
      border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    "><div style="
      width: 10px; height: 10px; border-radius: 50%;
      background: white; position: absolute;
      top: 50%; left: 50%; transform: translate(-50%, -50%);
    "></div></div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28],
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

export default function IssueMap({ issues = [], center = [20.5937, 78.9629], zoom = 5, height = '400px' }) {
    return (
        <div style={{ height }} className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
            <MapContainer center={center} zoom={zoom} className="h-full w-full" scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {issues.map((issue) => (
                    <Marker
                        key={issue.id}
                        position={[issue.latitude, issue.longitude]}
                        icon={statusIcons[issue.status] || statusIcons.REPORTED}
                    >
                        <Popup>
                            <div className="min-w-[180px]">
                                <h4 className="font-semibold text-sm mb-1">{issue.title}</h4>
                                <p className="text-xs text-gray-500 mb-2 line-clamp-2">{issue.description}</p>
                                <div className="flex items-center justify-between">
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
                                    <Link
                                        to={`/issues/${issue.id}`}
                                        className="text-xs text-civic-600 hover:text-civic-700 font-medium"
                                    >
                                        View →
                                    </Link>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    )
}
