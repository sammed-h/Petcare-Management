import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { ProfileEditor } from '@/components/profile-editor'

async function getUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) return null

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    await dbConnect()
    const user = await User.findById(decoded.userId).select('-password').lean()
    return user ? JSON.parse(JSON.stringify(user)) : null
  } catch (err) {
    return null
  }
}

import { SidebarLayout } from '@/components/sidebar-layout'

export default async function UserProfilePage() {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  if (user.role !== 'user') {
    redirect('/dashboard/zoo-manager/profile')
  }

  return (
    <SidebarLayout userRole="user">
      <div className="container mx-auto py-6">
        <ProfileEditor user={user} />
      </div>
    </SidebarLayout>
  )
}
