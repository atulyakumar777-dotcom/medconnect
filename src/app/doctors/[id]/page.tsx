"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { Loader2, Star, MapPin, GraduationCap, Clock, Info, CheckCircle2 } from "lucide-react";
import { getInitials, formatCurrency, getDayName } from "@/lib/utils";

const getNext7Days = () => {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dates.push({
      date: date,
      dayName: getDayName(date).slice(0, 3).toUpperCase(),
      dayNumber: date.getDate(),
      monthName: date.toLocaleString('default', { month: 'short' }),
      isoDate: date.toISOString().split('T')[0],
      dayOfWeek: getDayName(date).toUpperCase()
    });
  }
  return dates;
};

export default function DoctorProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const dates = getNext7Days();
  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  
  const [booking, setBooking] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'ONLINE'>('CASH');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await fetch(`/api/doctors/${id}`);
        if (res.ok) {
          const data = await res.json();
          setDoctor(data);
        } else {
          toast.error("Doctor not found");
          router.push('/doctors');
        }
      } catch (error) {
        toast.error("Failed to load doctor profile");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDoctor();
  }, [id, router]);

  useEffect(() => {
    if (doctor && selectedDate) {
      const daySlots = doctor.slots.filter((s: any) => s.day === selectedDate.dayOfWeek);
      
      const bookedForDate = doctor.bookedAppointments?.filter((a: any) => a.slotDate === selectedDate.isoDate) || [];
      const bookedTimeStrings = bookedForDate.map((a: any) => a.slotTime);
      
      const filteredSlots = daySlots.map((slot: any) => ({
        ...slot,
        isBooked: bookedTimeStrings.includes(slot.startTime)
      })).sort((a: any, b: any) => a.startTime.localeCompare(b.startTime));
      
      setAvailableSlots(filteredSlots);
      setSelectedSlot(null);
    }
  }, [doctor, selectedDate]);

  const handleBookClick = () => {
    if (status === 'unauthenticated') {
      toast.error("Please login to book an appointment");
      router.push(`/login?callbackUrl=/doctors/${id}`);
      return;
    }
    if (!selectedSlot) {
      toast.error("Please select a time slot");
      return;
    }
    setShowPaymentModal(true);
  };

  const confirmBooking = async () => {
    setBooking(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: doctor.id,
          slotDate: selectedDate.isoDate,
          slotTime: selectedSlot.startTime,
          paymentMethod,
          amount: doctor.fees
        })
      });
      
      if (res.ok) {
        toast.success("Appointment booked successfully!");
        router.push('/dashboard');
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to book appointment");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setBooking(false);
      setShowPaymentModal(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-primary-600" /></div>;
  }

  if (!doctor) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Doctor Profile */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8">
              <div className="flex-shrink-0 mx-auto md:mx-0">
                {doctor.user.image ? (
                  <Image src={doctor.user.image} alt={doctor.user.name} width={150} height={150} className="rounded-2xl object-cover shadow-md" />
                ) : (
                  <div className="w-[150px] h-[150px] bg-primary-100 text-primary-700 rounded-2xl flex items-center justify-center text-5xl font-bold shadow-md">
                    {getInitials(doctor.user.name)}
                  </div>
                )}
              </div>
              
              <div className="flex-grow text-center md:text-left">
                <div className="inline-block bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium mb-3">
                  {doctor.specialty}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{doctor.user.name}</h1>
                <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2 mb-4">
                  <GraduationCap className="w-5 h-5" /> {doctor.degree}
                </p>
                
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="bg-gray-50 px-4 py-2 rounded-lg flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold">{doctor.experience} Years Exp.</span>
                  </div>
                  <div className="bg-gray-50 px-4 py-2 rounded-lg flex items-center gap-2">
                    <span className="font-semibold text-primary-700">{formatCurrency(doctor.fees)} / Visit</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-primary-600" /> About Doctor
              </h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {doctor.about || "No description provided."}
              </p>
              
              {doctor.addressLine && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary-600" /> Clinic Address
                  </h3>
                  <p className="text-gray-600">{doctor.addressLine}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Booking Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Book Appointment</h2>
              
              {/* Date Picker */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-gray-900">Select Date</span>
                  <span className="text-sm text-gray-500">{selectedDate.monthName} {selectedDate.date.getFullYear()}</span>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x">
                  {dates.map((d, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(d)}
                      className={`flex-shrink-0 w-[60px] h-[75px] rounded-xl flex flex-col items-center justify-center snap-center transition-all ${
                        selectedDate.isoDate === d.isoDate 
                          ? 'bg-primary-600 text-white shadow-md' 
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <span className="text-xs font-medium mb-1">{d.dayName}</span>
                      <span className="text-xl font-bold">{d.dayNumber}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div className="mb-8">
                <span className="font-semibold text-gray-900 block mb-3">Select Time</span>
                
                {availableSlots.length === 0 ? (
                  <div className="text-center py-6 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-gray-500 text-sm">No slots available for this date.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots.map((slot: any) => (
                      <button
                        key={slot.id}
                        disabled={slot.isBooked}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 px-1 rounded-lg text-sm font-medium transition-all ${
                          slot.isBooked
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                            : selectedSlot?.id === slot.id
                              ? 'bg-primary-600 text-white shadow-md'
                              : 'bg-white text-gray-700 border border-gray-200 hover:border-primary-400 hover:text-primary-700'
                        }`}
                      >
                        {slot.startTime}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={handleBookClick}
                disabled={!selectedSlot}
                className={`w-full py-3.5 rounded-xl font-bold text-lg transition-all flex justify-center items-center gap-2 ${
                  !selectedSlot
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-lg'
                }`}
              >
                {selectedSlot ? `Book for ${formatCurrency(doctor.fees)}` : 'Select a time slot'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Booking</h3>
            
            <div className="bg-gray-50 p-4 rounded-xl mb-6 text-sm">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Doctor:</span>
                <span className="font-semibold">{doctor.user.name}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Date:</span>
                <span className="font-semibold">{selectedDate.dayName}, {selectedDate.date.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Time:</span>
                <span className="font-semibold">{selectedSlot?.startTime}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
                <span className="font-bold text-gray-900">Total Amount:</span>
                <span className="font-bold text-primary-600 text-lg">{formatCurrency(doctor.fees)}</span>
              </div>
            </div>

            <div className="mb-6">
              <span className="font-semibold text-gray-900 block mb-3">Select Payment Method</span>
              <div className="space-y-3">
                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'ONLINE' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}>
                  <input type="radio" name="payment" className="hidden" checked={paymentMethod === 'ONLINE'} onChange={() => setPaymentMethod('ONLINE')} />
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${paymentMethod === 'ONLINE' ? 'border-primary-600' : 'border-gray-400'}`}>
                    {paymentMethod === 'ONLINE' && <div className="w-2.5 h-2.5 bg-primary-600 rounded-full"></div>}
                  </div>
                  <span className="font-medium text-gray-900">Pay Online Now</span>
                </label>
                
                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'CASH' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}>
                  <input type="radio" name="payment" className="hidden" checked={paymentMethod === 'CASH'} onChange={() => setPaymentMethod('CASH')} />
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${paymentMethod === 'CASH' ? 'border-primary-600' : 'border-gray-400'}`}>
                    {paymentMethod === 'CASH' && <div className="w-2.5 h-2.5 bg-primary-600 rounded-full"></div>}
                  </div>
                  <span className="font-medium text-gray-900">Pay at Clinic (Cash)</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowPaymentModal(false)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-medium transition-colors">
                Cancel
              </button>
              <button onClick={confirmBooking} disabled={booking} className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors flex justify-center items-center">
                {booking ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
