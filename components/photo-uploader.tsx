"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Camera, Upload, X, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

interface PhotoUploaderProps {
  onPhotosChange?: (photos: string[]) => void
  maxPhotos?: number
  existingPhotos?: string[]
}

export function PhotoUploader({ 
  onPhotosChange, 
  maxPhotos = 5,
  existingPhotos = []
}: PhotoUploaderProps) {
  const [photos, setPhotos] = useState<string[]>(existingPhotos)
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (photos.length + files.length > maxPhotos) {
      alert(`Maximum ${maxPhotos} photos allowed`)
      return
    }

    setUploading(true)

    try {
      const newPhotos: string[] = []
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // Convert to base64 for demo (in production, upload to cloud storage)
        const reader = new FileReader()
        const base64 = await new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string)
          reader.readAsDataURL(file)
        })
        
        newPhotos.push(base64)
      }

      const updatedPhotos = [...photos, ...newPhotos]
      setPhotos(updatedPhotos)
      
      if (onPhotosChange) {
        onPhotosChange(updatedPhotos)
      }
    } catch (error) {
      console.error('Error uploading photos:', error)
      alert('Failed to upload photos')
    } finally {
      setUploading(false)
    }
  }

  const removePhoto = (index: number) => {
    const updatedPhotos = photos.filter((_, i) => i !== index)
    setPhotos(updatedPhotos)
    
    if (onPhotosChange) {
      onPhotosChange(updatedPhotos)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Daily Photo Updates
        </CardTitle>
        <CardDescription>
          Upload photos of the pet ({photos.length}/{maxPhotos})
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {photos.length < maxPhotos && (
          <div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
              id="photo-upload"
              disabled={uploading}
            />
            <label htmlFor="photo-upload">
              <Button 
                type="button"
                variant="outline" 
                className="w-full"
                disabled={uploading}
                onClick={() => document.getElementById('photo-upload')?.click()}
              >
                {uploading ? (
                  <>
                    <Upload className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photos
                  </>
                )}
              </Button>
            </label>
          </div>
        )}

        {photos.length === 0 ? (
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">No photos uploaded yet</p>
            <p className="text-xs text-gray-400 mt-1">Upload photos to share with pet owners</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {photos.map((photo, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden border bg-gray-100">
                  <img
                    src={photo}
                    alt={`Pet photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => removePhoto(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
                <p className="text-xs text-gray-500 mt-1 text-center">
                  Photo {index + 1}
                </p>
              </div>
            ))}
          </div>
        )}

        {photos.length > 0 && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-700">
              ✓ {photos.length} photo{photos.length > 1 ? 's' : ''} ready to share
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
