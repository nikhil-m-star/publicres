import { useState, useRef, useEffect } from 'react'
import { Upload, MapPin, X, Loader2, Navigation } from 'lucide-react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
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
    const [duplicateWarning, setDuplicateWarning] = useState(null)
    const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false)
    const fileRef = useRef(null)

    const createIssue = useCreateIssue()

    // Auto-detect user location on mount — ENFORCED: must be at the location
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
            { enableHighAccuracy: true, timeout: 15000 }
        )
    }, [])

    const fetchAddress = async (lat, lng) => {
        const result = await reverseGeocode(lat, lng)
        setAddress(result)
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
            { enableHighAccuracy: true, timeout: 15000 }
        )
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

    const submitFinal = async () => {
        const formData = new FormData()
        formData.append('title', title)
        formData.append('description', description)
        formData.append('category', category)
        formData.append('latitude', position[0])
        formData.append('longitude', position[1])
        if (address?.city) formData.append('city', address.city)
        if (address?.area) formData.append('area', address.area)
        if (imageFile) formData.append('image', imageFile)

        try {
            await createIssue.mutateAsync(formData)
            setTitle('')
            setDescription('')
            setCategory('')
            setDuplicateWarning(null)
            handleRelocate()
            removeImage()
            onSuccess?.()
        } catch (err) {
            console.error('Failed to create issue:', err)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!position) return alert('Location is required. Please allow location access.')

        // Bypass check if we already showed the warning and user clicked "Submit Anyway"
        if (duplicateWarning) {
            return submitFinal();
        }

        setIsCheckingDuplicate(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/issues/check-duplicate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    description,
                    city: address?.city || 'Bengaluru',
                    area: address?.area || '',
                })
            });
            const data = await res.json();

            if (data.isDuplicate) {
                setDuplicateWarning(data);
                setIsCheckingDuplicate(false);
                return; // halt submission
            }
        } catch (error) {
            console.error("Duplicate check failed, proceeding anyway", error);
        }

        setIsCheckingDuplicate(false);
        await submitFinal();
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

            {/* Location — GPS only (must be at the location) */}
            <div>
                <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium text-gray-700">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        Your Current Location
                    </label>
                    <button
                        type="button"
                        onClick={handleRelocate}
                        className="flex items-center gap-1 text-xs text-civic-600 hover:text-civic-700 font-medium transition-colors"
                    >
                        <Navigation className={`w-3.5 h-3.5 ${geoStatus === 'detecting' ? 'animate-pulse' : ''}`} />
                        Refresh location
                    </button>
                </div>

                {/* Status messages */}
                {geoStatus === 'detecting' && (
                    <div className="flex items-center gap-2 text-xs text-civic-600 bg-civic-50 px-3 py-2 rounded-lg mb-2">
                        <Navigation className="w-3.5 h-3.5 animate-pulse" />
                        Detecting your current location...
                    </div>
                )}
                {geoStatus === 'found' && address && (
                    <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 px-3 py-2.5 rounded-lg mb-2">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate font-medium">📍 {address.display}</span>
                    </div>
                )}
                {geoStatus === 'denied' && (
                    <div className="text-xs text-red-600 bg-red-50 px-3 py-2.5 rounded-lg mb-2">
                        <p className="font-medium mb-1">⚠️ Location access is required</p>
                        <p className="text-red-500">You must be physically present at the issue location to report it. Please enable location access in your browser settings and click "Refresh location".</p>
                    </div>
                )}
                {geoStatus === 'error' && (
                    <div className="text-xs text-red-600 bg-red-50 px-3 py-2.5 rounded-lg mb-2">
                        ❌ Your browser does not support geolocation. Please use a modern browser.
                    </div>
                )}

                <div className="h-56 rounded-xl overflow-hidden border border-gray-200 relative">
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
                        {position && <Marker position={position} />}
                        {flyTarget && <FlyToPosition position={flyTarget} />}
                    </MapContainer>
                    {/* Overlay to prevent manual interaction */}
                    {!position && (
                        <div className="absolute inset-0 z-[1000] bg-gray-900/20 backdrop-blur-[2px] flex items-center justify-center">
                            <div className="bg-white rounded-xl px-5 py-3 shadow-lg text-center">
                                <Navigation className="w-6 h-6 text-civic-500 mx-auto mb-2 animate-pulse" />
                                <p className="text-sm font-medium text-gray-700">Waiting for GPS...</p>
                                <p className="text-xs text-gray-400 mt-1">Please allow location access</p>
                            </div>
                        </div>
                    )}
                </div>

                {position && (
                    <p className="text-xs text-gray-400 mt-1.5">
                        Coordinates: {position[0].toFixed(6)}, {position[1].toFixed(6)}
                    </p>
                )}
            </div>

            {/* Duplicate Warning Prompt */}
            {duplicateWarning && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 animate-fade-in">
                    <div className="flex items-start gap-3">
                        <div className="text-orange-500 mt-0.5">⚠️</div>
                        <div>
                            <h4 className="text-sm font-semibold text-orange-800">Similar Issue Detected</h4>
                            <p className="text-sm text-orange-700 mt-1">
                                {duplicateWarning.reasoning || "An issue similar to this was recently reported."}
                            </p>
                            {duplicateWarning.matchedIssueId && (
                                <a
                                    href={`/issues/${duplicateWarning.matchedIssueId}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-sm font-medium text-orange-600 hover:text-orange-800 underline block mt-2"
                                >
                                    View existing issue to upvote instead
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Submit */}
            <button
                type="submit"
                disabled={createIssue.isPending || isCheckingDuplicate || !title || !description || !category || !position}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-colors ${duplicateWarning
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                    : "btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    }`}
            >
                {(createIssue.isPending || isCheckingDuplicate) ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {isCheckingDuplicate ? "Checking via AI..." : "Submitting..."}
                    </>
                ) : (
                    duplicateWarning ? 'Submit Anyway' : 'Report Issue'
                )}
            </button>

            {!position && geoStatus !== 'detecting' && (
                <p className="text-xs text-center text-red-500">
                    Location access is required to report issues. You must be at the issue location.
                </p>
            )}

            {createIssue.isError && (
                <p className="text-sm text-red-600 text-center">
                    Failed to submit. Please try again.
                </p>
            )}
        </form>
    )
}
