"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Navigation } from 'lucide-react'
import { MapDisplay } from './map-display'

interface LocationData {
  latitude: number
  longitude: number
  address?: string
  timestamp: Date
}

export function LocationTracker({ 
  onLocationUpdate 
}: { 
  onLocationUpdate?: (location: LocationData) => void 
}) {
  const [location, setLocation] = useState<LocationData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tracking, setTracking] = useState(false)

  const getCurrentLocation = () => {
    setLoading(true)
    setError(null)

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: new Date(),
        }

        // Get address from coordinates using Google Geocoding API
        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${locationData.latitude},${locationData.longitude}&key=${process.env.GOOGLE_MAPS_API_KEY}`
          )
          const data = await response.json()
          if (data.results && data.results[0]) {
            locationData.address = data.results[0].formatted_address
          }
        } catch (err) {
          console.error('Error getting address:', err)
        }

        setLocation(locationData)
        setLoading(false)
        
        if (onLocationUpdate) {
          onLocationUpdate(locationData)
        }
      },
      (error) => {
        setError(error.message)
        setLoading(false)
      }
    )
  }

  const startTracking = () => {
    setTracking(true)
    getCurrentLocation()
    // Update location every 5 minutes
    const interval = setInterval(getCurrentLocation, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }

  const stopTracking = () => {
    setTracking(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Real-Time Location Tracking
        </CardTitle>
        <CardDescription>
          Track pet's current location in real-time
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={getCurrentLocation} 
            disabled={loading}
            variant="outline"
            className="flex-1"
          >
            <Navigation className="h-4 w-4 mr-2" />
            {loading ? 'Getting Location...' : 'Get Current Location'}
          </Button>
          
          {!tracking ? (
            <Button onClick={startTracking} className="flex-1">
              Start Tracking
            </Button>
          ) : (
            <Button onClick={stopTracking} variant="destructive" className="flex-1">
              Stop Tracking
            </Button>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
            {error}
          </div>
        )}

        {location && (
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">Current Location</p>
                  {location.address && (
                    <p className="text-sm text-blue-700 mt-1">{location.address}</p>
                  )}
                  <p className="text-xs text-blue-600 mt-2">
                    Lat: {location.latitude?.toFixed(6) || '0'}, Lng: {location.longitude?.toFixed(6) || '0'}
                  </p>
                  <p className="text-xs text-blue-500 mt-1">
                    Updated: {new Date(location.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Leaflet Map Display */}
            <MapDisplay 
              latitude={location.latitude} 
              longitude={location.longitude} 
              address={location.address}
            />

            <a
              href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
            >
              <MapPin className="h-3 w-3" />
              Open in Google Maps
            </a>
          </div>
        )}

        {tracking && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-700">
              🟢 Live tracking active - Location updates every 5 minutes
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
