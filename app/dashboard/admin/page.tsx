'use client'

import { useEffect, useState } from 'react'
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SidebarLayout } from '@/components/sidebar-layout'

export default function AdminDashboard() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab') || 'managers'

  const [users, setUsers] = useState([])
  const [zooManagers, setZooManagers] = useState([])
  const [careRequests, setCareRequests] = useState([])
  const [activeTab, setActiveTab] = useState(tabParam)

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
              <CardTitle className="text-purple-700">Zoo Managers</CardTitle>
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
            <TabsTrigger value="managers">Zoo Managers</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="requests">Care Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="managers" id="managers">
            <Card className="shadow-md">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b">
                <CardTitle className="text-xl">
                  🔐 Zoo Manager Verification
                </CardTitle>
                <CardDescription>
                  Approve or remove zoo managers from the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
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
                            <p>No zoo managers registered yet</p>
                            <p className="text-xs">
                              Zoo managers will appear here once they register
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      zooManagers.map((manager: any) => (
                        <TableRow
                          key={manager._id}
                          className={!manager.isVerified ? 'bg-yellow-50' : ''}
                        >
                          <TableCell className="font-medium">
                            {manager.name}
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
                          <TableCell>
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
            <Card className="shadow-md">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
                <CardTitle className="text-xl">👥 All Users</CardTitle>
                <CardDescription>
                  Complete list of registered users on the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
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
                        <TableRow key={user._id}>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {user.role === 'user'
                                ? 'Pet Owner'
                                : user.role === 'zoo_manager'
                                ? 'Zoo Manager'
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
                                <CardDescription className="mt-1">
                                  <span className="font-medium">Owner:</span>{' '}
                                  {request.owner?.name} |
                                  <span className="font-medium"> Manager:</span>{' '}
                                  {request.zooManager?.name}
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
                              <p className="font-medium">
                                {request.owner?.email}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">
                                Manager Email
                              </p>
                              <p className="font-medium">
                                {request.zooManager?.email}
                              </p>
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
    </SidebarLayout>
  )
}
