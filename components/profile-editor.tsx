'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { ReauthModal } from '@/components/reauth-modal'
import { PhotoUpload } from '@/components/photo-upload'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface ProfileEditorProps {
  user: any
}

export function ProfileEditor({ user: initialUser }: ProfileEditorProps) {
  const [user, setUser] = useState(initialUser)
  const [isEditing, setIsEditing] = useState(false)
  const [showSecurityModal, setShowSecurityModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editForm, setEditForm] = useState(initialUser)

  const handleEditClick = () => {
    setShowSecurityModal(true)
  }

  const handleVerified = () => {
    setIsEditing(true)
    setEditForm(user)
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/user/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })
      
      const data = await res.json()
      if (res.ok) {
        setUser(data.user)
        setIsEditing(false)
      } else {
        alert(data.error || 'Update failed')
      }
    } catch (err) {
      console.error(err)
      alert("Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Profile Settings</h2>
          <p className="text-muted-foreground">Manage your account settings and preferences.</p>
        </div>
        {!isEditing && (
          <Button onClick={handleEditClick}>Edit Details</Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
             <Avatar className="h-20 w-20 border-2 border-primary/10">
               <AvatarImage src={user.profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
               <AvatarFallback className="text-2xl">{user.name[0]}</AvatarFallback>
             </Avatar>
             <div>
               <CardTitle className="text-xl">{user.name}</CardTitle>
               <CardDescription>{user.email}</CardDescription>
               <div className="flex gap-2 mt-2">
                 <Badge variant="secondary" className="capitalize">{user.role.replace('_', ' ')}</Badge>
                 {user.isVerified && <Badge className="bg-green-600">Verified</Badge>}
               </div>
             </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input 
                    disabled={!isEditing} 
                    value={isEditing ? editForm.name : user.name}
                    onChange={e => setEditForm({...editForm, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input 
                    disabled={!isEditing} 
                    value={isEditing ? editForm.phone || '' : user.phone || 'N/A'}
                    onChange={e => setEditForm({...editForm, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input 
                    disabled={!isEditing} 
                    value={isEditing ? editForm.address || '' : user.address || 'N/A'}
                    onChange={e => setEditForm({...editForm, address: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Pincode</Label>
                  <Input 
                    disabled={!isEditing} 
                    value={isEditing ? editForm.pincode || '' : user.pincode || 'N/A'}
                    onChange={e => setEditForm({...editForm, pincode: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Pet Caretaker Specific */}
            {user.role === 'zoo_manager' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2">Professional Details</h3>
                
                {isEditing && (
                  <div className="space-y-2">
                    <Label>Profile Photo</Label>
                    <PhotoUpload 
                      currentPhoto={editForm.profilePhoto}
                      onPhotoChange={(base64) => setEditForm({...editForm, profilePhoto: base64})}
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <Label>Company Name</Label>
                      <Input 
                        disabled={!isEditing} 
                        value={isEditing ? editForm.companyName || '' : user.companyName || 'N/A'}
                        onChange={e => setEditForm({...editForm, companyName: e.target.value})}
                      />
                   </div>
                   <div className="space-y-2">
                      <Label>Service Charge (₹/visit)</Label>
                      <Input 
                        type="number"
                        disabled={!isEditing} 
                        value={isEditing ? editForm.serviceCharge || '' : user.serviceCharge || 'N/A'}
                        onChange={e => setEditForm({...editForm, serviceCharge: e.target.value})}
                      />
                   </div>
                   <div className="space-y-2 md:col-span-2">
                      <Label>Specialization</Label>
                      <Input 
                        disabled={!isEditing} 
                        value={isEditing ? editForm.specialization || '' : user.specialization || 'N/A'}
                        onChange={e => setEditForm({...editForm, specialization: e.target.value})}
                      />
                   </div>
                   <div className="space-y-2 md:col-span-2">
                      <Label>Experience</Label>
                      <Textarea 
                        disabled={!isEditing} 
                        value={isEditing ? editForm.experience || '' : user.experience || 'N/A'}
                        onChange={e => setEditForm({...editForm, experience: e.target.value})}
                      />
                   </div>
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            {isEditing && (
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button onClick={handleSave} disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <ReauthModal 
        isOpen={showSecurityModal} 
        onClose={() => setShowSecurityModal(false)}
        onVerified={handleVerified}
        email={user.email}
      />
    </div>
  )
}
