"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Message sent successfully! We'll get back to you soon.");
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions about our platform or need technical support? We're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
              <div className="bg-primary-50 p-3 rounded-xl text-primary-600">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Email Us</h3>
                <p className="text-gray-600 text-sm">support@medconnect.com</p>
                <p className="text-gray-600 text-sm">info@medconnect.com</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
              <div className="bg-primary-50 p-3 rounded-xl text-primary-600">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Call Us</h3>
                <p className="text-gray-600 text-sm">+1 (555) 123-4567</p>
                <p className="text-gray-600 text-sm">Mon-Fri, 9am to 6pm</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
              <div className="bg-primary-50 p-3 rounded-xl text-primary-600">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Visit Us</h3>
                <p className="text-gray-600 text-sm">123 Healthcare Avenue,<br/>Medical District, NY 10001</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input required type="text" id="name" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" placeholder="John Doe" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input required type="email" id="email" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" placeholder="john@example.com" />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input required type="text" id="subject" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" placeholder="How can we help?" />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea required id="message" rows={5} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none" placeholder="Write your message here..."></textarea>
                </div>
                
                <button type="submit" disabled={loading} className="w-full md:w-auto px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                  {loading ? "Sending..." : <><Send className="w-5 h-5" /> Send Message</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
