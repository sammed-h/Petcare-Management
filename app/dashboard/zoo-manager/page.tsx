'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SidebarLayout } from '@/components/sidebar-layout'
import { LocationTracker } from '@/components/location-tracker'
import { PhotoUploader } from '@/components/photo-uploader'

export default function ZooManagerDashboard() {
  const [careRequests, setCareRequests] = useState([])
  const [activities, setActivities] = useState([])
  const [showAddActivity, setShowAddActivity] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)

  const [activityForm, setActivityForm] = useState({
    activityType: 'feeding',
    description: '',
    location: { latitude: '', longitude: '', address: '' },
    photos: [] as string[],
  })

  useEffect(() => {
    fetchCareRequests()
  }, [])

  const fetchCareRequests = async () => {
    const res = await fetch('/api/care-requests')
    const data = await res.json()
    if (res.ok) setCareRequests(data.requests)
  }

  const handleUpdateStatus = async (requestId: string, status: string) => {
    const res = await fetch(`/api/care-requests/${requestId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) fetchCareRequests()
  }

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRequest) return

    const res = await fetch('/api/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        careRequestId: selectedRequest._id,
        petId: selectedRequest.pet._id,
        ...activityForm,
      }),
    })
    if (res.ok) {
      setShowAddActivity(false)
      setActivityForm({
        activityType: 'feeding',
        description: '',
        location: { latitude: '', longitude: '', address: '' },
        photos: [],
      })
    }
  }

  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (res.ok) {
          setUserName(data.user.name.split(" ")[0]);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, []);

  const pendingRequests = careRequests.filter(
    (r: any) => r.status === 'pending'
  )
  const acceptedRequests = careRequests.filter(
    (r: any) => r.status === 'accepted'
  )
  const completedRequests = careRequests.filter(
    (r: any) => r.status === 'completed'
  )

  return (
    <SidebarLayout userRole="zoo_manager">
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome Back, <span className="capitalize">{userName || "Pet Caretaker"}</span>! 🐾</h1>
          <p className="text-green-100">
            Manage care requests and log pet activities
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Total Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-900">{careRequests.length}</p>
              <p className="text-xs text-blue-600">All time</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-700">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-900">{pendingRequests.length}</p>
              <p className="text-xs text-yellow-600">Needs response</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-900">{acceptedRequests.length}</p>
              <p className="text-xs text-green-600">In progress</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-900">{completedRequests.length}</p>
              <p className="text-xs text-purple-600">Finished</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Requests Section */}
        {pendingRequests.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ⏳ Pending Requests
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {pendingRequests.map((request: any) => (
                <Card
                  key={request._id}
                  className="border-l-4 border-l-yellow-500 bg-yellow-50/30 hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                            <span className="text-xl">🐕</span>
                          </div>
                          <div>
                            <CardTitle className="text-xl">
                              {request.pet?.name}
                            </CardTitle>
                            <CardDescription className="text-sm">
                              {request.pet?.breed} • {request.pet?.age} years
                              old
                            </CardDescription>
                          </div>
                        </div>
                        <div className="bg-white rounded-md p-2 mt-2">
                          <CardDescription className="text-sm flex items-center gap-1">
                            <span className="font-medium">Owner:</span>{' '}
                            {request.owner?.name}
                          </CardDescription>
                          <CardDescription className="text-sm">
                            📞 {request.owner?.phone}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-yellow-100 text-yellow-800"
                      >
                        ⏳ Pending
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium">Care Duration</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(request.startDate).toLocaleDateString()} -{' '}
                        {new Date(request.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    {request.pet?.medicalInfo && (
                      <div>
                        <p className="text-sm font-medium">Medical Info</p>
                        <p className="text-sm text-muted-foreground">
                          {request.pet.medicalInfo}
                        </p>
                      </div>
                    )}
                    {request.notes && (
                      <div>
                        <p className="text-sm font-medium">Special Notes</p>
                        <p className="text-sm text-muted-foreground">
                          {request.notes}
                        </p>
                      </div>
                    )}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          handleUpdateStatus(request._id, 'accepted')
                        }
                        className="flex-1"
                      >
                        Accept Request
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          handleUpdateStatus(request._id, 'rejected')
                        }
                      >
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Active Care Requests Section */}
        {acceptedRequests.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ✅ Active Care
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {acceptedRequests.map((request: any) => (
                <Card
                  key={request._id}
                  className="border-l-4 border-l-green-500 bg-green-50/30 hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-xl">🐕</span>
                          </div>
                          <div>
                            <CardTitle className="text-xl">
                              {request.pet?.name}
                            </CardTitle>
                            <CardDescription className="text-sm">
                              {request.pet?.breed} • {request.pet?.age} years
                              old
                            </CardDescription>
                          </div>
                        </div>
                        <div className="bg-white rounded-md p-2 mt-2">
                          <CardDescription className="text-sm flex items-center gap-1">
                            <span className="font-medium">Owner:</span>{' '}
                            {request.owner?.name}
                          </CardDescription>
                          <CardDescription className="text-sm">
                            📞 {request.owner?.phone}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className="bg-green-600">✓ Active</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium">Care Duration</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(request.startDate).toLocaleDateString()} -{' '}
                        {new Date(request.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    {request.pet?.medicalInfo && (
                      <div>
                        <p className="text-sm font-medium">Medical Info</p>
                        <p className="text-sm text-muted-foreground">
                          {request.pet.medicalInfo}
                        </p>
                      </div>
                    )}
                    {request.notes && (
                      <div>
                        <p className="text-sm font-medium">Special Notes</p>
                        <p className="text-sm text-muted-foreground">
                          {request.notes}
                        </p>
                      </div>
                    )}

                    <Dialog
                      open={
                        showAddActivity && selectedRequest?._id === request._id
                      }
                      onOpenChange={(open) => {
                        setShowAddActivity(open)
                        if (open) setSelectedRequest(request)
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button size="sm" className="w-full mt-2">
                          Log Activity
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            Log Activity for {request.pet?.name}
                          </DialogTitle>
                          <CardDescription>
                            Record feeding, walking, health checks, and more
                          </CardDescription>
                        </DialogHeader>
                        <form
                          onSubmit={handleAddActivity}
                          className="space-y-4"
                        >
                          <div>
                            <Label>Activity Type</Label>
                            <Select
                              value={activityForm.activityType}
                              onValueChange={(value) =>
                                setActivityForm({
                                  ...activityForm,
                                  activityType: value,
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="feeding">
                                  🍽️ Feeding
                                </SelectItem>
                                <SelectItem value="walking">
                                  🚶 Walking
                                </SelectItem>
                                <SelectItem value="playing">
                                  🎾 Playing
                                </SelectItem>
                                <SelectItem value="sleeping">
                                  😴 Sleeping
                                </SelectItem>
                                <SelectItem value="medical">
                                  🏥 Medical Check
                                </SelectItem>
                                <SelectItem value="other">📝 Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Description</Label>
                            <Textarea
                              value={activityForm.description}
                              onChange={(e) =>
                                setActivityForm({
                                  ...activityForm,
                                  description: e.target.value,
                                })
                              }
                              placeholder="Describe the activity in detail..."
                              required
                              rows={3}
                            />
                          </div>
                          <div className="space-y-4">
                            <LocationTracker
                              onLocationUpdate={(location) => {
                                setActivityForm({
                                  ...activityForm,
                                  location: {
                                    latitude: location.latitude.toString(),
                                    longitude: location.longitude.toString(),
                                    address: location.address || '',
                                  },
                                })
                              }}
                            />

                            <PhotoUploader
                              onPhotosChange={(photos) => {
                                setActivityForm({
                                  ...activityForm,
                                  photos,
                                })
                              }}
                              maxPhotos={5}
                            />
                          </div>
                          <Button type="submit" className="w-full">
                            Log Activity
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {careRequests.length === 0 && (
          <Card className="border-2 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-20">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl">📋</span>
              </div>
              <h3 className="text-2xl font-semibold mb-2">
                No Care Requests Yet
              </h3>
              <p className="text-sm text-muted-foreground max-w-md text-center mb-4">
                You haven't received any pet care requests yet. Once pet owners
                request your services, they will appear here.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 max-w-md">
                <p className="text-sm text-blue-800">
                  💡 <span className="font-medium">Tip:</span> Make sure your
                  profile is verified by the admin to receive requests.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Pending Requests Message */}
        {careRequests.length > 0 &&
          pendingRequests.length === 0 &&
          acceptedRequests.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <p className="text-sm text-muted-foreground">
                  All requests have been processed. Check back later for new
                  requests.
                </p>
              </CardContent>
            </Card>
          )}
      </div>
    </SidebarLayout>
  )
}
