import { useEffect, useState, useMemo } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import the entire map implementation to avoid SSR issues with hooks and Leaflet
const ClientMap = dynamic(async () => {
    const { MapContainer, TileLayer, Marker, Popup, useMap } = await import('react-leaflet')
    const L = (await import('leaflet')).default
    
    // Fix leaflet icons
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });

    const ChangeView = ({ center, zoom }: { center: [number, number], zoom: number }) => {
      const map = useMap()
      useEffect(() => {
        if (map && center[0] && center[1] && !isNaN(center[0]) && !isNaN(center[1])) {
          map.setView(center, zoom)
        }
      }, [center, zoom, map])
      return null
    }

    return ({ latitude, longitude, address, zoom, height }: MapDisplayProps) => {
      // Ensure coordinates are numbers and valid
      const lat = typeof latitude === 'string' ? parseFloat(latitude) : latitude;
      const lng = typeof longitude === 'string' ? parseFloat(longitude) : longitude;
      
      const safeCenter = useMemo<[number, number]>(() => {
        const defaultLat = 12.9716; // Default Bangalore lat
        const defaultLng = 77.5946; // Default Bangalore lng
        return [
          (typeof lat === 'number' && !isNaN(lat)) ? lat : defaultLat,
          (typeof lng === 'number' && !isNaN(lng)) ? lng : defaultLng
        ];
      }, [lat, lng]);

      return (
        <MapContainer 
          center={safeCenter} 
          zoom={zoom || 15} 
          scrollWheelZoom={false} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={safeCenter}>
            {address && (
              <Popup>
                {address}
              </Popup>
            )}
          </Marker>
          <ChangeView center={safeCenter} zoom={zoom || 15} />
        </MapContainer>
      )
    }
}, { 
    ssr: false,
    loading: () => <div className="bg-gray-100 animate-pulse rounded-md w-full h-full" />
})

interface MapDisplayProps {
  latitude: number | string
  longitude: number | string
  address?: string
  zoom?: number
  height?: string
}

export function MapDisplay(props: MapDisplayProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <div style={{ height: props.height || "300px" }} className="bg-gray-100 animate-pulse rounded-md w-full" />
  }

  return (
    <div className="rounded-md overflow-hidden border border-gray-200" style={{ height: props.height || "300px" }}>
      <ClientMap {...props} />
    </div>
  )
}
