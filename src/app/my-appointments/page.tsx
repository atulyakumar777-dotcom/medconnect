"use client";

import { useState, useEffect } from "react";
import { formatCurrency, formatDate, formatTime, getInitials } from "@/lib/utils";
import toast from "react-hot-toast";
import { Loader2, Calendar } from "lucide-react";

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [isCancelling, setIsCancelling] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/appointments/my");
      const data = await res.json();
      if (data.success) {
        setAppointments(data.appointments);
      }
    } catch (error) {
      toast.error("Failed to load appointments");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    
    setIsCancelling(id);
    try {
      const res = await fetch(`/api/appointments/${id}/cancel`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Appointment cancelled");
        fetchAppointments();
      } else {
        toast.error(data.message || "Failed to cancel");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsCancelling(null);
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredAppointments = appointments.filter((app) => {
    const appDate = new Date(app.slotDate);
    if (tab === "upcoming") {
      return appDate >= today && app.status !== "CANCELLED" && app.status !== "COMPLETED";
    } else {
      return appDate < today || app.status === "CANCELLED" || app.status === "COMPLETED";
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Appointments</h1>

      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setTab("upcoming")}
            className={`${
              tab === "upcoming"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setTab("past")}
            className={`${
              tab === "past"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Past
          </button>
        </nav>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No appointments</h3>
          <p className="mt-1 text-sm text-gray-500">
            You don't have any {tab} appointments.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-lg">
                  {getInitials(app.doctor.user.name)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{app.doctor.user.name}</h3>
                  <p className="text-sm text-gray-500">{app.doctor.specialty}</p>
                  <div className="text-sm text-gray-600 mt-1">
                    {formatDate(app.slotDate)} at {formatTime(app.slotTime)}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:items-end gap-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${app.status === 'CONFIRMED' || app.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : ''}
                    ${app.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${app.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : ''}
                  `}>
                    {app.status}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(app.amount)}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {app.paymentMethod} • <span className={app.paymentStatus === 'PAID' ? 'text-green-600' : 'text-yellow-600'}>{app.paymentStatus}</span>
                </div>
                {(app.status === "PENDING" || app.status === "CONFIRMED") && (
                  <button
                    onClick={() => handleCancel(app.id)}
                    disabled={isCancelling === app.id}
                    className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
                  >
                    {isCancelling === app.id ? "Cancelling..." : "Cancel Appointment"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
