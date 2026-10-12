"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Users, Calendar, DollarSign, Activity, Clock } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";

interface DashboardData {
  totalAppointments: number;
  todayAppointments: number;
  totalEarnings: number;
  totalPatients: number;
  latestAppointments: any[];
}

function StatCard({ title, value, icon: Icon, trend }: { title: string, value: string | number, icon: any, trend?: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className="h-12 w-12 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600">
          <Icon size={24} />
        </div>
      </div>
      {trend && <div className="mt-4 text-sm text-gray-600">{trend}</div>}
    </div>
  );
}

export default function DoctorDashboard() {
  const { data: session } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const res = await fetch("/api/doctor/dashboard");
        if (!res.ok) throw new Error("Failed to fetch dashboard data");
        const json = await res.json();
        setData(json);
      } catch (error) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }

    if (session?.user?.role === "DOCTOR") {
      fetchDashboardData();
    }
  }, [session]);

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
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, Dr. {session?.user?.name}</h1>
        <p className="text-gray-600 mt-1">Here's an overview of your practice today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Appointments"
          value={data?.totalAppointments || 0}
          icon={Calendar}
        />
        <StatCard
          title="Today's Appointments"
          value={data?.todayAppointments || 0}
          icon={Clock}
        />
        <StatCard
          title="Total Earnings"
          value={formatCurrency(data?.totalEarnings || 0)}
          icon={DollarSign}
        />
        <StatCard
          title="Total Patients"
          value={data?.totalPatients || 0}
          icon={Users}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Latest Appointments</h2>
          <Link href="/doctor/appointments" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View All
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data?.latestAppointments?.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No recent appointments found.
                  </td>
                </tr>
              ) : (
                data?.latestAppointments?.map((apt) => (
                  <tr key={apt.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold mr-3 overflow-hidden">
                          {apt.patient.image ? (
                            <Image src={apt.patient.image} alt={apt.patient.name} width={40} height={40} className="object-cover" />
                          ) : (
                            apt.patient.name.charAt(0)
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{apt.patient.name}</div>
                          <div className="text-sm text-gray-500">{apt.patient.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900">{formatDate(apt.slotDate)}</div>
                      <div className="text-sm text-gray-500">{apt.slotTime}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${apt.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                          apt.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                          apt.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900">{formatCurrency(apt.amount)}</div>
                      <div className="text-xs text-gray-500">
                        {apt.paymentMethod} • <span className={apt.paymentStatus === 'PAID' ? 'text-green-600' : 'text-yellow-600'}>{apt.paymentStatus}</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
