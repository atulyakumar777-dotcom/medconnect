"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { Users, Stethoscope, Calendar, IndianRupee } from "lucide-react";

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return (
      <DashboardLayout role="ADMIN">
        <div className="flex h-64 items-center justify-center">
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  const statCards = [
    { label: "Total Revenue", value: formatCurrency(data.totalRevenue), icon: IndianRupee, color: "text-green-600", bg: "bg-green-100" },
    { label: "Total Doctors", value: data.totalDoctors, icon: Stethoscope, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Total Patients", value: data.totalPatients, icon: Users, color: "text-purple-600", bg: "bg-purple-100" },
    { label: "Total Appointments", value: data.totalAppointments, icon: Calendar, color: "text-orange-600", bg: "bg-orange-100" },
  ];

  return (
    <DashboardLayout role="ADMIN">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back. Here is the platform overview.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4">
              <div className={cn("p-4 rounded-full", stat.bg, stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Recent Appointments</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                  <th className="px-6 py-3 font-medium">Patient</th>
                  <th className="px-6 py-3 font-medium">Doctor</th>
                  <th className="px-6 py-3 font-medium">Specialty</th>
                  <th className="px-6 py-3 font-medium">Date & Time</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.recentAppointments.map((apt: any) => (
                  <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{apt.patient.name}</div>
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
                      <div className="text-xs text-gray-500">{apt.paymentStatus}</div>
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
                  </tr>
                ))}
                {data.recentAppointments.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No recent appointments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
