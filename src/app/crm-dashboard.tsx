"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PlusCircle,
  Search,
  Menu,
  Bell,
  HelpCircle,
  UserCircle2,
  ChevronDown,
  Inbox,
  Calendar,
  Users,
  Settings,
  BarChart2,
  LogOut,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from 'next/image'
import GoBingoLogo from "../../../public/gobingoLogo.jpeg"

const sidebarItems = [
  { icon: Inbox, label: "Inbox" },
  { icon: Calendar, label: "My Work" },
  { icon: Users, label: "Teams" },
  { icon: BarChart2, label: "Reporting" },
];

export default function CRMDashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
        return;
      }
      const user = data?.user;
      if (user) {
        setUserEmail(user.email || "");
      }
    };
    getUser();
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-yellow-500 text-white p-4">
        <div className="flex justify-center items-center mb-8">
          <Image src="/gobingoLogo.jpeg" alt="GoBingo Logo" width={120} height={120} />
        </div>
        <nav>
          {sidebarItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className="flex items-center py-2 px-4 rounded hover:bg-yellow-600 transition-colors"
            >
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
              <Input className="pl-10 w-64" placeholder="Search..." />
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
                    <span>{userEmail || "Loading..."}</span>
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <UserCircle2 className="mr-2 h-4 w-4" />
                    <span>{userEmail || "No Email Found"}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
      </div>
    </div>
  );
}
