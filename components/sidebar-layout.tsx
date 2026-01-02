"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export function SidebarLayout({
  children,
  userRole,
}: {
  children: React.ReactNode
  userRole?: string
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar userRole={userRole} />
        <main className="flex-1">
          <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center px-4">
              <SidebarTrigger />
              <div className="ml-4 flex-1">
                <h1 className="text-lg font-semibold">
                  {userRole === "admin" && "Admin Dashboard"}
                  {userRole === "zoo_manager" && "Pet Caretaker Dashboard"}
                  {userRole === "user" && "Pet Owner Dashboard"}
                  {!userRole && "Pet Care System"}
                </h1>
              </div>
            </div>
          </div>
          <div className="flex-1 p-6">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  )
}
