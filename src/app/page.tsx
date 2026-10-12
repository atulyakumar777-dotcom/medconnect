import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, Calendar, Shield, Clock } from "lucide-react";
import prisma from "@/lib/prisma";
import { SPECIALTIES, getInitials, formatCurrency } from "@/lib/utils";

export default async function Home() {
  const topDoctors = await prisma.doctor.findMany({
    where: { available: true },
    include: {
      user: {
        select: { name: true, image: true }
      }
    },
    orderBy: { experience: 'desc' },
    take: 8
  });

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Your Health, Our Priority
            </h1>
            <p className="text-lg md:text-xl text-primary-100 mb-10">
              Book appointments with the best doctors in your area. Quick, easy, and secure healthcare access at your fingertips.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/doctors" className="bg-white text-primary-700 hover:bg-gray-50 px-8 py-3 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2 shadow-lg">
                Book Appointment <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/about" className="bg-primary-700 text-white hover:bg-primary-600 border border-primary-500 px-8 py-3 rounded-xl font-bold text-lg transition-colors flex items-center justify-center">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Specialty Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse by Specialty</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Find the right specialist for your healthcare needs.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {SPECIALTIES.slice(0, 6).map((specialty) => (
              <Link key={specialty.slug} href={`/doctors?specialty=${specialty.slug}`}>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-200 transition-all text-center group cursor-pointer h-full flex flex-col items-center justify-center">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{specialty.icon}</div>
                  <h3 className="font-semibold text-gray-900 text-sm">{specialty.name}</h3>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/doctors" className="text-primary-600 font-medium hover:text-primary-700 flex items-center justify-center gap-2">
              View all specialties <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Top Doctors Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Top Rated Doctors</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Book appointments with our most experienced medical professionals.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {topDoctors.map((doctor) => (
              <div key={doctor.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    {doctor.user.image ? (
                      <Image src={doctor.user.image} alt={doctor.user.name} width={60} height={60} className="rounded-full object-cover" />
                    ) : (
                      <div className="w-16 h-16 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xl font-bold">
                        {getInitials(doctor.user.name)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-gray-900 line-clamp-1">{doctor.user.name}</h3>
                      <p className="text-sm text-primary-600 font-medium">{doctor.specialty}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-gray-600 gap-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span>{doctor.experience} Years Experience</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 gap-2">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span>{doctor.degree}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-4 mb-4">
                    <span className="text-sm text-gray-500">Consultation Fee</span>
                    <span className="font-bold text-gray-900">{formatCurrency(doctor.fees)}</span>
                  </div>

                  <Link href={`/doctors/${doctor.id}`} className="block w-full bg-primary-50 text-primary-700 hover:bg-primary-600 hover:text-white text-center py-2.5 rounded-xl font-medium transition-colors">
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Banner Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary-600 rounded-3xl p-10 md:p-16 text-center text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">Book Your Appointment Today</h2>
            <p className="text-primary-100 mb-8 max-w-2xl mx-auto relative z-10 text-lg">
              Take the first step towards better health. Our platform makes it easy to find and book the right doctor for you.
            </p>
            <Link href="/doctors" className="inline-flex bg-white text-primary-700 hover:bg-gray-50 px-8 py-3 rounded-xl font-bold text-lg transition-colors relative z-10 items-center gap-2 shadow-md">
              Find a Doctor
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
