import Image from "next/image";
import { CheckCircle } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Banner */}
      <section className="bg-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About MedConnect</h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Transforming healthcare access by connecting patients with top-tier medical professionals.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                At MedConnect, we believe that accessing quality healthcare should be simple, seamless, and transparent. Our platform is designed to bridge the gap between patients seeking medical care and qualified doctors available to help.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                We empower patients to take control of their health by providing an easy way to find specialists, view their profiles, compare consultation fees, and book appointments instantly online.
              </p>
              <ul className="space-y-3">
                {['Verified Medical Professionals', 'Instant Online Booking', 'Transparent Pricing', 'Secure Data Privacy'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-800 font-medium">
                    <CheckCircle className="w-5 h-5 text-accent-500" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-100 rounded-2xl h-[400px] relative overflow-hidden flex items-center justify-center border border-gray-200">
               <div className="text-6xl">🏥</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-extrabold text-primary-600 mb-2">1000+</div>
              <div className="text-gray-600 font-medium">Happy Patients</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-primary-600 mb-2">50+</div>
              <div className="text-gray-600 font-medium">Verified Doctors</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-primary-600 mb-2">24/7</div>
              <div className="text-gray-600 font-medium">Support Available</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-primary-600 mb-2">100%</div>
              <div className="text-gray-600 font-medium">Trusted Platform</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Vision Section */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            We envision a future where geographical barriers and administrative hurdles no longer stand between patients and the care they need. MedConnect strives to be the leading digital health platform, continuously innovating to bring comprehensive care solutions to your fingertips.
          </p>
        </div>
      </section>
    </main>
  );
}
