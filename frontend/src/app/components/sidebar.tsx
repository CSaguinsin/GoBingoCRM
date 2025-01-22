'use client'

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { PlusCircle, Search, Menu, Bell, HelpCircle, UserCircle2, ChevronDown, Inbox, Calendar, Users, Settings, BarChart2, LogOut } from 'lucide-react';

export default function SidebarContent() {
    const router = useRouter();
    const sidebarItems = [
        { icon: Inbox, label: "Policy Holder's Info" },
        { icon: Users, label: "Referrer Info" },
        { icon: Calendar, label: "Insurance Policy" },
        { icon: BarChart2, label: "Reporting" },
    ];
    
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