"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import { Search } from "lucide-react";

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (statusFilter !== "ALL") query.set("status", statusFilter);
      if (searchQuery) query.set("search", searchQuery);

      const res = await fetch(`/api/admin/appointments?${query.toString()}`);
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search slightly
    const timer = setTimeout(() => {
      fetchAppointments();
    }, 300);
    return () => clearTimeout(timer);
  }, [statusFilter, searchQuery]);

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error();
      toast.success("Appointment cancelled");
      fetchAppointments();
    } catch (err) {
      toast.error("Failed to cancel appointment");
    }
  };

  return (
    <DashboardLayout role="ADMIN">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Appointments</h1>
          <p className="text-gray-600 mt-1">Manage and track all platform appointments.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search patient or doctor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            
            <div className="flex-shrink-0">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                  <th className="px-6 py-3 font-medium">Patient</th>
                  <th className="px-6 py-3 font-medium">Doctor</th>
                  <th className="px-6 py-3 font-medium">Specialty</th>
                  <th className="px-6 py-3 font-medium">Date & Time</th>
                  <th className="px-6 py-3 font-medium">Payment</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading && appointments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      Loading appointments...
                    </td>
                  </tr>
                ) : appointments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      No appointments found.
                    </td>
                  </tr>
                ) : (
                  appointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{apt.patient.name}</div>
                        <div className="text-xs text-gray-500">{apt.patient.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{apt.doctor.user.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">{apt.doctor.specialty}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{formatDate(apt.slotDate)}</div>
                        <div className="text-xs text-gray-500">{apt.slotTime}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{formatCurrency(apt.amount)}</div>
                        <div className="text-xs text-gray-500">
                          {apt.paymentMethod} • <span className={apt.paymentStatus === "PAID" ? "text-green-600 font-medium" : "text-yellow-600"}>{apt.paymentStatus}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                          apt.status === "COMPLETED" ? "bg-green-100 text-green-800" :
                          apt.status === "CONFIRMED" ? "bg-blue-100 text-blue-800" :
                          apt.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        )}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {(apt.status === "PENDING" || apt.status === "CONFIRMED") && (
                          <button
                            onClick={() => handleCancel(apt.id)}
                            className="text-sm text-red-600 hover:text-red-900 font-medium"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
