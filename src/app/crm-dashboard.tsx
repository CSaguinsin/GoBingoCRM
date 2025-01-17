"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle, Search, Menu, Bell, HelpCircle, UserCircle2, ChevronDown, Inbox, Calendar, Users, Settings, BarChart2, LogOut } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const sidebarItems = [
  { icon: Inbox, label: 'Inbox' },
  { icon: Calendar, label: 'My Work' },
  { icon: Users, label: 'Teams' },
  { icon: BarChart2, label: 'Reporting' },
]

export default function CRMDashboard() {
  const router = useRouter()
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Design new landing page', status: 'In Progress', dueDate: '2023-05-15', assignee: 'Alice' },
    { id: 2, name: 'Develop API endpoints', status: 'To Do', dueDate: '2023-05-20', assignee: 'Bob' },
    { id: 3, name: 'User testing', status: 'Done', dueDate: '2023-05-10', assignee: 'Charlie' },
  ])

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-yellow-500 text-white p-4">
        <div className="flex items-center mb-8">
          <div className="w-8 h-8 bg-white rounded-md mr-2"></div>
          <h1 className="text-xl font-bold">Yellow CRM</h1>
        </div>
        <nav>
          {sidebarItems.map((item, index) => (
            <a key={index} href="#" className="flex items-center py-2 px-4 rounded hover:bg-yellow-600 transition-colors">
              <item.icon className="mr-2" size={20} />
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
              <Input 
                className="pl-10 w-64"
                placeholder="Search..." 
              />
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon">
                <HelpCircle className="h-6 w-6" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center">
                    <UserCircle2 className="h-6 w-6 mr-2" />
                    <span>John Doe</span>
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <UserCircle2 className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Projects</h2>
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
              <PlusCircle className="h-5 w-5 mr-2" />
              New Item
            </Button>
          </div>

          {/* Task Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{task.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        task.status === 'Done' ? 'bg-green-100 text-green-800' :
                        task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{task.dueDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{task.assignee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  )
}