"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SPECIALTIES } from "@/lib/utils";
import toast from "react-hot-toast";

export default function DoctorProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    specialty: "",
    degree: "",
    experience: 0,
    about: "",
    fees: 0,
    addressLine: "",
    available: true,
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/doctor/profile");
        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();
        
        setFormData({
          name: data.user.name || "",
          email: data.user.email || "",
          specialty: data.specialty || "",
          degree: data.degree || "",
          experience: data.experience || 0,
          about: data.about || "",
          fees: data.fees || 0,
          addressLine: data.addressLine || "",
          available: data.available !== false, // default true
        });
      } catch (error) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'experience' || name === 'fees') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/doctor/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="DOCTOR">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="DOCTOR">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1">Manage your public profile and practice details</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          {/* Personal Info */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
            </div>
          </div>

          {/* Professional Info */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Professional Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
                <select
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  <option value="">Select a specialty</option>
                  {SPECIALTIES.map(s => (
                    <option key={s.slug} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Degree(s)</label>
                <input
                  type="text"
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  required
                  placeholder="e.g. MBBS, MD"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">About (Bio)</label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="Tell patients about your expertise and background..."
              />
            </div>
          </div>

          {/* Practice Info */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Practice Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Fee ($)</label>
                <input
                  type="number"
                  name="fees"
                  value={formData.fees}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Clinic Address</label>
                <input
                  type="text"
                  name="addressLine"
                  value={formData.addressLine}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Street address, City"
                />
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="available"
                name="available"
                checked={formData.available}
                onChange={handleChange}
                className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="available" className="ml-2 block text-sm text-gray-900 font-medium">
                I am currently accepting new appointments
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
