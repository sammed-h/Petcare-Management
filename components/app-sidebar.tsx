"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  LogIn,
  UserPlus,
  Users,
  PawPrint,
  Calendar,
  Activity,
  Settings,
  LogOut,
  User,
  Shield,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

const publicNavItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Login",
    url: "/login",
    icon: LogIn,
  },
  {
    title: "Register as Pet Owner",
    url: "/register?role=user",
    icon: UserPlus,
    description: "Create account to manage your pets",
  },
  {
    title: "Register as Pet Caretaker",
    url: "/register?role=zoo_manager",
    icon: Users,
    description: "Become a certified pet caretaker",
  },
]

const petOwnerNavItems = [
  {
    title: "Dashboard",
    url: "/dashboard/user",
    icon: Home,
  },
  {
    title: "My Pets",
    url: "/dashboard/user#pets",
    icon: PawPrint,
  },
  {
    title: "Care Requests",
    url: "/dashboard/user#requests",
    icon: Calendar,
  },
  {
    title: "Profile",
    url: "/dashboard/user/profile",
    icon: User,
  },
]

const zooManagerNavItems = [
  {
    title: "Dashboard",
    url: "/dashboard/zoo-manager",
    icon: Home,
  },
  {
    title: "Care Requests",
    url: "/dashboard/zoo-manager#requests",
    icon: Calendar,
  },
  {
    title: "Activities",
    url: "/dashboard/zoo-manager#activities",
    icon: Activity,
  },
  {
    title: "Profile",
    url: "/dashboard/zoo-manager/profile",
    icon: User,
  },
]

const adminNavItems = [
  {
    title: "Dashboard",
    url: "/dashboard/admin",
    icon: Shield,
  },
  {
    title: "Verify Managers",
    url: "/dashboard/admin?tab=managers",
    icon: Users,
  },
  {
    title: "All Users",
    url: "/dashboard/admin?tab=users",
    icon: Users,
  },
  {
    title: "All Requests",
    url: "/dashboard/admin?tab=requests",
    icon: Calendar,
  },
]

const quickActions = [
  {
    title: "Create Pet Profile",
    description: "Add a new pet to your account",
    action: "add-pet",
  },
  {
    title: "Request Care",
    description: "Find a caretaker for your pet",
    action: "request-care",
  },
  {
    title: "Log Activity",
    description: "Update pet care activities",
    action: "log-activity",
  },
]

export function AppSidebar({ userRole }: { userRole?: string }) {
  const pathname = usePathname()

  const getNavItems = () => {
    if (userRole === "admin") return adminNavItems
    if (userRole === "zoo_manager") return zooManagerNavItems
    if (userRole === "user") return petOwnerNavItems
    return publicNavItems
  }

  const navItems = getNavItems()

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <Link href="/" className="flex items-center gap-2">
          <PawPrint className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold">PetCare</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!userRole && (
          <>
            <Separator className="my-2" />
            <SidebarGroup>
              <SidebarGroupLabel>Quick Start Guide</SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-3 py-2 text-sm space-y-3">
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">1. Create Account</p>
                    <p className="text-xs text-muted-foreground">
                      Register as Pet Owner or Pet Caretaker
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">2. Admin Approval</p>
                    <p className="text-xs text-muted-foreground">
                      Pet Caretakers need admin verification
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">3. Start Using</p>
                    <p className="text-xs text-muted-foreground">
                      Create pets, request care, log activities
                    </p>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

        {userRole && (
          <>
            <Separator className="my-2" />
            <SidebarGroup>
              <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-3 py-2 text-sm space-y-2">
                  {userRole === "user" && (
                    <>
                      <div className="p-2 rounded-md bg-muted/50 hover:bg-muted cursor-pointer">
                        <p className="font-medium text-xs">Add Pet</p>
                        <p className="text-xs text-muted-foreground">Create new pet profile</p>
                      </div>
                      <div className="p-2 rounded-md bg-muted/50 hover:bg-muted cursor-pointer">
                        <p className="font-medium text-xs">Request Care</p>
                        <p className="text-xs text-muted-foreground">Find a caretaker</p>
                      </div>
                    </>
                  )}
                  {userRole === "zoo_manager" && (
                    <>
                      <div className="p-2 rounded-md bg-muted/50 hover:bg-muted cursor-pointer">
                        <p className="font-medium text-xs">View Requests</p>
                        <p className="text-xs text-muted-foreground">Check pending requests</p>
                      </div>
                      <div className="p-2 rounded-md bg-muted/50 hover:bg-muted cursor-pointer">
                        <p className="font-medium text-xs">Log Activity</p>
                        <p className="text-xs text-muted-foreground">Update pet care</p>
                      </div>
                    </>
                  )}
                  {userRole === "admin" && (
                    <>
                      <Link href="/dashboard/admin?tab=managers">
                        <div className="p-2 rounded-md bg-muted/50 hover:bg-muted cursor-pointer">
                          <p className="font-medium text-xs">Verify Managers</p>
                          <p className="text-xs text-muted-foreground">Approve caretakers</p>
                        </div>
                      </Link>
                      <Link href="/dashboard/admin?tab=requests">
                        <div className="p-2 rounded-md bg-muted/50 hover:bg-muted cursor-pointer">
                          <p className="font-medium text-xs">Monitor System</p>
                          <p className="text-xs text-muted-foreground">View all activities</p>
                        </div>
                      </Link>
                    </>
                  )}
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        {userRole ? (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/api/auth/logout">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        ) : (
          <div className="text-xs text-muted-foreground text-center">
            <p>Pet Care System v1.0</p>
            <p className="mt-1">© 2024 All rights reserved</p>
          </div>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
