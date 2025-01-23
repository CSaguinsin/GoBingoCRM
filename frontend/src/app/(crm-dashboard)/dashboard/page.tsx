"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import {
  PlusCircle,
  Search,
  Menu,
  Bell,
  HelpCircle,
  UserCircle2,
  ChevronDown,
  LogOut,
  Inbox,
  Calendar,
  Users,
  Settings,
} from "lucide-react"
import SidebarContent from "../../components/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Dashboard() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (user) {
        setUserEmail(user.email || "")
        setUserName(user.user_metadata?.full_name || user.email?.split("@")[0] || "User")
      } else if (error) {
        console.error("Error fetching user:", error.message)
      }
    }

    fetchUser()
  }, [])

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      router.push("/")
    } else {
      console.error("Sign out error:", error.message)
    }
  }

  const tabItems = [
    { icon: Inbox, title: "Policy Holder's Info", description: "Overview of the policy holder's data", route: "/policy-holder"  },
    { icon: Users, title: "Referrer Info", description: "Overview of the referrer info data", route: "/referrer-info" },
    { icon: Calendar, title: "Insurance Policy", description: "Overview of the insurance policy data", route: "/insurance-policy" },
  ]

  const handleNavigation = (route: string) => {
    router.push(route);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex w-64 bg-yellow-500 text-white p-4 flex-shrink-0">
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              {/* Mobile Sidebar */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <div className="bg-yellow-500 text-white h-full p-4">
                    <SidebarContent />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input className="pl-10 w-64 md:w-80" placeholder="Search..." />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notification Icon */}
              <Button variant="ghost" size="icon">
                <Bell className="h-6 w-6" />
              </Button>

              {/* Help Icon */}
              <Button variant="ghost" size="icon">
                <HelpCircle className="h-6 w-6" />
              </Button>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="flex items-center space-x-2">
                    <UserCircle2 className="h-6 w-6" />
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <div className="px-4 py-2">
                    <p className="text-sm text-gray-600">{userEmail || "Guest"}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/profile")}>Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/settings")}>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Welcome back, {userName}!</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {tabItems.map((item, index) => (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer"
              onClick={() => handleNavigation(item.route)}
            >
              <div className="relative h-32">
                <Image src="/cardHeader.png" alt={`${item.title} header`} layout="fill" objectFit="cover" />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <item.icon className="h-12 w-12 text-white" />
                </div>
              </div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

            {/* Add more dashboard content here */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Add recent activity content here */}
                  <p>No recent activity to display.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-2">
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create New Project
                    </Button>
                    <Button variant="outline">View All Projects</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

