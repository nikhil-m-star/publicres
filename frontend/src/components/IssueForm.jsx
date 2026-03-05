import { useState, useRef, useEffect } from 'react'
import { Upload, MapPin, X, Loader2, Crosshair, Navigation, MapPinned } from 'lucide-react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useCreateIssue } from '../hooks/useIssues'
import { BENGALURU_CENTER, reverseGeocode } from './IssueMap'

// Fix default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

function LocationPicker({ position, setPosition, onLocationPicked }) {
    useMapEvents({
        click(e) {
            const loc = [e.latlng.lat, e.latlng.lng]
            setPosition(loc)
            onLocationPicked?.(loc)
        },
    })
    return position ? <Marker position={position} /> : null
}

// Fly the map to a given position
function FlyToPosition({ position }) {
    const map = useMap()
    useEffect(() => {
        if (position) {
            map.flyTo(position, 16, { duration: 1.2 })
        }
    }, [position, map])
    return null
}

const categories = [
    { value: 'POTHOLE', label: '🕳️ Pothole' },
    { value: 'GARBAGE', label: '🗑️ Garbage' },
    { value: 'STREETLIGHT', label: '💡 Streetlight' },
    { value: 'WATER_LEAK', label: '💧 Water Leak' },
    { value: 'OTHER', label: '📋 Other' },
]

// Key Bengaluru areas for quick selection
const bengaluruAreas = [
    { name: 'Koramangala', lat: 12.9352, lng: 77.6245 },
    { name: 'Indiranagar', lat: 12.9784, lng: 77.6408 },
    { name: 'Jayanagar', lat: 12.9308, lng: 77.5838 },
    { name: 'Whitefield', lat: 12.9698, lng: 77.7500 },
    { name: 'HSR Layout', lat: 12.9116, lng: 77.6474 },
    { name: 'BTM Layout', lat: 12.9166, lng: 77.6101 },
    { name: 'Marathahalli', lat: 12.9591, lng: 77.6974 },
    { name: 'Electronic City', lat: 12.8399, lng: 77.6770 },
    { name: 'Rajajinagar', lat: 12.9900, lng: 77.5523 },
    { name: 'Malleshwaram', lat: 13.0035, lng: 77.5685 },
    { name: 'Banashankari', lat: 12.9255, lng: 77.5468 },
    { name: 'JP Nagar', lat: 12.9063, lng: 77.5857 },
    { name: 'Hebbal', lat: 13.0358, lng: 77.5970 },
    { name: 'Yelahanka', lat: 13.1007, lng: 77.5963 },
    { name: 'Basavanagudi', lat: 12.9422, lng: 77.5757 },
    { name: 'MG Road', lat: 12.9756, lng: 77.6068 },
    { name: 'Brigade Road', lat: 12.9716, lng: 77.6070 },
    { name: 'Sadashivanagar', lat: 13.0070, lng: 77.5800 },
    { name: 'RT Nagar', lat: 13.0210, lng: 77.5970 },
    { name: 'Bommanahalli', lat: 12.9010, lng: 77.6190 },
]

export default function IssueForm({ onSuccess }) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    const [position, setPosition] = useState(null)
    const [flyTarget, setFlyTarget] = useState(null)
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [geoStatus, setGeoStatus] = useState('detecting')
    const [address, setAddress] = useState(null)
    const [showAreaPicker, setShowAreaPicker] = useState(false)
    const fileRef = useRef(null)

    const createIssue = useCreateIssue()

    // Auto-detect user location on mount
    useEffect(() => {
        if (!navigator.geolocation) {
            setGeoStatus('error')
            return
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const loc = [pos.coords.latitude, pos.coords.longitude]
                setPosition(loc)
                setFlyTarget(loc)
                setGeoStatus('found')
                fetchAddress(loc[0], loc[1])
            },
            () => setGeoStatus('denied'),
            { enableHighAccuracy: true, timeout: 10000 }
        )
    }, [])

    const fetchAddress = async (lat, lng) => {
        const result = await reverseGeocode(lat, lng)
        setAddress(result)
    }

    const handleLocationPicked = (loc) => {
        fetchAddress(loc[0], loc[1])
    }

    const handleRelocate = () => {
        setGeoStatus('detecting')
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const loc = [pos.coords.latitude, pos.coords.longitude]
                setPosition(loc)
                setFlyTarget([...loc])
                setGeoStatus('found')
                fetchAddress(loc[0], loc[1])
            },
            () => setGeoStatus('denied'),
            { enableHighAccuracy: true, timeout: 10000 }
        )
    }

    const handleAreaSelect = (area) => {
        const loc = [area.lat, area.lng]
        setPosition(loc)
        setFlyTarget([...loc])
        setGeoStatus('found')
        setAddress({ display: `${area.name}, Bengaluru`, area: area.name, city: 'Bengaluru' })
        setShowAreaPicker(false)
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImageFile(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const removeImage = () => {
        setImageFile(null)
        setImagePreview(null)
        if (fileRef.current) fileRef.current.value = ''
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!position) return alert('Please select a location on the map')

        const formData = new FormData()
        formData.append('title', title)
        formData.append('description', description)
        formData.append('category', category)
        formData.append('latitude', position[0])
        formData.append('longitude', position[1])
        if (imageFile) formData.append('image', imageFile)

        try {
            await createIssue.mutateAsync(formData)
            setTitle('')
            setDescription('')
            setCategory('')
            setPosition(null)
            setAddress(null)
            removeImage()
            onSuccess?.()
        } catch (err) {
            console.error('Failed to create issue:', err)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Issue Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Large pothole on 80 Feet Road, Koramangala"
                    className="input-field"
                    required
                />
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the issue in detail..."
                    rows={3}
                    className="input-field resize-none"
                    required
                />
            </div>

            {/* Category */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.value}
                            type="button"
                            onClick={() => setCategory(cat.value)}
                            className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${category === cat.value
                                    ? 'bg-civic-50 border-civic-300 text-civic-700 ring-2 ring-civic-200'
                                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Image Upload */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Photo (optional)</label>
                {imagePreview ? (
                    <div className="relative rounded-xl overflow-hidden">
                        <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover" />
                        <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="w-full py-8 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-civic-300 hover:text-civic-500 transition-colors flex flex-col items-center gap-2"
                    >
                        <Upload className="w-6 h-6" />
                        <span className="text-sm">Click to upload an image</span>
                    </button>
                )}
                <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                />
            </div>

            {/* Map Location */}
            <div>
                <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium text-gray-700">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        Location — Bengaluru
                    </label>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setShowAreaPicker(!showAreaPicker)}
                            className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 font-medium transition-colors"
                        >
                            <MapPinned className="w-3.5 h-3.5" />
                            Pick area
                        </button>
                        <button
                            type="button"
                            onClick={handleRelocate}
                            className="flex items-center gap-1 text-xs text-civic-600 hover:text-civic-700 font-medium transition-colors"
                        >
                            <Crosshair className={`w-3.5 h-3.5 ${geoStatus === 'detecting' ? 'animate-spin' : ''}`} />
                            {geoStatus === 'detecting' ? 'Detecting...' : 'My location'}
                        </button>
                    </div>
                </div>

                {/* Bengaluru area quick picker */}
                {showAreaPicker && (
                    <div className="mb-2 p-3 bg-gray-50 rounded-xl animate-fade-in">
                        <p className="text-xs font-semibold text-gray-500 mb-2">Quick select a Bengaluru area:</p>
                        <div className="flex flex-wrap gap-1.5">
                            {bengaluruAreas.map((area) => (
                                <button
                                    key={area.name}
                                    type="button"
                                    onClick={() => handleAreaSelect(area)}
                                    className="px-2.5 py-1 text-xs font-medium bg-white border border-gray-200 rounded-lg hover:border-civic-300 hover:bg-civic-50 hover:text-civic-700 transition-all"
                                >
                                    {area.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Status messages */}
                {geoStatus === 'detecting' && !position && (
                    <div className="flex items-center gap-2 text-xs text-civic-600 bg-civic-50 px-3 py-2 rounded-lg mb-2">
                        <Navigation className="w-3.5 h-3.5 animate-pulse" />
                        Detecting your location in Bengaluru...
                    </div>
                )}
                {geoStatus === 'found' && address && (
                    <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg mb-2">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">📍 {address.display} — Tap map to adjust</span>
                    </div>
                )}
                {geoStatus === 'denied' && !position && (
                    <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg mb-2">
                        ⚠️ Location denied. Pick an area above or tap the map.
                    </div>
                )}

                <div className="h-64 rounded-xl overflow-hidden border border-gray-200 relative">
                    <MapContainer
                        center={position || BENGALURU_CENTER}
                        zoom={position ? 16 : 12}
                        className="h-full w-full"
                        scrollWheelZoom={true}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LocationPicker position={position} setPosition={setPosition} onLocationPicked={handleLocationPicked} />
                        {flyTarget && <FlyToPosition position={flyTarget} />}
                    </MapContainer>
                </div>

                {position && (
                    <p className="text-xs text-gray-400 mt-1.5">
                        📍 {address?.display || `${position[0].toFixed(4)}, ${position[1].toFixed(4)}`}
                    </p>
                )}
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={createIssue.isPending || !title || !description || !category || !position}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {createIssue.isPending ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                    </>
                ) : (
                    'Report Issue'
                )}
            </button>

            {createIssue.isError && (
                <p className="text-sm text-red-600 text-center">
                    Failed to submit. Please try again.
                </p>
            )}
        </form>
    )
}
