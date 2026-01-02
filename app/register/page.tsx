'use client'

import { useState, useEffect,Suspense } from 'react'
import { useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { toast } from "sonner"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PawPrint, Eye, EyeOff, Upload, Camera, X } from 'lucide-react'

/* ================= PASSWORD HELPERS ================= */

const passwordRules = {
  length: (p: string) => p.length >= 8,
  uppercase: (p: string) => /[A-Z]/.test(p),
  lowercase: (p: string) => /[a-z]/.test(p),
  number: (p: string) => /\d/.test(p),
  special: (p: string) => /[^A-Za-z0-9]/.test(p),
}

const getPasswordScore = (password: string) =>
  Object.values(passwordRules).filter((rule) => rule(password)).length

const getStrengthLabel = (score: number) => {
  if (score <= 2) return 'Weak'
  if (score <= 4) return 'Medium'
  return 'Strong'
}

const getStrengthColor = (score: number) => {
  if (score <= 2) return 'bg-red-500'
  if (score <= 4) return 'bg-yellow-500'
  return 'bg-green-500'
}

const getStrengthWidth = (score: number) => {
  switch (score) {
    case 0: return 'w-0'
    case 1: return 'w-1/5'
    case 2: return 'w-2/5'
    case 3: return 'w-3/5'
    case 4: return 'w-4/5'
    case 5: return 'w-full'
    default: return 'w-0'
  }
}

/* ================= COMPONENT ================= */

function RegisterContent() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  
  const searchParams = useSearchParams()
  const roleParam = searchParams.get('role')
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: roleParam === 'zoo_manager' ? 'zoo_manager' : 'user',
    phone: '',

    address: '',
    pincode: '',
    // Caretaker specific
    profilePhoto: '',
    specialization: '',
    experience: '',
    serviceCharge: '',
    companyName: '',
    companyIdNumber: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordScore, setPasswordScore] = useState(0)
  const [passwordsMatch, setPasswordsMatch] = useState(true)

  useEffect(() => {
    if (roleParam) {
      setFormData((prev) => ({
        ...prev,
        role: roleParam === 'zoo_manager' ? 'zoo_manager' : 'user',
      }))
    }
  }, [roleParam])

  useEffect(() => {
    if (formData.confirmPassword) {
      setPasswordsMatch(formData.password === formData.confirmPassword)
    }
  }, [formData.password, formData.confirmPassword])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      return // Should be handled by UI state but double check
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      toast.success("Registration successful! Please login.");
      router.push('/login?registered=true')
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

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
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7) // Compress to 70% quality JPEG
          setFormData(prev => ({ ...prev, profilePhoto: dataUrl }))
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
      // Small delay to ensure video element is mounted
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
      }, 100)
    } catch (err) {
      console.error("Error accessing camera:", err)
      setError("Could not access camera. Please check permissions.")
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
        // Set canvas dimensions to match video but limit size
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
        
        // Draw video frame to canvas
        context.drawImage(video, 0, 0, w, h)
        
        // Convert to data URL with compression
        const photoUrl = canvas.toDataURL('image/jpeg', 0.7)
        setFormData(prev => ({ ...prev, profilePhoto: photoUrl }))
        stopCamera()
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <PawPrint className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">PetCare</span>
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>
              Join PetCare and start your journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="mb-2">
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="email" className="mb-2">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="mb-2">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => {
                      const value = e.target.value
                      setFormData({ ...formData, password: value })
                      setPasswordScore(getPasswordScore(value))
                    }}
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {formData.password && (
                  <div className="mt-3 space-y-3">
                    {/* Strength Bar */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-medium text-gray-600">
                          Password Strength
                        </span>
                        <span
                          className={`text-xs font-semibold ${
                            passwordScore <= 2
                              ? 'text-red-500'
                              : passwordScore <= 4
                              ? 'text-yellow-600'
                              : 'text-green-600'
                          }`}
                        >
                          {getStrengthLabel(passwordScore)}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ease-out ${getStrengthColor(
                            passwordScore
                          )} ${getStrengthWidth(passwordScore)}`}
                        />
                      </div>
                    </div>

                    {/* Requirements */}
                    <div className="bg-gray-50 rounded-lg p-3 space-y-1.5">
                      <p className="text-xs font-medium text-gray-700 mb-2">
                        Password must contain:
                      </p>
                      {[
                        {
                          label: 'At least 8 characters',
                          rule: passwordRules.length,
                        },
                        {
                          label: 'One uppercase letter (A-Z)',
                          rule: passwordRules.uppercase,
                        },
                        {
                          label: 'One lowercase letter (a-z)',
                          rule: passwordRules.lowercase,
                        },
                        {
                          label: 'One number (0-9)',
                          rule: passwordRules.number,
                        },
                        {
                          label: 'One special character (!@#$...)',
                          rule: passwordRules.special,
                        },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div
                            className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                              item.rule(formData.password)
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-300 text-gray-500'
                            }`}
                          >
                            ✓
                          </div>
                          <span
                            className={`text-xs transition-colors ${
                              item.rule(formData.password)
                                ? 'text-green-700 font-medium'
                                : 'text-gray-500'
                            }`}
                          >
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="mb-2">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {formData.confirmPassword && !passwordsMatch && (
                  <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                    <span className="font-bold">✕</span> Passwords do not match
                  </p>
                )}
                {formData.confirmPassword && passwordsMatch && (
                  <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">
                    <span className="font-bold">✓</span> Passwords match
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="role" className="mb-2">
                  I am a
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Pet Owner</SelectItem>
                    <SelectItem value="zoo_manager">
                      Pet Caretaker (Zoo Manager)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="phone" className="mb-2">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="address" className="mb-2">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode" className="mb-2">Pincode</Label>
                    <Input
                      id="pincode"
                      placeholder="e.g. 560001"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      required
                    />
                  </div>
                </div>


              {formData.role === 'zoo_manager' && (
                <div className="space-y-4 border-t pt-4 mt-4">
                  <h3 className="font-semibold text-lg">Professional Details</h3>
                  
                  <div className="space-y-3">
                    <Label>Profile Photo</Label>
                    
                    {!isCameraOpen && !formData.profilePhoto && (
                      <div className="grid grid-cols-2 gap-4">
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="h-24 flex flex-col gap-2 border-dashed"
                          onClick={() => document.getElementById('file-upload')?.click()}
                        >
                          <Upload className="h-6 w-6 text-gray-500" />
                          <span className="text-xs text-gray-600">Upload Photo</span>
                          <input 
                            id="file-upload" 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleFileChange}
                          />
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="h-24 flex flex-col gap-2 border-dashed"
                          onClick={startCamera}
                        >
                          <Camera className="h-6 w-6 text-gray-500" />
                          <span className="text-xs text-gray-600">Take Photo</span>
                        </Button>
                      </div>
                    )}

                    {isCameraOpen && (
                      <div className="relative border rounded-lg overflow-hidden bg-black aspect-video">
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

                    {formData.profilePhoto && !isCameraOpen && (
                      <div className="relative w-32 h-32 mx-auto sm:mx-0">
                         <img 
                           src={formData.profilePhoto} 
                           alt="Profile Preview" 
                           className="w-full h-full object-cover rounded-full border-2 border-primary"
                         />
                         <button
                           type="button"
                           onClick={() => setFormData(prev => ({ ...prev, profilePhoto: '' }))}
                           className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600"
                         >
                           <X className="h-4 w-4" />
                         </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="specialization" className="mb-2">Specialization</Label>
                      <Input
                        id="specialization"
                        placeholder="e.g. Exotic Birds"
                        value={formData.specialization}
                        onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="experience" className="mb-2">Experience</Label>
                      <Input
                        id="experience"
                        placeholder="e.g. 5 Years"
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="serviceCharge" className="mb-2">Service Charge (₹)</Label>
                      <Input
                        id="serviceCharge"
                        type="number"
                        placeholder="e.g. 1500"
                        value={formData.serviceCharge}
                        onChange={(e) => setFormData({ ...formData, serviceCharge: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="companyName" className="mb-2">Company / Agency</Label>
                      <Input
                        id="companyName"
                        placeholder="Your Company or 'Independent'"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="companyIdNumber" className="mb-2">Company ID / License No.</Label>
                    <Input
                      id="companyIdNumber"
                      placeholder="Official ID Number"
                      value={formData.companyIdNumber}
                      onChange={(e) => setFormData({ ...formData, companyIdNumber: e.target.value })}
                      required
                    />
                  </div>
                </div>
              )}

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button
                type="submit"
                className="w-full"
                disabled={loading || !passwordsMatch || passwordScore < 5}
              >
                {loading ? 'Creating Account...' : 'Register'}
              </Button>

              <p className="text-sm text-center">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-600 hover:underline">
                  Login
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
