"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Star, MapPin, Loader2, Calendar } from "lucide-react";
import { SPECIALTIES, getInitials, formatCurrency } from "@/lib/utils";

function DoctorsList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState(searchParams.get("specialty") || "all");

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        let url = '/api/doctors?';
        if (selectedSpecialty !== 'all') {
          url += `specialty=${selectedSpecialty}&`;
        }
        if (searchTerm) {
          url += `search=${searchTerm}`;
        }
        
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setDoctors(data);
        }
      } catch (error) {
        console.error("Failed to fetch doctors", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [selectedSpecialty, searchTerm]);

  const handleSpecialtyChange = (slug: string) => {
    setSelectedSpecialty(slug);
    if (slug === 'all') {
      router.push('/doctors');
    } else {
      router.push(`/doctors?specialty=${slug}`);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-10">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          
          {/* Search */}
          <div className="w-full md:w-1/3 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search doctors by name..." 
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Specialties Scrollable Row */}
          <div className="w-full md:w-2/3 flex overflow-x-auto pb-2 scrollbar-hide gap-3">
            <button
              onClick={() => handleSpecialtyChange('all')}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full font-medium text-sm transition-colors ${
                selectedSpecialty === 'all' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Specialties
            </button>
            {SPECIALTIES.map(s => (
              <button
                key={s.slug}
                onClick={() => handleSpecialtyChange(s.slug)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-full font-medium text-sm transition-colors flex items-center gap-2 ${
                  selectedSpecialty === s.slug 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{s.icon}</span> {s.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Doctor Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
        </div>
      ) : doctors.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="text-5xl mb-4">🩺</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No doctors found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          <button 
            onClick={() => {setSearchTerm(""); setSelectedSpecialty("all");}}
            className="mt-6 text-primary-600 font-medium hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {doctors.map(doctor => (
            <div key={doctor.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group">
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative">
                    {doctor.user.image ? (
                      <Image src={doctor.user.image} alt={doctor.user.name} width={70} height={70} className="rounded-full object-cover" />
                    ) : (
                      <div className="w-[70px] h-[70px] bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-2xl font-bold">
                        {getInitials(doctor.user.name)}
                      </div>
                    )}
                    {doctor.available && (
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-primary-600 transition-colors line-clamp-1">{doctor.user.name}</h3>
                    <p className="text-primary-600 font-medium text-sm mb-1">{doctor.specialty}</p>
                    <p className="text-gray-500 text-xs">{doctor.degree}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span>{doctor.experience} Yrs Exp.</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-gray-900">{formatCurrency(doctor.fees)}</span>
                  </div>
                </div>

                <Link href={`/doctors/${doctor.id}`} className="block w-full bg-primary-600 text-white hover:bg-primary-700 text-center py-3 rounded-xl font-medium transition-colors shadow-sm">
                  Book Appointment
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default function DoctorsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find a Doctor</h1>
          <p className="text-gray-600 text-lg">Browse our directory of top medical professionals.</p>
        </div>

        <Suspense fallback={<div className="flex justify-center items-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary-600" /></div>}>
          <DoctorsList />
        </Suspense>

      </div>
    </div>
  );
}
