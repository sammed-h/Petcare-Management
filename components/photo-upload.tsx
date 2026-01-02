'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Camera, Upload, X } from 'lucide-react'

interface PhotoUploadProps {
  currentPhoto?: string
  onPhotoChange: (base64: string) => void
}

export function PhotoUpload({ currentPhoto, onPhotoChange }: PhotoUploadProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [preview, setPreview] = useState(currentPhoto || '')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const MAX_WIDTH = 800
          const MAX_HEIGHT = 800
          let width = img.width
          let height = img.height

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width
              width = MAX_WIDTH
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height
              height = MAX_HEIGHT
            }
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx?.drawImage(img, 0, 0, width, height)
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7)
          setPreview(dataUrl)
          onPhotoChange(dataUrl)
        }
        img.src = event.target?.result as string
      }
      reader.readAsDataURL(file)
    }
  }

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true })
      setStream(mediaStream)
      setIsCameraOpen(true)
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
      }, 100)
    } catch (err) {
      console.error("Error accessing camera:", err)
      alert("Could not access camera. Please check permissions.")
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setIsCameraOpen(false)
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')

      if (context) {
        const MAX_DIM = 800
        let w = video.videoWidth
        let h = video.videoHeight
        
        if (w > h && w > MAX_DIM) {
            h = (h * MAX_DIM) / w
            w = MAX_DIM
        } else if (h > w && h > MAX_DIM) {
            w = (w * MAX_DIM) / h
            h = MAX_DIM
        }

        canvas.width = w
        canvas.height = h
        context.drawImage(video, 0, 0, w, h)
        
        const photoUrl = canvas.toDataURL('image/jpeg', 0.7)
        setPreview(photoUrl)
        onPhotoChange(photoUrl)
        stopCamera()
      }
    }
  }

  return (
    <div className="space-y-4">
      {!isCameraOpen && (
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-32 h-32">
            <img 
              src={preview || `https://api.dicebear.com/7.x/avataaars/svg?seed=preview`} 
              alt="Profile" 
              className="w-full h-full object-cover rounded-full border-2 border-primary"
            />
            {preview && (
              <button
                type="button"
                onClick={() => { setPreview(''); onPhotoChange(''); }}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <div className="flex gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => document.getElementById('profile-upload')?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload
              <input 
                id="profile-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileChange}
              />
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={startCamera}
            >
              <Camera className="h-4 w-4 mr-2" />
              Camera
            </Button>
          </div>
        </div>
      )}

      {isCameraOpen && (
        <div className="relative border rounded-lg overflow-hidden bg-black aspect-video max-w-md mx-auto">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
             <Button type="button" variant="destructive" size="sm" onClick={stopCamera}>Cancel</Button>
             <Button type="button" onClick={capturePhoto} className="bg-white text-black hover:bg-gray-200">
               <Camera className="h-4 w-4 mr-2" /> Capture
             </Button>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </div>
  )
}
