"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { cn, formatCurrency, getInitials } from "@/lib/utils";
import toast from "react-hot-toast";

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await fetch("/api/admin/doctors");
      const data = await res.json();
      setDoctors(data);
    } catch (err) {
      toast.error("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/doctors/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: !currentStatus }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Doctor marked as ${!currentStatus ? 'available' : 'unavailable'}`);
      fetchDoctors();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  return (
    <DashboardLayout role="ADMIN">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Doctors</h1>
            <p className="text-gray-600 mt-1">Add, update, or deactivate doctor accounts.</p>
          </div>
          <Link
            href="/admin/add-doctor"
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
          >
            Add Doctor
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-500">Loading doctors...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-lg">
                      {getInitials(doctor.user.name)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{doctor.user.name}</h3>
                      <p className="text-sm text-primary-600 font-medium">{doctor.specialty}</p>
                    </div>
                  </div>
                  <span className={cn(
                    "inline-flex px-2 py-1 rounded text-xs font-medium",
                    doctor.available ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  )}>
                    {doctor.available ? "Active" : "Inactive"}
                  </span>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 flex-grow space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Experience:</span>
                    <span className="font-medium text-gray-900">{doctor.experience} Years</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Consultation Fee:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(doctor.fees)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Email:</span>
                    <span className="font-medium text-gray-900 truncate ml-4">{doctor.user.email}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => toggleStatus(doctor.id, doctor.available)}
                    className={cn(
                      "w-full px-4 py-2 rounded-lg font-medium transition-colors border",
                      doctor.available 
                        ? "border-red-200 text-red-600 hover:bg-red-50" 
                        : "border-green-200 text-green-600 hover:bg-green-50"
                    )}
                  >
                    {doctor.available ? "Deactivate Doctor" : "Activate Doctor"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
