"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  UserPlus, 
  User, 
  Menu, 
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Role = 'DOCTOR' | 'ADMIN';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: Role;
}

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const adminLinks = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Appointments', href: '/admin/appointments', icon: Calendar },
    { name: 'Doctors', href: '/admin/doctors', icon: Users },
    { name: 'Add Doctor', href: '/admin/add-doctor', icon: UserPlus },
  ];

  const doctorLinks = [
    { name: 'Dashboard', href: '/doctor/dashboard', icon: LayoutDashboard },
    { name: 'Appointments', href: '/doctor/appointments', icon: Calendar },
    { name: 'Profile', href: '/doctor/profile', icon: User },
  ];

  const links = role === 'ADMIN' ? adminLinks : doctorLinks;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-gray-50">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:block pt-16 lg:pt-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full px-3 py-6 overflow-y-auto">
          <div className="mb-6 px-3 lg:hidden flex justify-between items-center">
            <span className="text-sm font-semibold uppercase text-gray-500 tracking-wider">Menu</span>
            <button onClick={() => setIsSidebarOpen(false)} className="text-gray-500 hover:text-gray-900">
              <X className="w-5 h-5" />
            </button>
          </div>
          <ul className="space-y-1.5">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-primary-50 text-primary-700" 
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <Icon className={cn("w-5 h-5", isActive ? "text-primary-700" : "text-gray-400")} />
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="mr-3 text-gray-500 hover:text-gray-900 focus:outline-none"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-semibold text-gray-900">
            {role === 'ADMIN' ? 'Admin Dashboard' : 'Doctor Dashboard'}
          </span>
        </div>
        
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
