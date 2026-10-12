import React from 'react';
import Link from 'next/link';
import { Cross, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { SPECIALTIES } from '@/lib/utils';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-primary-600 text-white p-1.5 rounded-lg">
                <Cross className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white">MedConnect</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Making healthcare accessible, affordable, and convenient for everyone. Book appointments with top doctors across specialties.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link href="/" className="hover:text-primary-400 transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-primary-400 transition-colors">About Us</Link></li>
              <li><Link href="/doctors" className="hover:text-primary-400 transition-colors">Find a Doctor</Link></li>
              <li><Link href="/contact" className="hover:text-primary-400 transition-colors">Contact</Link></li>
              <li><Link href="/faq" className="hover:text-primary-400 transition-colors">FAQs</Link></li>
            </ul>
          </div>

          {/* Specialties */}
          <div>
            <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Top Specialties</h3>
            <ul className="space-y-4">
              {SPECIALTIES?.slice(0, 5).map((specialty) => (
                <li key={specialty.slug}>
                  <Link href={`/doctors?specialty=${specialty.slug}`} className="hover:text-primary-400 transition-colors">
                    {specialty.name}
                  </Link>
                </li>
              )) || (
                <>
                  <li><Link href="/doctors?specialty=Cardiology" className="hover:text-primary-400 transition-colors">Cardiology</Link></li>
                  <li><Link href="/doctors?specialty=Neurology" className="hover:text-primary-400 transition-colors">Neurology</Link></li>
                  <li><Link href="/doctors?specialty=Orthopedics" className="hover:text-primary-400 transition-colors">Orthopedics</Link></li>
                  <li><Link href="/doctors?specialty=Pediatrics" className="hover:text-primary-400 transition-colors">Pediatrics</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                <span>123 Medical Center Blvd,<br />Suite 100, New York, NY 10001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400 shrink-0" />
                <span>support@medconnect.com</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400 text-center md:text-left">
            &copy; {currentYear} MedConnect. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
