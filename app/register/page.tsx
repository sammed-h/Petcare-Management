'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
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
import { PawPrint, Eye, EyeOff } from 'lucide-react'

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
  if (score === 0) return 'w-0'
  if (score === 1) return 'w-1/5'
  if (score === 2) return 'w-2/5'
  if (score === 3) return 'w-3/5'
  if (score === 4) return 'w-4/5'
  return 'w-full'
}

/* ================= COMPONENT ================= */

export default function RegisterPage() {
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
    setLoading(true)
    setError('')

    if (passwordScore < 5) {
      setError('Please create a strong password meeting all requirements.')
      setLoading(false)
      return
    }

    if (!passwordsMatch) {
      setError('Passwords do not match.')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      router.push('/login')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
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
                      Zoo Manager / Caretaker
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

              <div>
                <Label htmlFor="address" className="mb-2">
                  Address
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>

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