'use client'

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { PlusCircle, Search, Menu, Bell, HelpCircle, UserCircle2, ChevronDown, Inbox, Calendar, Users, Settings, BarChart2, LogOut, Home } from 'lucide-react';

export default function SidebarContent() {
    const router = useRouter();

    const sidebarItems = [
        { icon: Home, label: "Dashboard", route: "/dashboard" },
        { icon: Inbox, label: "Policy Holder's Info", route: "/policy-holder" },
        { icon: Users, label: "Referrer Info", route: "/referrer-info" },
        { icon: Calendar, label: "Insurance Policy", route: "/insurance-policy" },
        { icon: BarChart2, label: "Reporting", route: "/reporting" },
    ];

    const handleNavigation = (route: string) => {
        router.push(route);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-center items-center mb-8">
                <Image src="/gobingoLogo.jpeg" alt="GoBingo Logo" width={120} height={120} />
            </div>
            <nav className="flex-1">
                {sidebarItems.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => handleNavigation(item.route)}
                        className="flex items-center py-2 px-4 rounded hover:bg-yellow-600 transition-colors w-full text-left"
                    >
                        <item.icon className="mr-2" size={20} />
                        {item.label}
                    </button>
                ))}
            </nav>
        </div>
    );
}
