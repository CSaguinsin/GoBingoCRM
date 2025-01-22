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
import ReferrerInfoTable from '../../components/ReferrerTable';
import type { ReferrerInfo } from '../../components/ReferrerTable';
import SidebarContent from '../../components/sidebar';

export default function ReferrerDashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [referrers, setReferrers] = useState<ReferrerInfo[]>([]);
  const [loading, setLoading] = useState(true);

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

    // Fetch referrers
    const fetchReferrers = async () => {
      try {
        const { data, error } = await supabase
          .from('referrer_info')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setReferrers(data || []);
      } catch (error) {
        console.error("Error fetching referrers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferrers();
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
                <Input className="pl-10 w-64 md:w-80" placeholder="Search referrers..." />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="hidden md:flex items-center">
                <PlusCircle className="h-5 w-5 mr-2" />
                Add Referrer
              </Button>
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

        {/* Main content area with ReferrerInfoTable */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-lg">Loading referrer data...</div>
            </div>
          ) : (
            <ReferrerInfoTable initialData={referrers} />
          )}
        </main>
      </div>
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