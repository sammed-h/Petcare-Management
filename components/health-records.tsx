"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Activity, 
  Heart, 
  Utensils, 
  Footprints, 
  Stethoscope,
  Clock,
  MapPin
} from 'lucide-react'
import { MapDisplay } from './map-display'

interface ActivityRecord {
  _id: string
  activityType: 'feeding' | 'walking' | 'playing' | 'sleeping' | 'medical' | 'other'
  description: string
  location?: {
    latitude: number
    longitude: number
    address?: string
  }
  photos: string[]
  timestamp: Date
  createdBy: {
    name: string
  }
}

const activityIcons = {
  feeding: Utensils,
  walking: Footprints,
  playing: Activity,
  sleeping: Clock,
  medical: Stethoscope,
  other: Activity,
}

const activityColors = {
  feeding: 'bg-orange-100 text-orange-700 border-orange-200',
  walking: 'bg-blue-100 text-blue-700 border-blue-200',
  playing: 'bg-green-100 text-green-700 border-green-200',
  sleeping: 'bg-purple-100 text-purple-700 border-purple-200',
  medical: 'bg-red-100 text-red-700 border-red-200',
  other: 'bg-gray-100 text-gray-700 border-gray-200',
}

export function HealthRecords({ activities, isLoading = false }: { activities: ActivityRecord[], isLoading?: boolean }) {
  const [selectedType, setSelectedType] = useState<string>('all')

  if (isLoading) {
    return (
      <Card className='w-full border-0 shadow-none'>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-6 w-48" />
          </div>
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {[...Array(7)].map((_, i) => (
                <Skeleton key={i} className="h-9 w-full rounded-lg" />
              ))}
            </div>
            <div className="space-y-3 mt-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-4 rounded-lg border">
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-5 w-20" />
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const filteredActivities = selectedType === 'all' 
    ? activities 
    : activities.filter(a => a.activityType === selectedType)

  const getActivityStats = () => {
    const stats = {
      feeding: activities.filter(a => a.activityType === 'feeding').length,
      walking: activities.filter(a => a.activityType === 'walking').length,
      playing: activities.filter(a => a.activityType === 'playing').length,
      sleeping: activities.filter(a => a.activityType === 'sleeping').length,
      medical: activities.filter(a => a.activityType === 'medical').length,
      other: activities.filter(a => a.activityType === 'other').length,
    }
    return stats
  }

  const stats = getActivityStats()

  return (
    <Card className='w-full border-0 shadow-none'>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5" />
          Health & Activity Records
        </CardTitle>
        <CardDescription>
          Complete digital records of pet care activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedType} onValueChange={setSelectedType} className="space-y-4">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 h-auto">
            <TabsTrigger value="all">
              All ({activities.length})
            </TabsTrigger>
            <TabsTrigger value="feeding">
              Feed ({stats.feeding})
            </TabsTrigger>
            <TabsTrigger value="walking">
              Walk ({stats.walking})
            </TabsTrigger>
            <TabsTrigger value="playing">
              Play ({stats.playing})
            </TabsTrigger>
            <TabsTrigger value="sleeping">
              Sleep ({stats.sleeping})
            </TabsTrigger>
            <TabsTrigger value="medical">
              Medical ({stats.medical})
            </TabsTrigger>
            <TabsTrigger value="other">
              Other ({stats.other})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedType} className="space-y-4">
            {filteredActivities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>No activities recorded yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredActivities.map((activity) => {
                  const Icon = activityIcons[activity.activityType]
                  const colorClass = activityColors[activity.activityType]
                  
                  return (
                    <div 
                      key={activity._id} 
                      className={`p-4 rounded-lg border ${colorClass}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-white">
                          <Icon className="h-5 w-5" />
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold capitalize">
                                {activity.activityType}
                              </h4>
                              <p className="text-sm mt-1">
                                {activity.description}
                              </p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {new Date(activity.timestamp).toLocaleDateString()}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-4 text-xs">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(activity.timestamp).toLocaleTimeString()}
                            </span>
                            <span>By: {activity.createdBy.name}</span>
                          </div>

                          {activity.location && (
                            <div className="space-y-2">
                              <div className="flex items-start gap-1 text-xs text-blue-600 font-medium">
                                <MapPin className="h-3 w-3 mt-0.5" />
                                <span>
                                  {activity.location.address || 
                                    `${activity.location.latitude?.toFixed(4) || '0'}, ${activity.location.longitude?.toFixed(4) || '0'}`}
                                </span>
                              </div>
                              
                              {/* Leaflet Map for Activity */}
                              {activity.location.latitude && activity.location.longitude && (
                                <div className="space-y-2">
                                  <MapDisplay 
                                    latitude={activity.location.latitude} 
                                    longitude={activity.location.longitude} 
                                    address={activity.location.address}
                                    height="150px"
                                  />
                                  <a
                                    href={`https://www.google.com/maps?q=${activity.location.latitude},${activity.location.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1"
                                  >
                                    <MapPin className="h-3 w-3" />
                                    Open in Google Maps
                                  </a>
                                </div>
                              )}
                            </div>
                          )}

                          {activity.photos && activity.photos.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                              {activity.photos.map((photo, idx) => (
                                <div 
                                  key={idx} 
                                  className="aspect-square rounded-md overflow-hidden border-2 border-white"
                                >
                                  <img
                                    src={photo}
                                    alt={`Activity photo ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
