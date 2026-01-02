'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SidebarLayout } from '@/components/sidebar-layout'

function AdminDashboardContent() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab') || 'managers'

  const [users, setUsers] = useState([])
  const [zooManagers, setZooManagers] = useState([])
  const [careRequests, setCareRequests] = useState([])
  const [activeTab, setActiveTab] = useState(tabParam)
  const [selectedManager, setSelectedManager] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    setActiveTab(tabParam)
  }, [tabParam])

  const fetchData = async () => {
    // Fetch all users
    const usersRes = await fetch('/api/admin/users')
    if (usersRes.ok) {
      const data = await usersRes.json()
      setUsers(data.users || [])

      // Filter zoo managers from all users (including unverified)
      const managers = (data.users || []).filter(
        (user: any) => user.role === 'zoo_manager'
      )
      setZooManagers(managers)
    }

    // Fetch all care requests
    const requestsRes = await fetch('/api/admin/care-requests')
    if (requestsRes.ok) {
      const data = await requestsRes.json()
      setCareRequests(data.requests || [])
    }
  }

  const handleVerifyManager = async (
    managerId: string,
    isVerified: boolean
  ) => {
    const res = await fetch(`/api/admin/users/${managerId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isVerified }),
    })
    if (res.ok) fetchData()
  }

  return (
    <SidebarLayout userRole="admin">
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard 🛡️</h1>
          <p className="text-indigo-100">
            Manage users, verify caretakers, and monitor the system
          </p>
        </div>

        {/* Overview Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-700">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-900">{users.length}</p>
              <p className="text-sm text-blue-600">Registered users</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-700">Pet Caretakers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-purple-900">
                {zooManagers.length}
              </p>
              <p className="text-sm text-purple-600">
                {zooManagers.filter((m: any) => m.isVerified).length} verified •{' '}
                {zooManagers.filter((m: any) => !m.isVerified).length} pending
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-700">Care Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-green-900">
                {careRequests.length}
              </p>
              <p className="text-sm text-green-600">Total requests</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="managers">Pet Caretakers</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="requests">Care Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="managers" id="managers">
            <Card className="shadow-md overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b">
                <CardTitle className="text-xl">
                  🔐 Pet Caretaker Verification
                </CardTitle>
                <CardDescription>
                  Approve or remove pet caretakers from the platform
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {zooManagers.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center text-muted-foreground py-8"
                        >
                          <div className="space-y-2">
                            <p>No pet caretakers registered yet</p>
                            <p className="text-sm text-gray-500">
                              Pet caretakers will appear here once they register
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      zooManagers.map((manager: any) => (
                        <TableRow
                          key={manager._id}
                          className={!manager.isVerified ? 'bg-yellow-50 cursor-pointer hover:bg-yellow-100' : 'cursor-pointer hover:bg-gray-50'}
                          onClick={() => setSelectedManager(manager)}
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9 border border-primary/10">
                                <AvatarImage src={manager.profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${manager.name}`} className="object-cover" />
                                <AvatarFallback>{manager.name[0]}</AvatarFallback>
                              </Avatar>
                              {manager.name}
                            </div>
                          </TableCell>
                          <TableCell>{manager.email}</TableCell>
                          <TableCell>{manager.phone || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                manager.isVerified ? 'default' : 'secondary'
                              }
                            >
                              {manager.isVerified ? '✓ Verified' : '⏳ Pending'}
                            </Badge>
                          </TableCell>
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            {!manager.isVerified && (
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleVerifyManager(manager._id, true)
                                }
                                className="bg-green-600 hover:bg-green-700"
                              >
                                ✓ Approve
                              </Button>
                            )}
                            {manager.isVerified && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  handleVerifyManager(manager._id, false)
                                }
                              >
                                ✗ Revoke
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" id="users">
            <Card className="shadow-md overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
                <CardTitle className="text-xl">👥 All Users</CardTitle>
                <CardDescription>
                  Complete list of registered users on the platform
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Registered</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center text-muted-foreground"
                        >
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((user: any) => (
                        <TableRow 
                          key={user._id}
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => setSelectedUser(user)}
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9 border border-primary/10">
                                <AvatarImage src={user.profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} className="object-cover" />
                                <AvatarFallback>{user.name[0]}</AvatarFallback>
                              </Avatar>
                              {user.name}
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {user.role === 'user'
                                ? 'Pet Owner'
                                : user.role === 'zoo_manager'
                                ? 'Pet Caretaker'
                                : 'Admin'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                user.isVerified ? 'default' : 'secondary'
                              }
                            >
                              {user.isVerified ? 'Verified' : 'Pending'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests" id="requests">
            <Card className="shadow-md">
              <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b">
                <CardTitle className="text-xl">📊 All Care Requests</CardTitle>
                <CardDescription>
                  Monitor all pet care requests in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                {careRequests.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No care requests yet
                  </p>
                ) : (
                  <div className="space-y-4">
                    {careRequests.map((request: any) => (
                      <Card
                        key={request._id}
                        className={`border-l-4 hover:shadow-md transition-shadow ${
                          request.status === 'accepted'
                            ? 'border-l-green-500 bg-green-50/20'
                            : request.status === 'pending'
                            ? 'border-l-yellow-500 bg-yellow-50/20'
                            : request.status === 'rejected'
                            ? 'border-l-red-500 bg-red-50/20'
                            : 'border-l-gray-500'
                        }`}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start gap-3">
                              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">🐕</span>
                              </div>
                              <div>
                                <CardTitle className="text-lg">
                                  {request.pet?.name || 'Unknown Pet'}
                                </CardTitle>
                                <CardDescription className="mt-1 flex items-center gap-3 flex-wrap">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-medium text-xs text-gray-400 uppercase tracking-tight">Owner:</span>
                                    <Avatar className="h-6 w-6 border border-primary/5">
                                      <AvatarImage src={request.owner?.profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${request.owner?.name}`} />
                                      <AvatarFallback className="text-[10px]">{request.owner?.name?.[0]}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-medium text-gray-700">{request.owner?.name}</span>
                                  </div>
                                  <span className="text-gray-300">|</span>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-medium text-xs text-gray-400 uppercase tracking-tight">Manager:</span>
                                    <Avatar className="h-6 w-6 border border-primary/5">
                                      <AvatarImage src={request.zooManager?.profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${request.zooManager?.name}`} />
                                      <AvatarFallback className="text-[10px]">{request.zooManager?.name?.[0]}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-medium text-gray-700">{request.zooManager?.name}</span>
                                  </div>
                                </CardDescription>
                              </div>
                            </div>
                            <Badge
                              variant={
                                request.status === 'accepted'
                                  ? 'default'
                                  : request.status === 'pending'
                                  ? 'secondary'
                                  : request.status === 'rejected'
                                  ? 'destructive'
                                  : 'outline'
                                }
                              className="text-xs"
                            >
                              {request.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">
                                Start Date
                              </p>
                              <p className="font-medium">
                                {new Date(
                                  request.startDate
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">End Date</p>
                              <p className="font-medium">
                                {new Date(request.endDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">
                                Owner Email
                              </p>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-5 w-5 border border-primary/5">
                                  <AvatarImage src={request.owner?.profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${request.owner?.name}`} />
                                  <AvatarFallback className="text-[10px]">{request.owner?.name?.[0]}</AvatarFallback>
                                </Avatar>
                                <p className="font-medium">
                                  {request.owner?.email}
                                </p>
                              </div>
                            </div>
                            <div>
                              <p className="text-muted-foreground">
                                Manager Email
                              </p>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-5 w-5 border border-primary/5">
                                  <AvatarImage src={request.zooManager?.profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${request.zooManager?.name}`} />
                                  <AvatarFallback className="text-[10px]">{request.zooManager?.name?.[0]}</AvatarFallback>
                                </Avatar>
                                <p className="font-medium">
                                  {request.zooManager?.email}
                                </p>
                              </div>
                            </div>
                          </div>
                          {request.notes && (
                            <div className="mt-4">
                              <p className="text-muted-foreground text-sm">
                                Notes
                              </p>
                              <p className="text-sm">{request.notes}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!selectedManager} onOpenChange={(open) => !open && setSelectedManager(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Caretaker Details</DialogTitle>
            <DialogDescription>Review caretaker information</DialogDescription>
          </DialogHeader>
          {selectedManager && (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20 border-2 border-primary/10">
                    <AvatarImage src={selectedManager.profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedManager.name}`} className="object-cover" />
                    <AvatarFallback className="text-2xl">{selectedManager.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold">{selectedManager.name}</h3>
                    <p className="text-sm text-gray-500">{selectedManager.email}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant={selectedManager.isVerified ? "default" : "secondary"}>
                        {selectedManager.isVerified ? "Verified" : "Pending Verification"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 border-t pt-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                        <p className="font-medium">{selectedManager.phone || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Service Charge</p>
                        <p className="font-medium text-green-700">
                          {selectedManager.serviceCharge ? `₹${selectedManager.serviceCharge}/session` : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Company</p>
                        <p className="font-medium">{selectedManager.companyName || "Independent"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">License ID</p>
                        <p className="font-medium">{selectedManager.companyIdNumber || "N/A"}</p>
                      </div>
                  </div>
                  
                  <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Specialization</p>
                      <div className="bg-gray-50 p-2 rounded text-sm border">
                        {selectedManager.specialization || "General Pet Care"}
                      </div>
                  </div>

                  <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Experience</p>
                      <p className="text-sm text-gray-700">{selectedManager.experience || "No experience listed"}</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  {!selectedManager.isVerified ? (
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700" 
                      onClick={() => {
                        handleVerifyManager(selectedManager._id, true);
                        setSelectedManager(null);
                      }}
                    >
                      Approve Caretaker
                    </Button>
                  ) : (
                      <Button 
                      className="w-full" 
                      variant="destructive"
                      onClick={() => {
                        handleVerifyManager(selectedManager._id, false);
                        setSelectedManager(null);
                      }}
                    >
                      Revoke Verification
                    </Button>
                  )}
                </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>Full details of the registered user</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20 border-2 border-primary/10">
                    <AvatarImage src={selectedUser.profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.name}`} className="object-cover" />
                    <AvatarFallback className="text-2xl">{selectedUser.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                    <p className="text-sm text-gray-500">{selectedUser.email}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="capitalize">
                        {selectedUser.role.replace('_', ' ')}
                      </Badge>
                      <Badge variant={selectedUser.isVerified ? "default" : "secondary"}>
                        {selectedUser.isVerified ? "Verified" : "Pending"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 border-t pt-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                        <p className="font-medium">{selectedUser.phone || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Pincode</p>
                        <p className="font-medium">{selectedUser.pincode || "N/A"}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Address</p>
                        <p className="font-medium">{selectedUser.address || "No address listed"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Member Since</p>
                        <p className="font-medium">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Status</p>
                        <p className="font-medium">{selectedUser.isVerified ? "Active & Verified" : "Pending Approval"}</p>
                      </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Button variant="outline" className="w-full" onClick={() => setSelectedUser(null)}>
                    Close
                  </Button>
                </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </SidebarLayout>
  )
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminDashboardContent />
    </Suspense>
  )
}
