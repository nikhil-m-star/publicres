import { useState, useRef } from 'react'
import { Upload, MapPin, X, Loader2 } from 'lucide-react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useCreateIssue } from '../hooks/useIssues'

// Fix default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

function LocationPicker({ position, setPosition }) {
    useMapEvents({
        click(e) {
            setPosition([e.latlng.lat, e.latlng.lng])
        },
    })
    return position ? <Marker position={position} /> : null
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
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const fileRef = useRef(null)

    const createIssue = useCreateIssue()

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
            // Reset
            setTitle('')
            setDescription('')
            setCategory('')
            setPosition(null)
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
                    placeholder="e.g., Large pothole on Main Street"
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
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Pin Location on Map
                </label>
                <div className="h-56 rounded-xl overflow-hidden border border-gray-200">
                    <MapContainer
                        center={[20.5937, 78.9629]}
                        zoom={5}
                        className="h-full w-full"
                        scrollWheelZoom={true}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LocationPicker position={position} setPosition={setPosition} />
                    </MapContainer>
                </div>
                {position && (
                    <p className="text-xs text-gray-400 mt-1">
                        📍 {position[0].toFixed(4)}, {position[1].toFixed(4)}
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
