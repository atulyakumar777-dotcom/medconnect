"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { formatCurrency, formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import Image from "next/image";

type Tab = "ALL" | "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("ALL");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const statusParam = activeTab === "ALL" ? "" : `?status=${activeTab}`;
      const res = await fetch(`/api/doctor/appointments${statusParam}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setAppointments(json);
    } catch (error) {
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [activeTab]);

  const updateStatus = async (id: string, newStatus: string) => {
    if (newStatus === "CANCELLED") {
      if (!confirm("Are you sure you want to cancel this appointment?")) return;
    }

    setActionLoading(id);
    try {
      const res = await fetch(`/api/doctor/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");
      
      toast.success(`Appointment ${newStatus.toLowerCase()} successfully`);
      fetchAppointments();
    } catch (error) {
      toast.error("Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  const tabs: { label: string, value: Tab }[] = [
    { label: "All", value: "ALL" },
    { label: "Pending", value: "PENDING" },
    { label: "Confirmed", value: "CONFIRMED" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Cancelled", value: "CANCELLED" },
  ];

  return (
    <DashboardLayout role="DOCTOR">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600 mt-1">Manage your patient appointments</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 border-b border-gray-200 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.value
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="text-gray-400 mb-2">📅</div>
          <h3 className="text-lg font-medium text-gray-900">No appointments found</h3>
          <p className="text-gray-500 mt-1">You don't have any {activeTab !== "ALL" ? activeTab.toLowerCase() : ""} appointments.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {appointments.map((apt) => (
            <div key={apt.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold overflow-hidden flex-shrink-0">
                  {apt.patient.image ? (
                    <Image src={apt.patient.image} alt={apt.patient.name} width={48} height={48} className="object-cover" />
                  ) : (
                    apt.patient.name.charAt(0)
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{apt.patient.name}</h4>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mt-1">
                    <span>{formatDate(apt.slotDate)} at {apt.slotTime}</span>
                    <span>{apt.patient.phone || apt.patient.email}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${apt.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                        apt.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                        apt.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {apt.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatCurrency(apt.amount)} • {apt.paymentMethod} 
                      ({apt.paymentStatus})
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 md:self-center self-end">
                {apt.status === 'PENDING' && (
                  <>
                    <button 
                      onClick={() => updateStatus(apt.id, 'CONFIRMED')}
                      disabled={actionLoading === apt.id}
                      className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                      Confirm
                    </button>
                    <button 
                      onClick={() => updateStatus(apt.id, 'CANCELLED')}
                      disabled={actionLoading === apt.id}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </>
                )}
                
                {apt.status === 'CONFIRMED' && (
                  <>
                    <button 
                      onClick={() => updateStatus(apt.id, 'COMPLETED')}
                      disabled={actionLoading === apt.id}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                      Complete
                    </button>
                    <button 
                      onClick={() => updateStatus(apt.id, 'CANCELLED')}
                      disabled={actionLoading === apt.id}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </>
                )}
                
                {(apt.status === 'COMPLETED' || apt.status === 'CANCELLED') && (
                  <button 
                    disabled
                    className="px-4 py-2 bg-gray-50 text-gray-400 text-sm font-medium rounded-lg border border-gray-100"
                  >
                    No actions
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
