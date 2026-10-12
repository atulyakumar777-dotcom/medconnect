"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Cross, Menu, X, ChevronDown, User, Calendar, LayoutDashboard, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Doctors', href: '/doctors' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const getDashboardLink = () => {
    if (session?.user?.role === 'DOCTOR') return '/doctor/dashboard';
    if (session?.user?.role === 'ADMIN') return '/admin/dashboard';
    return '/patient/dashboard';
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary-600 text-white p-1.5 rounded-lg">
              <Cross className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-gray-900">MedConnect</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary-600",
                  pathname === link.href ? "text-primary-600" : "text-gray-600"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {status === 'loading' ? (
              <div className="w-24 h-9 bg-gray-100 animate-pulse rounded-lg" />
            ) : session ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold text-sm">
                    {session.user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{session.user?.name}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 overflow-hidden z-50">
                    {session.user?.role === 'PATIENT' ? (
                      <Link href="/patient/appointments" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <Calendar className="w-4 h-4" /> My Appointments
                      </Link>
                    ) : (
                      <Link href={getDashboardLink()} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Link>
                    )}
                    <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <User className="w-4 h-4" /> Profile
                    </Link>
                    <div className="border-t border-gray-100 my-1" />
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-primary-600 px-3 py-2">
                  Login
                </Link>
                <Link href="/register" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "block px-3 py-2 rounded-lg text-base font-medium",
                  pathname === link.href ? "bg-primary-50 text-primary-700" : "text-gray-700 hover:bg-gray-50"
                )}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="border-t border-gray-100 my-4" />
            
            {session ? (
              <div className="space-y-1">
                <div className="px-3 py-2 mb-2">
                  <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
                  <p className="text-xs text-gray-500">{session.user?.email}</p>
                </div>
                {session.user?.role === 'PATIENT' ? (
                  <Link href="/patient/appointments" className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50">
                    My Appointments
                  </Link>
                ) : (
                  <Link href={getDashboardLink()} className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50">
                    Dashboard
                  </Link>
                )}
                <Link href="/profile" className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50">
                  Profile
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 mt-4 px-3">
                <Link href="/login" className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
                  Login
                </Link>
                <Link href="/register" className="flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
