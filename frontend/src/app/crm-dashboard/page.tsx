"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, Menu, Bell, HelpCircle, UserCircle2, ChevronDown, Inbox, Calendar, Users, Settings, BarChart2, LogOut } from 'lucide-react';
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from 'next/image';
import UserRegistrationTable from '../components/UserRegistrationTableClient';
import type { UserRegistration } from '../components/UserRegistrationTableClient';

const sidebarItems = [
  { icon: Inbox, label: "Policy Holder's Info" },
  { icon: Users, label: "Referrer Info" },
  { icon: Calendar, label: "Insurance Policy" },
  { icon: BarChart2, label: "Reporting" },
];

export default function CRMDashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [registrations, setRegistrations] = useState<UserRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

    // Fetch registrations
    const fetchRegistrations = async () => {
      try {
        const { data, error } = await supabase
          .from('user_registration')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setRegistrations(data || []);
      } catch (error) {
        console.error("Error fetching registrations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
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
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input className="pl-10 w-64 md:w-80" placeholder="Search..." />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon">
                <HelpCircle className="h-6 w-6" />
              </Button>
              <UserDropdown userEmail={userEmail} handleSignOut={handleSignOut} />
            </div>
          </div>
        </header>

        {/* Main content area with UserRegistrationTable */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-lg">Loading...</div>
            </div>
          ) : (
            <UserRegistrationTable initialData={registrations} />
          )}
        </main>
      </div>
    </div>
  );
}

function SidebarContent() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-center items-center mb-8">
        <Image src="/gobingoLogo.jpeg" alt="GoBingo Logo" width={120} height={120} />
      </div>
      <nav className="flex-1">
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
  );
}

function UserDropdown({ userEmail, handleSignOut }: { userEmail: string, handleSignOut: () => Promise<void> }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center">
          <UserCircle2 className="h-6 w-6 mr-2" />
          <span className="hidden md:inline">{userEmail || "Loading..."}</span>
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
  );
}